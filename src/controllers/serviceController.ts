import { type Request, type Response } from "express";
import Service from "../models/Service.js";

// GET all services
export const getServices = async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;

    let filter: any = {};

    // 🔍 SEARCH FILTER
    if (search) {
      filter.title = { $regex: search, $options: "i" }; // case-insensitive
    }

    // 📂 CATEGORY FILTER
    if (category) {
      filter.category = category;
    }

    const services = await Service.find(filter);

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Error fetching services" });
  }
};

// GET single service
export const getServiceById = async (req: Request, res: Response) => {
  const service = await Service.findById(req.params.id);
  res.json(service);
};



// POST a new service
export const postServices = async (req: Request, res: Response) => {
  try {
    const { title, description, price, duration, category, capacity } = req.body;

    const newService = new Service({
      title,
      description,
      price,
      duration,
      category,
      capacity
    });

    await newService.save();

    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: "Error creating service", error });
  }
};