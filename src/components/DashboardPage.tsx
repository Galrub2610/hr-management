import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; 
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { Users, Building, MapPin, DollarSign } from "lucide-react";
import { getAllCompanies } from "../services/CompanyService";
import { getAllEmployees } from "../services/EmployeeService";
import { getAllLocations } from "../services/LocationService";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const [companyCount, setCompanyCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [locationCount, setLocationCount] = useState(0);
  const [totalLocationsPrice, setTotalLocationsPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const companies = getAllCompanies() || [];
      setCompanyCount(companies.length);

      const employees = getAllEmployees() || [];
      setEmployeeCount(employees.length);

      const locations = getAllLocations() || [];
      setLocationCount(locations.length);

      const totalPrice = locations.reduce((sum, loc) => sum + (loc.price || 0), 0);
      setTotalLocationsPrice(totalPrice);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 pr-64"> {/* ✅ מוסיף מרווח מה-sidebar */}
      <Sidebar /> {/* ✅ Sidebar קבוע בצד ימין */}

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <Header />
        
        <main className="p-6 w-full max-w-screen-md mx-auto flex flex-col items-center">
          {/* ✅ כרטיסיות ממורכזות עם 2 טורים למסכים בינוניים */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <StatCard title="חברות" value={companyCount} icon={Building} />
            <StatCard title="עובדים" value={employeeCount} icon={Users} />
            <StatCard title="מקומות" value={locationCount} icon={MapPin} />
            <StatCard title="מחיר כולל למקומות" value={`$${totalLocationsPrice.toFixed(2)}`} icon={DollarSign} />
          </div>

          {/* ✅ כפתורים ממורכזים עם ריווח אחיד */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button className="bg-blue-500 text-white px-6 py-3 rounded shadow-md hover:bg-blue-600 transition"
              onClick={() => navigate("/companies")}>
              ניהול חברות
            </button>
            <button className="bg-green-500 text-white px-6 py-3 rounded shadow-md hover:bg-green-600 transition"
              onClick={() => navigate("/locations")}>
              ניהול מקומות
            </button>
            <button className="bg-purple-500 text-white px-6 py-3 rounded shadow-md hover:bg-purple-600 transition"
              onClick={() => navigate("/employees")}>
              ניהול עובדים
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
