import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
      },
      quantity: Number
    }
  ]
});

export default mongoose.model("Cart", cartSchema);