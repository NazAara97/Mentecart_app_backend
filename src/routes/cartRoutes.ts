import express from "express";
import {
  getCart,
  addItem,
  updateItem,
  deleteItem,
  clearCart
} from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware); 

router.get("/", getCart);
router.post("/items", addItem);
router.patch("/items/:itemId", updateItem);
router.delete("/items/:itemId", deleteItem);
router.delete("/clear", clearCart);

export default router;