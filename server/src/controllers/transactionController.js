import mongoose from "mongoose";
import Voucher from "../models/Voucher.js";
import Transaction from "../models/Transaction.js";

/* =====================================================
   BUYER: APPLY VOUCHER
   POST /api/transactions/apply
===================================================== */

export const applyTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, productTitle, productPrice, voucherId } = req.body;

    if (!productId || !productTitle || !voucherId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Product details and voucher are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(voucherId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Invalid voucher ID",
      });
    }

    const voucher = await Voucher.findOne({
      _id: voucherId,
      isApproved: true,
      expiryDate: { $gt: new Date() },
    })
      .populate("uploadedBy")
      .session(session);

    if (!voucher) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Invalid or expired voucher",
      });
    }

    const alreadyUsed = await Transaction.findOne({
      buyer: req.user._id,
      voucher: voucher._id,
    }).session(session);

    if (alreadyUsed) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Voucher already used by this user",
      });
    }

    const originalPrice = Number(productPrice) || 0;

    if (originalPrice < 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Invalid product price",
      });
    }

    let discountAmount = 0;

    if (voucher.discountType === "percent") {
      discountAmount = Math.floor(
        (originalPrice * voucher.discountValue) / 100,
      );
    } else {
      discountAmount = voucher.discountValue;
    }

    const finalPrice = Math.max(originalPrice - discountAmount, 0);

    voucher.usedCount += 1;
    await voucher.save({ session });

    const providerReward = voucher.providerReward || 50;

    const transaction = await Transaction.create(
      [
        {
          buyer: req.user._id,
          product: {
            productId,
            title: productTitle.trim(),
            price: originalPrice,
            platform: voucher.platform,
          },
          voucher: voucher._id,
          provider: voucher.uploadedBy._id,
          originalPrice,
          finalPrice,
          providerReward,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Voucher applied successfully",
      transactionId: transaction[0]._id,
      redirectPlatform: voucher.platform,
      finalPrice,
      savedAmount: originalPrice - finalPrice,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Apply Transaction Error:", error.message);

    return res.status(500).json({
      message: "Failed to apply voucher",
    });
  }
};

/* =====================================================
   BUYER: GET OWN TRANSACTIONS
   GET /api/transactions/my
===================================================== */

export const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      buyer: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("voucher", "code discountType discountValue")
      .lean();

    const formatted = transactions.map((t) => ({
      ...t,
      redirectPlatform: t.product?.platform || "Platform",
    }));

    return res.json(formatted);
  } catch (error) {
    console.error("Fetch Transactions Error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch transactions",
    });
  }
};
