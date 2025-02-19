// src/services/authService.ts
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { SignJWT } from "jose";
import { NavigateFunction } from "react-router-dom";

const SECRET_KEY = new TextEncoder().encode("your_jwt_secret");

export const login = async (
  email: string,
  password: string,
  navigate: NavigateFunction
): Promise<string | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user) {
      alert("❌ No user found.");
      return null;
    }

    // בדיקת Admin דרך Custom Claims
    const idTokenResult = await user.getIdTokenResult();
    if (!idTokenResult.claims?.admin) {
      alert("❌ You do not have admin privileges.");
      return null;
    }

    // צור את ה-JWT
    const token = await new SignJWT({ email: user.email, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(SECRET_KEY);

    localStorage.setItem("token", token);
    console.log("✅ Login successful, JWT stored.");

    // הפניה למסך הניהול
    navigate("/companies");

    return token;
  } catch (error: any) {
    console.error("❌ Login failed:", error.message);
    alert("Login failed: " + error.message);
    return null;
  }
};

export const logout = (navigate: NavigateFunction) => {
  signOut(auth);
  localStorage.removeItem("token");
  console.log("✅ User logged out");
  navigate("/login");
};
