import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { sendOTPEmail } from "../services/emailService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const otp = generateOTP();

      // Store temp registration data
      localStorage.setItem("otp", otp);
      localStorage.setItem("otpEmail", formData.email);
      localStorage.setItem("tempUser", JSON.stringify(formData));

      // Send email
      await sendOTPEmail(formData.name, formData.email, otp);

      toast.success("OTP sent to your email");

      navigate("/verify-otp");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full top-10 -left-20"></div>
      <div className="absolute w-96 h-96 bg-orange-500/20 blur-3xl rounded-full bottom-10 -right-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md bg-[#0b0f1a]/80 backdrop-blur-xl border border-[#1f2937] rounded-2xl p-8 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>

        <p className="text-gray-400 text-center mb-8">Join SoGetkey today</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition"
          >
            <option value="buyer">Buyer</option>
            <option value="provider">Seller</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-orange-600 py-3 rounded-lg font-semibold text-black shadow-lg"
          >
            {loading ? "Sending OTP..." : "Register"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-400 font-semibold hover:text-amber-300"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
