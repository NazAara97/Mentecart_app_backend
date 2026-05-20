  import express from "express";
  import {
    checkout,
    getBookings,
  cancelBooking,
  payWithCard,
  payWithCash
  
} from "../controllers/bookingController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware); 

router.post("/checkout", checkout);
router.get("/:id", getBookings);
router.post("/:id/cancel", cancelBooking);
router.post("/:id/pay-cash",  payWithCash);
router.post("/:id/pay-card",  payWithCard);


export default router;