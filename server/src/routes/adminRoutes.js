import express from "express";
import {
  getPendingCoupons,
  approveCoupon,
  rejectCoupon,
  getApprovedCoupons,
} from "../controllers/adminController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   ADMIN ROUTES
   All routes below require ADMIN role
===================================================== */

// Apply admin protection to all routes
router.use(protect);
router.use(authorize("admin"));

/* -------------------------------
   GET: Pending Coupons
-------------------------------- */
router.get("/pending-coupons", getPendingCoupons);

/* -------------------------------
   GET: Approved Coupons (Optional analytics)
-------------------------------- */
router.get("/approved-coupons", getApprovedCoupons);

/* -------------------------------
   PUT: Approve Coupon
-------------------------------- */
router.put("/approve/:id", approveCoupon);

/* -------------------------------
   PUT: Reject Coupon
-------------------------------- */
router.put("/reject/:id", rejectCoupon);

export default router;
