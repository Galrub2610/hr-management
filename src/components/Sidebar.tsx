import { Link, useLocation } from "react-router-dom";
import { Home, Building, MapPin, Users, FileText, BarChart } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "bg-gray-700 text-white" : "text-gray-300";

  return (
    <aside className="fixed right-0 top-0 h-full w-64 pr-64 bg-gray-900 text-white shadow-lg flex flex-col p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-center">ניהול מערכת</h2>
      <nav className="space-y-4 flex flex-col">
        <Link to="/dashboard" className={`flex items-center p-3 rounded ${isActive("/dashboard")}`}>
          <Home className="w-5 h-5 ml-2" /> דשבורד
        </Link>
        <Link to="/companies" className={`flex items-center p-3 rounded ${isActive("/companies")}`}>
          <Building className="w-5 h-5 ml-2" /> חברות
        </Link>
        <Link to="/locations" className={`flex items-center p-3 rounded ${isActive("/locations")}`}>
          <MapPin className="w-5 h-5 ml-2" /> מקומות
        </Link>
        <Link to="/employees" className={`flex items-center p-3 rounded ${isActive("/employees")}`}>
          <Users className="w-5 h-5 ml-2" /> עובדים
        </Link>
        <Link to="/activity-log" className={`flex items-center p-3 rounded ${isActive("/activity-log")}`}>
          <FileText className="w-5 h-5 ml-2" /> לוג פעילות
        </Link>
        <Link to="/reports" className={`flex items-center p-3 rounded ${isActive("/reports")}`}>
          <BarChart className="w-5 h-5 ml-2" /> דוחות
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
