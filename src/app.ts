import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

import bookingRoutes from "./routes/bookingRoutes.js";





dotenv.config();

const app = express();

// middleware
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/services", serviceRoutes);
app.use("/cart", cartRoutes);
app.use("/bookings", bookingRoutes);






export default app;

function cors(): any {
    throw new Error("Function not implemented.");
}
