// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { getAllCompanies } from '../services/CompanyService';
import { getAllLocations } from '../services/LocationService';
import { getAllEmployees } from '../services/EmployeeService';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [companiesCount, setCompaniesCount] = useState(0);
  const [locationsCount, setLocationsCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [totalLocationsPrice, setTotalLocationsPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const companies = getAllCompanies();
    const locations = getAllLocations();
    const employees = getAllEmployees();

    setCompaniesCount(companies.length);
    setLocationsCount(locations.length);
    setEmployeesCount(employees.length);

    const totalPrice = locations.reduce((sum, loc) => sum + loc.price, 0);
    setTotalLocationsPrice(totalPrice);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* 🔢 סיכומים מהירים */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">Companies</h2>
          <p className="text-2xl">{companiesCount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">Locations</h2>
          <p className="text-2xl">{locationsCount}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">Employees</h2>
          <p className="text-2xl">{employeesCount}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">Total Locations Price</h2>
          <p className="text-2xl">${totalLocationsPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* 🧭 ניווט מהיר */}
      <div className="flex space-x-4 justify-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate('/companies')}
        >
          Manage Companies
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => navigate('/locations')}
        >
          Manage Locations
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => navigate('/employees')}
        >
          Manage Employees
        </button>
      </div>
    </div>
  );
}
