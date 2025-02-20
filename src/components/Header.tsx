import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { LogOut, User } from "lucide-react"; // ✅ הוספת אייקון נוסף לשם המשתמש
import { useState, useEffect } from "react";

export function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✅ שליפת שם המשתמש (אם יש טוקן)
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setUsername(userEmail);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    await logout(navigate); // ✅ מעביר את `navigate` לפונקציה כדי להבטיח ניתוב תקין
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-700">📊 ניהול כוח אדם</h1>

      <div className="flex items-center space-x-6">
        {/* ✅ הצגת שם המשתמש אם קיים, עם אנימציה */}
        {isLoading ? (
          <span className="text-gray-500 animate-pulse">טוען...</span>
        ) : (
          username && (
            <div className="flex items-center gap-2 text-gray-600">
              <User size={18} className="text-gray-500" />
              <span>{username}</span>
            </div>
          )
        )}

        {/* ✅ כפתור התנתקות משופר עם אנימציה */}
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition active:scale-95"
          aria-label="Logout"
        >
          <LogOut size={20} />
          התנתק
        </button>
      </div>
    </header>
  );
}
