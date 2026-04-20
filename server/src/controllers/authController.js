import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/* ======================================================
   REGISTER USER
====================================================== */

export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    email = email.toLowerCase().trim();

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 🚫 Block admin creation completely
    if (role === "admin") {
      return res.status(403).json({
        message: "Admin account cannot be created",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email,
      password,
      role: role === "provider" ? "provider" : "buyer",
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isSubscribed: user.isSubscribed,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionExpiry: user.subscriptionExpiry,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

/* ======================================================
   LOGIN USER
====================================================== */

export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isSubscribed: user.isSubscribed,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionExpiry: user.subscriptionExpiry,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    return res.status(500).json({
      message: "Login failed",
    });
  }
};
