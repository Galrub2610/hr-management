import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      {/* לוגו */}
      <div className="text-xl font-bold">
        <Link to="/dashboard">ניהול כוח אדם</Link>
      </div>

      {/* ניווט */}
      <div className="space-x-4 rtl:space-x-reverse">
        <Link className="hover:text-gray-300" to="/dashboard">דאשבורד</Link>
        <Link className="hover:text-gray-300" to="/companies">חברות</Link>
        <Link className="hover:text-gray-300" to="/locations">מיקומים</Link>
        <Link className="hover:text-gray-300" to="/employees">עובדים</Link>
      </div>

      {/* כפתור התנתקות */}
      {user && (
        <button
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition"
          onClick={logout}
        >
          התנתקות
        </button>
      )}
    </nav>
  );
}
