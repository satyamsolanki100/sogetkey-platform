import express from "express";
import rateLimit from "express-rate-limit";
import { addProduct, searchProduct } from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================================================
   RATE LIMITER FOR PRODUCT SEARCH (PUBLIC ENDPOINT)
   Prevent scraping abuse
====================================================== */

const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many search requests. Please slow down.",
});

/* ======================================================
   ADMIN: Add product (protected)
====================================================== */

router.post("/", protect, authorize("admin"), addProduct);

/* ======================================================
   PUBLIC: Search product
====================================================== */

router.get("/search", searchLimiter, searchProduct);

export default router;
