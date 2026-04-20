import express from "express";
import { getProviderEarnings } from "../controllers/providerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/earnings", protect, authorize("provider"), getProviderEarnings);

export default router;
