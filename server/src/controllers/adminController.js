import mongoose from "mongoose";
import Voucher from "../models/Voucher.js";

/* =====================================================
   GET ALL PENDING COUPONS
   GET /api/admin/pending-coupons
===================================================== */

export const getPendingCoupons = async (req, res) => {
  try {
    const coupons = await Voucher.find({
      isApproved: false,
      rejectionReason: null,
    })
      .populate("uploadedBy", "email name")
      .sort({ createdAt: -1 });

    return res.json(coupons);
  } catch (error) {
    console.error("Fetch Pending Coupons Error:", error);
    return res.status(500).json({
      message: "Failed to fetch pending coupons",
    });
  }
};

/* =====================================================
   APPROVE COUPON
   PUT /api/admin/approve/:id
===================================================== */

export const approveCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid coupon ID",
      });
    }

    const coupon = await Voucher.findById(id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    if (coupon.isApproved) {
      return res.status(400).json({
        message: "Coupon already approved",
      });
    }

    coupon.isApproved = true;
    coupon.rejectionReason = null;

    await coupon.save();

    return res.json({
      message: "Coupon approved successfully",
    });
  } catch (error) {
    console.error("Approve Coupon Error:", error);
    return res.status(500).json({
      message: "Failed to approve coupon",
    });
  }
};

/* =====================================================
   REJECT COUPON (SOFT REJECT)
   PUT /api/admin/reject/:id
===================================================== */

export const rejectCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid coupon ID",
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    const coupon = await Voucher.findById(id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    if (coupon.isApproved) {
      return res.status(400).json({
        message: "Cannot reject an already approved coupon",
      });
    }

    coupon.isApproved = false;
    coupon.rejectionReason = reason.trim();

    await coupon.save();

    return res.json({
      message: "Coupon rejected successfully",
      reason: coupon.rejectionReason,
    });
  } catch (error) {
    console.error("Reject Coupon Error:", error);
    return res.status(500).json({
      message: "Failed to reject coupon",
    });
  }
};

/* =====================================================
   GET APPROVED COUPONS (Optional Admin Analytics)
   GET /api/admin/approved-coupons
===================================================== */

export const getApprovedCoupons = async (req, res) => {
  try {
    const coupons = await Voucher.find({
      isApproved: true,
    })
      .populate("uploadedBy", "email name")
      .sort({ createdAt: -1 });

    return res.json(coupons);
  } catch (error) {
    console.error("Fetch Approved Coupons Error:", error);
    return res.status(500).json({
      message: "Failed to fetch approved coupons",
    });
  }
};
