import { auth } from "../config/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { SignJWT } from "jose";
import { NavigateFunction } from "react-router-dom";

const SECRET_KEY = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET || "default_secret"); // ✅ שימוש במשתנה סביבה

export const login = async (
  email: string,
  password: string,
  navigate: NavigateFunction
): Promise<string | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user || !user.email) {
      alert("❌ לא נמצא משתמש עם פרטים אלו.");
      return null;
    }

    // ✅ שליפת ה-IdToken
    const idToken = await user.getIdToken();
    const idTokenResult = await user.getIdTokenResult();

    if (!idTokenResult.claims?.admin) {
      alert("❌ אין לך הרשאות מנהל.");
      return null;
    }

    // ✅ יצירת JWT מאובטח
    const token = await new SignJWT({ email: user.email, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(SECRET_KEY);

    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("firebaseToken", idToken);

    console.log("✅ התחברות בוצעה בהצלחה, טוקן נשמר.");

    // ✅ הפניה למסך הניהול
    navigate("/companies");

    return token;
  } catch (error: any) {
    console.error("❌ שגיאה בהתחברות:", error.message);
    alert("❌ שגיאה בהתחברות: " + (error.message || "נסה שוב."));
    return null;
  }
};

export const logout = async (navigate: NavigateFunction) => {
  try {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("firebaseToken");

    console.log("✅ המשתמש התנתק בהצלחה.");
    navigate("/login");
  } catch (error: any) {
    console.error("❌ שגיאה בהתנתקות:", error.message);
    alert("❌ שגיאה בהתנתקות: " + (error.message || "נסה שוב."));
  }
};

// ✅ פונקציה לבדוק אם המשתמש מחובר
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};
