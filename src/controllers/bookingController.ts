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

    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

   const formattedItems = items.map((item: any) => {
  let serviceId;

  // ✅ handle ALL cases
  if (typeof item.service === "string") {
    serviceId = item.service;
  } else if (item.service?._id) {
    serviceId = item.service._id;
  } else if (item.serviceId) {
    serviceId = item.serviceId;
  } else {
    throw new Error("Missing serviceId");
  }

  return {
    serviceId,
    quantity: item.quantity || 1,
    price: item.price ?? item.service?.price ?? 0, // fallback

    date: item.date,
    time: item.time,
  };
});

    const totalAmount = formattedItems.reduce(
      (sum: number, item: any) =>
        sum + (item.price || 0) * item.quantity,
      0
    );

    const booking = await Booking.create({
      userId,
      items: formattedItems,
      totalAmount,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (err) {
  console.error("❌ CHECKOUT ERROR FULL:", err);
  res.status(500).json({
    message: "Checkout failed",
    error: err.message, // 👈 ADD THIS
  });
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




//paywithCard

export const payWithCard = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const bookingId = req.params.id;

    const {
      transactionId,
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

    if (!cardNumber || !cardHolderName) {
      return res.status(400).json({
        message: "Card details are required",
      });
    }

    // 🔐 Mask card
    const last4 = cardNumber.slice(-4);
    const maskedCard = `**** **** **** ${last4}`;

    booking.status = "paid";

    (booking as any).payment = {
      method: "card",
      transactionId: transactionId || null,
      paidAt: new Date(),
      card: {
        cardHolderName,
        last4: maskedCard,
        expiryMonth,
        expiryYear,
      },
    };

    await booking.save();

    res.json({
      message: "Card payment successful",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Card payment failed" });
  }
};




export const payWithCash = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const bookingId = req.params.id;

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

    // ✅ CASH PAYMENT
    booking.status = "unpaid";

    (booking as any).payment = {
      method: "cash",
      transactionId: null,
      paidAt: new Date(),
      card: null,
    };

    await booking.save();

    res.json({
      message: "Cash payment confirmed",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cash payment failed" });
  }
};