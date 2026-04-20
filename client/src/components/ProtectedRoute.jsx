import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch → redirect to correct dashboard
  if (role && user.role !== role) {
    if (user.role === "buyer") return <Navigate to="/buyer" replace />;
    if (user.role === "provider") return <Navigate to="/provider" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
