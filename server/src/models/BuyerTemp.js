import mongoose from "mongoose";

const buyerTempSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    actionType: {
      type: String,
      enum: ["search", "view"],
      required: true,
    },

    value: {
      type: String, // search query or product name/id
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // ⏱️ 5 minutes (AUTO DELETE)
    },
  },
  { timestamps: false },
);

export default mongoose.model("BuyerTemp", buyerTempSchema);
