// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ניווט לאחר התחברות
import { login } from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ מצב טעינה
  const navigate = useNavigate(); // ✅ הוספת ניווט

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("❌ Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const token = await login(email, password, navigate); // ✅ תיקון קריאה לפונקציה
      if (token) {
        localStorage.setItem("token", token);
        toast.success("✅ Logged in successfully!");
        navigate("/dashboard"); // ✅ מעבר לדשבורד
      } else {
        toast.error("❌ Login failed. Invalid credentials.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      toast.error("❌ An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          className={`w-full p-2 rounded transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
