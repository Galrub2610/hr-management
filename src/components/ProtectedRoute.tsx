import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ שימוש ב-AuthContext

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    console.warn("⚠️ גישה חסומה! המשתמש אינו מחובר.");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
