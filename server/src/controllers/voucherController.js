import Voucher from "../models/Voucher.js";
import multer from "multer";
import path from "path";
import fs from "fs";

/* =====================================================
   ENSURE UPLOAD DIRECTORY EXISTS
===================================================== */

const uploadPath = path.join("uploads", "coupons");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/* =====================================================
   MULTER CONFIG
===================================================== */

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const safeExt = path.extname(file.originalname).toLowerCase();
    cb(null, `coupon_${Date.now()}${safeExt}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExt = [".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExt.includes(ext)) {
    return cb(new Error("Only JPG, JPEG, PNG files allowed"));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter,
});

/* =====================================================
   PROVIDER: UPLOAD VOUCHER
===================================================== */

export const uploadVoucher = async (req, res) => {
  try {
    const {
      code,
      platform,
      discountType,
      discountValue,
      expiryDate,
      productId,
      productTitle,
      productImage,
      productPrice,
    } = req.body;

    if (
      !code ||
      !platform ||
      !discountType ||
      !discountValue ||
      !expiryDate ||
      !productId ||
      !productTitle ||
      !req.file
    ) {
      return res.status(400).json({
        message:
          "All fields including product details and proof image are required",
      });
    }

    if (!["flat", "percent"].includes(discountType)) {
      return res.status(400).json({
        message: "Invalid discount type",
      });
    }

    const numericDiscount = Number(discountValue);
    if (isNaN(numericDiscount) || numericDiscount <= 0) {
      return res.status(400).json({
        message: "Invalid discount value",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(expiryDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return res.status(400).json({
        message: "Expiry date must be in the future",
      });
    }

    const upperCode = code.toUpperCase().trim();

    const existingCode = await Voucher.findOne({ code: upperCode });
    if (existingCode) {
      return res.status(400).json({
        message: "Coupon already exists",
      });
    }

    const duplicateProductCoupon = await Voucher.findOne({
      uploadedBy: req.user._id,
      "product.productId": productId,
      code: upperCode,
    });

    if (duplicateProductCoupon) {
      return res.status(400).json({
        message: "You already uploaded this coupon for this product",
      });
    }

    const voucher = await Voucher.create({
      code: upperCode,
      platform: platform.trim(),
      discountType,
      discountValue: numericDiscount,
      expiryDate: selectedDate,
      proofImage: req.file.filename,
      uploadedBy: req.user._id,
      isApproved: false,
      rejectionReason: null,
      usedCount: 0,
      providerReward: 50,
      product: {
        productId: String(productId),
        title: productTitle,
        image: productImage || "",
        price: Number(productPrice) || 0,
      },
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    return res.status(201).json({
      ...voucher.toObject(),
      proofImageUrl: `${baseUrl}/uploads/coupons/${voucher.proofImage}`,
    });
  } catch (error) {
    if (req.file) {
      const filePath = path.join(uploadPath, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    console.error("Upload Voucher Error:", error.message);

    return res.status(500).json({
      message: "Failed to upload voucher",
    });
  }
};

/* =====================================================
   PROVIDER: GET OWN VOUCHERS
===================================================== */

export const getProviderVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find({
      uploadedBy: req.user._id,
    }).sort({ createdAt: -1 });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const formatted = vouchers.map((v) => ({
      ...v.toObject(),
      proofImageUrl: `${baseUrl}/uploads/coupons/${v.proofImage}`,
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch vouchers",
    });
  }
};

/* =====================================================
   BUYER: GET COUPONS BY PRODUCT
===================================================== */

export const getCouponsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID required",
      });
    }

    const coupons = await Voucher.find({
      "product.productId": productId,
      isApproved: true,
      expiryDate: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    return res.json(coupons);
  } catch (error) {
    console.error("Fetch Coupons Error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch coupons",
    });
  }
};
