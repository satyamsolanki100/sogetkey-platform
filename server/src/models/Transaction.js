import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* Embedded product snapshot */
    product: {
      productId: {
        type: String,
        required: true,
        trim: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        default: 0,
        min: 0,
      },
      platform: {
        type: String,
        trim: true,
      },
    },

    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
      required: true,
      index: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    providerReward: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/* =====================================================
   INDEXES (Production Optimized)
===================================================== */

/* Prevent same buyer using same voucher twice (DB level safety) */
transactionSchema.index({ buyer: 1, voucher: 1 }, { unique: true });

/* Faster dashboard queries */
transactionSchema.index({ buyer: 1, createdAt: -1 });
transactionSchema.index({ provider: 1, createdAt: -1 });

/* Optional TTL (Enable only if analytics mode needed) */
/*
transactionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 300 }
);
*/

export default mongoose.model("Transaction", transactionSchema);
