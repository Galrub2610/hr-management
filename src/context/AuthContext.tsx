import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../config/firebase"; // ✅ ייבוא Firebase
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // ✅ האזנה לשינויים במצב ההתחברות
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ התחברות עם אימות Firebase
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log("✅ התחברות בוצעה בהצלחה:", userCredential.user);
    } catch (error: any) {
      console.error("❌ שגיאה בהתחברות:", error.message);
      throw new Error(error.message);
    }
  };

  // ✅ יציאה מהמערכת עם Firebase
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("✅ המשתמש התנתק בהצלחה.");
    } catch (error: any) {
      console.error("❌ שגיאה בהתנתקות:", error.message);
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
