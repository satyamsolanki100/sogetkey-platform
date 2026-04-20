import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-amber-400"
      : "text-gray-400 hover:text-gray-200 transition";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#05070d]/90 backdrop-blur-md border-b border-[#1f2937] px-8 py-4 flex justify-between items-center shadow-[0_5px_30px_rgba(0,0,0,0.5)]">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent"
      >
        SoGetkey
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" className={isActive("/")}>
          Home
        </Link>

        {!user && (
          <>
            <Link to="/login" className={isActive("/login")}>
              Login
            </Link>
            <Link to="/register" className={isActive("/register")}>
              Register
            </Link>
          </>
        )}

        {user?.role === "buyer" && (
          <>
            <Link to="/buyer" className={isActive("/buyer")}>
              Dashboard
            </Link>
            <Link to="/search" className={isActive("/search")}>
              Search
            </Link>
          </>
        )}

        {user?.role === "provider" && (
          <>
            <Link to="/provider" className={isActive("/provider")}>
              Dashboard
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin" className={isActive("/admin")}>
              Dashboard
            </Link>
          </>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-semibold hover:opacity-90 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
