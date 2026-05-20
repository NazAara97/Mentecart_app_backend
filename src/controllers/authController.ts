import type { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 🔹 EMAIL VALIDATION
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// 🔹 PASSWORD VALIDATION
const isValidPassword = (password: string) =>
  password.length >= 6;

// ---------------- SIGNUP ----------------
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ✅ VALIDATION
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // ✅ CHECK EXISTING USER
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // ✅ HASH PASSWORD
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
    });

    // ✅ TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ✅ VALIDATION
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ CHECK USER
    const user = await User.findOne({ email });
    if (!user) {
      // 🔥 Do NOT reveal if user exists (security best practice)
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};