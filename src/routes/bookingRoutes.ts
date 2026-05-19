  import express from "express";
  import {
    checkout,
    getBookings,
  cancelBooking,
  payment
} from "../controllers/bookingController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware); 

router.post("/checkout", checkout);
router.get("/:id", getBookings);
router.post("/:id/cancel", cancelBooking);
router.post("/:id/payment", payment);

export default router;