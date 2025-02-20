// src/components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { Home, Building, MapPin, Users, FileText, BarChart } from "lucide-react";

const Sidebar = () => { // ✅ שימוש בפונקציה וללא `{}` ביצוא
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "bg-gray-700 text-white" : "text-gray-300";

  return (
    <aside className="bg-gray-900 text-white w-64 h-screen p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-center">ניהול מערכת</h2>
      <nav className="space-y-4 flex flex-col">
        <Link to="/dashboard" className={`flex items-center p-3 rounded ${isActive("/dashboard")}`}>
          <Home className="w-5 h-5 mr-2" /> דשבורד
        </Link>
        <Link to="/companies" className={`flex items-center p-3 rounded ${isActive("/companies")}`}>
          <Building className="w-5 h-5 mr-2" /> חברות
        </Link>
        <Link to="/locations" className={`flex items-center p-3 rounded ${isActive("/locations")}`}>
          <MapPin className="w-5 h-5 mr-2" /> מקומות
        </Link>
        <Link to="/employees" className={`flex items-center p-3 rounded ${isActive("/employees")}`}>
          <Users className="w-5 h-5 mr-2" /> עובדים
        </Link>
        <Link to="/activity-log" className={`flex items-center p-3 rounded ${isActive("/activity-log")}`}>
          <FileText className="w-5 h-5 mr-2" /> לוג פעילות
        </Link>
        <Link to="/reports" className={`flex items-center p-3 rounded ${isActive("/reports")}`}>
          <BarChart className="w-5 h-5 mr-2" /> דוחות
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar; // ✅ ווידוא שזה ייצוא `default`
