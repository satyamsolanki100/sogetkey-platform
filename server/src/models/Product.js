import mongoose from "mongoose";

const platformSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true, // Amazon, Flipkart, Blinkit
    },
    link: {
      type: String,
      required: true,
    },
    isPreferred: {
      type: Boolean,
      default: false, // boosts recommendation score
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    platforms: [platformSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
