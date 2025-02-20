// src/pages/ReportsPage.tsx
import { useState, useEffect } from "react";
import { getAllEmployees } from "../services/EmployeeService";
import { getAllLocations } from "../services/LocationService";
import { getAllCompanies } from "../services/CompanyService";
import { getActivityLogs } from "../services/ActivityLogService";

// ✅ הגדרת טיפוסי נתונים
interface ActivityLog {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
}

// ✅ פונקציה לייצוא דוחות ל-CSV
const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  if (!data.length) {
    alert("❌ No data available to export.");
    return;
  }

  const csvContent = [
    headers.join(","), // ✅ הוספת כותרות לקובץ
    ...data.map(row =>
      headers.map(header => `"${(row[header] ?? "").toString().replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function ReportsPage() {
  const [employeeCountByLocation, setEmployeeCountByLocation] = useState<Record<string, number>>({});
  const [averagePriceByLocation, setAveragePriceByLocation] = useState<Record<string, number>>({});
  const [companyEmployeeCount, setCompanyEmployeeCount] = useState<Record<string, number>>({});
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    try {
      const employees = getAllEmployees() || [];
      const locations = getAllLocations() || [];
      const companies = getAllCompanies() || [];
      const logs = getActivityLogs()?.slice(0, 5) || []; // ✅ מניעת קריסה במידה ואין נתונים

      // 🔹 חישוב כמות עובדים לפי מיקום
      const locationEmployeeCount: Record<string, number> = {};
      employees.forEach((emp) => {
        locationEmployeeCount[emp.locationId] = (locationEmployeeCount[emp.locationId] || 0) + 1;
      });

      // 🔹 חישוב מחיר ממוצע למיקום
      const locationPriceTotal: Record<string, number> = {};
      const locationPriceCount: Record<string, number> = {};
      locations.forEach((loc) => {
        locationPriceTotal[loc.code] = (locationPriceTotal[loc.code] || 0) + loc.price;
        locationPriceCount[loc.code] = (locationPriceCount[loc.code] || 0) + 1;
      });

      const averagePrices: Record<string, number> = {};
      Object.keys(locationPriceTotal).forEach((code) => {
        averagePrices[code] = locationPriceTotal[code] / locationPriceCount[code];
      });

      // 🔹 חישוב כמות עובדים לפי חברה
      const companyEmployeeCountMap: Record<string, number> = {};
      employees.forEach((emp) => {
        const location = locations.find((loc) => loc.code === emp.locationId);
        if (location) {
          companyEmployeeCountMap[location.companyId] = (companyEmployeeCountMap[location.companyId] || 0) + 1;
        }
      });

      setEmployeeCountByLocation(locationEmployeeCount);
      setAveragePriceByLocation(averagePrices);
      setCompanyEmployeeCount(companyEmployeeCountMap);
      setRecentLogs(logs);
    } catch (error) {
      console.error("❌ Error loading reports:", error);
    }
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 System Reports</h1>

      {/* 🔹 דוח כמות עובדים לפי מיקום */}
      <div className="mb-6 bg-white shadow p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Employees per Location</h2>
        {Object.keys(employeeCountByLocation).length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <>
            <ul>
              {Object.entries(employeeCountByLocation).map(([location, count]) => (
                <li key={location} className="p-2 border-b">📍 Location {location}: <strong>{count} Employees</strong></li>
              ))}
            </ul>
            <button
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition"
              onClick={() =>
                exportToCSV(Object.entries(employeeCountByLocation).map(([location, count]) => ({ location, count })), "employees_per_location", ["location", "count"])
              }
            >
              Export CSV
            </button>
          </>
        )}
      </div>

      {/* 🔹 דוח עלות ממוצעת למיקום */}
      <div className="mb-6 bg-white shadow p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Average Price per Location</h2>
        {Object.keys(averagePriceByLocation).length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <>
            <ul>
              {Object.entries(averagePriceByLocation).map(([location, price]) => (
                <li key={location} className="p-2 border-b">📍 Location {location}: <strong>${price.toFixed(2)}</strong></li>
              ))}
            </ul>
            <button
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition"
              onClick={() =>
                exportToCSV(Object.entries(averagePriceByLocation).map(([location, price]) => ({ location, price })), "average_price_per_location", ["location", "price"])
              }
            >
              Export CSV
            </button>
          </>
        )}
      </div>

      {/* 🔹 דוח כמות עובדים לפי חברה */}
      <div className="mb-6 bg-white shadow p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Employees per Company</h2>
        {Object.keys(companyEmployeeCount).length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <>
            <ul>
              {Object.entries(companyEmployeeCount).map(([company, count]) => (
                <li key={company} className="p-2 border-b">🏢 Company {company}: <strong>{count} Employees</strong></li>
              ))}
            </ul>
            <button
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition"
              onClick={() =>
                exportToCSV(Object.entries(companyEmployeeCount).map(([company, count]) => ({ company, count })), "employees_per_company", ["company", "count"])
              }
            >
              Export CSV
            </button>
          </>
        )}
      </div>
    </div>
  );
}
