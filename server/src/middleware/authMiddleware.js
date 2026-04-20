import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ======================================================
   JWT PROTECTION MIDDLEWARE (PRODUCTION READY)
====================================================== */

export const protect = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({ message: "Server configuration error" });
    }

    let token;

    // Extract Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Authentication token missing",
      });
    }

    // Verify token strictly
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "sogetkey-api",
      audience: "sogetkey-users",
      algorithms: ["HS256"],
      clockTolerance: 5, // 5s tolerance for clock drift
    });

    if (!decoded?.id) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      message: "Authentication failed",
    });
  }
};

/* ======================================================
   ROLE BASED ACCESS CONTROL
====================================================== */

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  };
};

/* ======================================================
   SUBSCRIPTION CHECK (BUYER ONLY)
====================================================== */

export const requireSubscription = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  // Admin bypass
  if (req.user.role === "admin") {
    return next();
  }

  const isActive =
    req.user.isSubscribed &&
    req.user.subscriptionExpiry &&
    new Date() < new Date(req.user.subscriptionExpiry);

  if (!isActive) {
    return res.status(403).json({
      message: "Active subscription required to access coupons",
    });
  }

  next();
};
