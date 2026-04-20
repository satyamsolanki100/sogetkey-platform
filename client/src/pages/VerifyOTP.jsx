import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function VerifyOTP() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    const storedOtp = localStorage.getItem("otp");
    const tempUser = JSON.parse(localStorage.getItem("tempUser"));

    if (!storedOtp || !tempUser) {
      toast.error("Invalid verification request");
      return;
    }

    if (otp !== storedOtp) {
      toast.error("Invalid OTP");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Register user
      const res = await api.post("/auth/register", tempUser);

      // 2️⃣ Store user immediately (important for token usage)
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);

      // 3️⃣ Activate 7-day free trial for buyers only
      if (res.data.role === "buyer") {
        await api.post("/subscription/trial");
      }

      // 4️⃣ Clear temp data
      localStorage.removeItem("otp");
      localStorage.removeItem("otpEmail");
      localStorage.removeItem("tempUser");

      toast.success("Account verified successfully");

      // 5️⃣ Redirect by role
      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "provider") navigate("/provider");
      else navigate("/buyer");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#0b0f1a]/80 backdrop-blur-xl border border-[#1f2937] rounded-2xl p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          Verify your account
        </h2>

        <form onSubmit={handleVerify} className="space-y-5">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="••••••"
            required
            className="w-full text-center tracking-widest text-xl rounded-xl bg-[#05070d] border border-[#1f2937] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-semibold"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default VerifyOTP;
