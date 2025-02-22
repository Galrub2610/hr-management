// src/pages/DashboardPage.tsx
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Header } from "../components/Header";
import { StatCard } from "../components/StatCard";
import { Users, Building, MapPin, DollarSign } from "lucide-react";
import { getAllCompanies } from "../services/CompanyService";
import { getAllEmployees } from "../services/EmployeeService";
import { getAllLocations } from "../services/LocationService";

export default function DashboardPage() {
  const [companyCount, setCompanyCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [locationCount, setLocationCount] = useState(0);
  const [totalLocationPrice, setTotalLocationPrice] = useState(0);

  useEffect(() => {
    try {
      const companies = getAllCompanies();
      const employees = getAllEmployees();
      const locations = getAllLocations();

      setCompanyCount(companies.length);
      setEmployeeCount(employees.length);
      setLocationCount(locations.length);
      setTotalLocationPrice(
        locations.reduce((sum, loc) => sum + (loc.price || 0), 0)
      );
    } catch (error) {
      console.error("❌ Error loading dashboard data:", error);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Companies" value={companyCount} icon={Building} />
          <StatCard title="Locations" value={locationCount} icon={MapPin} />
          <StatCard title="Employees" value={employeeCount} icon={Users} />
          <StatCard
            title="Total Locations Price"
            value={`$${totalLocationPrice.toFixed(2)}`}
            icon={DollarSign}
          />
        </main>
      </div>
    </div>
  );
}
