import express from "express";
import {
  startFreeTrial,
  activateMonthlyPlan,
  getSubscriptionStatus,
} from "../controllers/subscriptionController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================
   SUBSCRIPTION ROUTES (PROTECTED)
   Only BUYERS can manage subscriptions
========================================== */

// Start free trial (one-time)
router.post("/trial", protect, authorize("buyer"), startFreeTrial);

// Activate / renew monthly plan
router.post("/monthly", protect, authorize("buyer"), activateMonthlyPlan);

// Check subscription status
router.get("/status", protect, authorize("buyer"), getSubscriptionStatus);

export default router;
