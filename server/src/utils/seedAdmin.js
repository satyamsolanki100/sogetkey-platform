import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const ADMIN_EMAIL = "admin@sogetkey.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_NAME = "System Admin";

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // ❗ DO NOT HASH HERE
      role: "admin",
      isSubscribed: true,
      subscriptionPlan: "monthly",
      subscriptionExpiry: new Date("2099-12-31"),
    });

    console.log("Admin created successfully.");
    console.log("Email:", ADMIN_EMAIL);
    console.log("Password:", ADMIN_PASSWORD);

    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:", error);
    process.exit(1);
  }
};

seedAdmin();
