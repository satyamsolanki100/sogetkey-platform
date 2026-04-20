import express from "express";
import {
  applyTransaction,
  getMyTransactions,
} from "../controllers/transactionController.js";

import {
  protect,
  authorize,
  requireSubscription,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================================================
   BUYER: Apply Voucher
   🔒 Subscription Required
   POST /api/transactions/apply
====================================================== */

router.post(
  "/apply",
  protect,
  authorize("buyer"),
  requireSubscription,
  applyTransaction,
);

/* ======================================================
   BUYER: Get Own Transactions
   GET /api/transactions/my
====================================================== */

router.get("/my", protect, authorize("buyer"), getMyTransactions);

export default router;
