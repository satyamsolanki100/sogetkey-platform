import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      try {
        // Sync subscription status from backend
        if (parsedUser.role === "buyer") {
          const res = await api.get("/subscription/status");

          const updatedUser = {
            ...parsedUser,
            isSubscribed: res.data.isActive,
            subscriptionPlan: res.data.plan,
            subscriptionExpiry: res.data.expiresAt,
          };

          localStorage.setItem("user", JSON.stringify(updatedUser));

          setUser(updatedUser);
        } else {
          setUser(parsedUser);
        }
      } catch (error) {
        // If token invalid or expired
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
