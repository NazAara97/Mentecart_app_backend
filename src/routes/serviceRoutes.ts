import express from "express";
import { getServices, getServiceById, postServices } from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getServices);
router.get("/:id", getServiceById);
router.post("/post", postServices);

export default router;