import BuyerTemp from "../models/BuyerTemp.js";

/**
 * STORE BUYER TEMP DATA
 * POST /api/buyer/temp
 */
export const storeBuyerTemp = async (req, res) => {
  try {
    const { actionType, value } = req.body;

    if (!actionType || !value) {
      return res.status(400).json({ message: "Invalid temp data" });
    }

    await BuyerTemp.create({
      buyer: req.user._id,
      actionType,
      value,
    });

    res.json({ message: "Temp data stored (auto-delete in 5 min)" });
  } catch (error) {
    res.status(500).json({ message: "Failed to store temp data" });
  }
};
