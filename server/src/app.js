import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import voucherRoutes from "./routes/voucherRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import buyerTempRoutes from "./routes/buyerTempRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";

const app = express();

/* ===============================
BASIC SETTINGS
=============================== */

app.set("trust proxy", 1);

/* ===============================
SECURITY MIDDLEWARE
=============================== */

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(compression());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===============================
CORS (FINAL WORKING VERSION)
=============================== */

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 150 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
});

app.use("/api", limiter);

/* ===============================
STATIC FILES
=============================== */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* ===============================
ROUTES
=============================== */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/buyer", buyerTempRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/provider", providerRoutes);

/* ===============================
HEALTH CHECK
=============================== */

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "SoGetkey API",
    environment: process.env.NODE_ENV || "development",
  });
});

/* ===============================
404 HANDLER
=============================== */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* ===============================
GLOBAL ERROR HANDLER
=============================== */

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
