import express from "express";
import { storeBuyerTemp } from "../controllers/buyerTempController.js";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * BUYER TEMP DATA
 */
router.post("/temp", protect, authorizeRoles("buyer"), storeBuyerTemp);

export default router;
