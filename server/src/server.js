import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

/* ======================================================
   START SERVER (PRODUCTION READY)
====================================================== */

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    // 1️⃣ Connect database
    await connectDB();

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`,
      );
    });

    /* ======================================================
       GRACEFUL SHUTDOWN
    ====================================================== */

    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("Process terminated");
      });
    });

    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Promise Rejection:", err.message);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
