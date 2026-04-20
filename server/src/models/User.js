import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔥 never return password by default
    },

    role: {
      type: String,
      enum: ["admin", "provider", "buyer"],
      default: "buyer",
      index: true,
    },

    /* =========================
       SUBSCRIPTION SYSTEM
    ========================= */

    isSubscribed: {
      type: Boolean,
      default: false,
    },

    subscriptionPlan: {
      type: String,
      enum: ["free", "monthly"],
      default: "free",
    },

    subscriptionExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

/* =====================================================
   PASSWORD HASH
===================================================== */

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* =====================================================
   COMPARE PASSWORD
===================================================== */

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/* =====================================================
   CHECK SUBSCRIPTION
===================================================== */

userSchema.methods.hasActiveSubscription = function () {
  // Admin always active
  if (this.role === "admin") return true;

  if (!this.isSubscribed) return false;
  if (!this.subscriptionExpiry) return false;

  return new Date() < this.subscriptionExpiry;
};

/* =====================================================
   CLEAN JSON RESPONSE
===================================================== */

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model("User", userSchema);
