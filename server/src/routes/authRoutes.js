import express from "express";
import rateLimit from "express-rate-limit";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

/* ==============================
   AUTH RATE LIMIT (STRICT)
============================== */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP
  message: "Too many authentication attempts. Try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/* ==============================
   ROUTES
============================== */

// Register
router.post("/register", authLimiter, registerUser);

// Login
router.post("/login", authLimiter, loginUser);

export default router;
