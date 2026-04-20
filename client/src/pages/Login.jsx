import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "provider") navigate("/provider");
      else navigate("/buyer");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);

      toast.success("Logged in successfully");

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "provider") navigate("/provider");
      else navigate("/buyer");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid email or password");
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
        <h2 className="text-3xl font-bold text-center mb-2">Access Portal</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 py-3 rounded-lg font-semibold text-black"
          >
            {loading ? "Authenticating..." : "Login"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-amber-400 font-semibold hover:text-amber-300"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
