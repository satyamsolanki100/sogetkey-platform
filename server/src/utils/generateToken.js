import jwt from "jsonwebtoken";

/**
 * Generate Secure JWT Token (Production Ready)
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
    issuer: "sogetkey-api",
    audience: "sogetkey-users",
    algorithm: "HS256",
  });
};

export default generateToken;
