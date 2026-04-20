import express from "express";
import {
  uploadVoucher,
  getProviderVouchers,
  getCouponsByProduct,
  upload,
} from "../controllers/voucherController.js";

import {
  protect,
  authorize,
  requireSubscription,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * PROVIDER: Upload new voucher
 */
router.post(
  "/",
  protect,
  authorize("provider"),
  upload.single("image"),
  uploadVoucher,
);

/**
 * PROVIDER: Get own uploaded vouchers
 */
router.get("/", protect, authorize("provider"), getProviderVouchers);

/**
 * BUYER: Get coupons by product
 * 🔒 Subscription Required
 */
router.get(
  "/product/:productId",
  protect,
  authorize("buyer"),
  requireSubscription,
  getCouponsByProduct,
);

export default router;
