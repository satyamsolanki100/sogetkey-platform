import User from "../models/User.js";

/* =====================================================
   START FREE TRIAL (7 DAYS – ONE TIME ONLY)
===================================================== */
export const startFreeTrial = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.json({
        message: "Admin has unlimited access",
        isActive: true,
      });
    }

    // Already subscribed to paid
    if (user.subscriptionPlan === "monthly" && user.hasActiveSubscription()) {
      return res.status(400).json({
        message: "Already on active paid plan",
      });
    }

    // Prevent restarting trial if already used
    if (user.subscriptionPlan === "free" && user.subscriptionExpiry) {
      return res.status(400).json({
        message: "Free trial already used",
      });
    }

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    user.isSubscribed = true;
    user.subscriptionPlan = "free";
    user.subscriptionExpiry = expiry;

    await user.save();

    res.json({
      message: "Free trial activated",
      plan: "free",
      expiresAt: expiry,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to start trial" });
  }
};

/* =====================================================
   ACTIVATE / RENEW MONTHLY PLAN
===================================================== */
export const activateMonthlyPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.json({
        message: "Admin has unlimited access",
        isActive: true,
      });
    }

    const now = new Date();

    let newExpiry;

    // If active plan exists → extend
    if (user.hasActiveSubscription()) {
      newExpiry = new Date(user.subscriptionExpiry);
      newExpiry.setMonth(newExpiry.getMonth() + 1);
    } else {
      newExpiry = new Date();
      newExpiry.setMonth(newExpiry.getMonth() + 1);
    }

    user.isSubscribed = true;
    user.subscriptionPlan = "monthly";
    user.subscriptionExpiry = newExpiry;

    await user.save();

    res.json({
      message: "Monthly subscription activated",
      plan: "monthly",
      expiresAt: newExpiry,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to activate plan" });
  }
};

/* =====================================================
   GET SUBSCRIPTION STATUS
===================================================== */
export const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isActive = user.hasActiveSubscription();

    // Auto-disable expired
    if (!isActive && user.isSubscribed) {
      user.isSubscribed = false;
      await user.save();
    }

    res.json({
      isActive,
      plan: user.subscriptionPlan,
      expiresAt: user.subscriptionExpiry,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch status" });
  }
};
