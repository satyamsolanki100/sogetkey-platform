import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

/**
 * PROVIDER: Get earnings summary (Optimized)
 * Route: GET /api/provider/earnings
 */
export const getProviderEarnings = async (req, res) => {
  try {
    const providerId = new mongoose.Types.ObjectId(req.user._id);

    // Aggregation for performance
    const summary = await Transaction.aggregate([
      {
        $match: { provider: providerId },
      },
      {
        $group: {
          _id: "$provider",
          totalEarnings: { $sum: "$providerReward" },
          totalSales: { $sum: 1 },
        },
      },
    ]);

    const result = summary[0] || {
      totalEarnings: 0,
      totalSales: 0,
    };

    // Fetch recent transactions (limited)
    const recentTransactions = await Transaction.find({
      provider: providerId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.json({
      totalEarnings: result.totalEarnings,
      totalSales: result.totalSales,
      recentTransactions,
    });
  } catch (error) {
    console.error("Provider Earnings Error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch earnings",
    });
  }
};
