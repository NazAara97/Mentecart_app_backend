import type { Request, Response } from "express";
import Cart from "../models/Cart.js";

const getUserId = (req: Request) => {
  if (!req.user) throw new Error("Unauthorized");
  return req.user.id;
};

// GET cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    let cart = await Cart.findOne({ userId })
      .populate("items.serviceId"); // 👈 IMPORTANT

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// ADD item
export const addItem = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $push: { items: req.body } },
      { new: true, upsert: true }
    );

    res.json(cart);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// UPDATE item
export const updateItem = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const { quantity } = req.body;

    const cart = await Cart.findOneAndUpdate(
      {
        userId,
        "items._id": req.params.itemId
      },
      {
        $set: {
          "items.$.quantity": quantity
        }
      },
      { new: true }
    ).populate("items.serviceId");

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { _id: req.params.itemId } } },
      { new: true }
    );

    res.json(cart);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};