import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    platform: {
      type: String,
      required: true,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["flat", "percent"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 1,
    },

    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },

    proofImage: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },

    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* Embedded Product Snapshot */
    product: {
      productId: {
        type: String,
        required: true,
        index: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      image: {
        type: String,
        trim: true,
      },
      price: {
        type: Number,
        min: 0,
      },
    },

    providerReward: {
      type: Number,
      default: 50,
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

/* Fast buyer product lookup */
voucherSchema.index({
  "product.productId": 1,
  isApproved: 1,
  expiryDate: 1,
});

/* Prevent same provider uploading same coupon twice */
voucherSchema.index({ uploadedBy: 1, code: 1 }, { unique: true });

/* Prevent duplicate product coupon per provider */
voucherSchema.index(
  { uploadedBy: 1, "product.productId": 1, code: 1 },
  { unique: true },
);

export default mongoose.model("Voucher", voucherSchema);
