import type { Request, Response } from "express";
import Booking from "../models/Booking.js";
import Cart from "../models/Cart.js";

const getUserId = (req: Request) => {
  if (!req.user) throw new Error("Unauthorized");
  return req.user.id;
};


export const checkout = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const { appointmentDate, items } = req.body; // ✅ accept items

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const formattedItems = items.map((item: any) => ({
      serviceId: item.serviceId,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalAmount = formattedItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const booking = await Booking.create({
      userId,
      items: formattedItems,
      appointmentDate,
      totalAmount,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }

  
};



export const getBookings = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.serviceId");

    res.json(bookings);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};


export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        userId,
      },
      { status: "cancelled" },
      { new: true }
    ).populate("items.serviceId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Cancel failed" });
  }
};


export const payment = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const bookingId = req.params.id;
    const {
      method,
      transactionId,

      // ⚠️ DO NOT store raw values in production
      cardHolderName,
      cardNumber,
      expiryMonth,
      expiryYear,
    } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Cannot pay for cancelled booking",
      });
    }

    // 🔐 Mask card number (only last 4 digits)
    let maskedCard = null;
    if (cardNumber) {
      const last4 = cardNumber.slice(-4);
      maskedCard = `**** **** **** ${last4}`;
    }

    // 💳 update payment info
    booking.status = "confirmed";

    (booking as any).payment = {
      method: method || "cash",
      transactionId: transactionId || null,
      paidAt: new Date(),

      // ✅ SAFE stored info
      card: method === "card"
        ? {
            cardHolderName,
            last4: maskedCard,
            expiryMonth,
            expiryYear,
          }
        : null,
    };

    await booking.save();

    res.json({
      message: "Payment successful and booking confirmed",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment failed" });
  }
};