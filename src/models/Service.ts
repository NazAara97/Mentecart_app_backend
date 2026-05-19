import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  duration: Number,
  category: String,
  capacity: Number
});

export default mongoose.model("Service", serviceSchema);