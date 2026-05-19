import express from "express";
import {
  getCart,
  addItem,
  updateItem,
  deleteItem
} from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware); 

router.get("/", getCart);
router.post("/items", addItem);
router.patch("/items/:itemId", updateItem);
router.delete("/items/:itemId", deleteItem);

export default router;