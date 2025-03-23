import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Users, MapPin, DollarSign } from 'lucide-react';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { getAllCompanies } from "../services/CompanyService";
import { getAllEmployees } from "../services/EmployeeService";
import { getAllLocations } from "../services/LocationService";
import { Location, CalculationType } from '../types/location.types';

export default function DashboardPage() {
  const [companyCount, setCompanyCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [locationCount, setLocationCount] = useState(0);
  const [totalLocationsPrice, setTotalLocationsPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companies = await getAllCompanies();
        const employees = await getAllEmployees();
        const locations = await getAllLocations();

        setCompanyCount(companies.length);
        setEmployeeCount(employees.length);
        setLocationCount(locations.length);
        
        // חישוב המחיר הכולל לפי סוג המיקום
        const totalPrice = locations.reduce((sum, loc: Location) => {
          switch (loc.calculationType) {
            case CalculationType.HOURLY:
              return sum + (loc.hourlyRate || 0);
            case CalculationType.GLOBAL:
              return sum + (loc.globalAmount || 0);
            case CalculationType.DICTATED:
              return sum + (loc.dictatedHours || 0);
            default:
              return sum;
          }
        }, 0);
        
        setTotalLocationsPrice(totalPrice);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-8 mx-auto w-full max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">ברוכים הבאים למערכת ניהול המשאבים</h1>
            <p className="text-lg text-gray-600">נהל את החברות, העובדים והמקומות שלך במקום אחד</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard 
              title="חברות" 
              value={companyCount} 
              icon={Building}
              iconColor="text-blue-500"
            />
            <StatCard 
              title="עובדים" 
              value={employeeCount} 
              icon={Users}
              iconColor="text-green-500"
            />
            <StatCard 
              title="מקומות" 
              value={locationCount} 
              icon={MapPin}
              iconColor="text-purple-500"
            />
            <StatCard 
              title="מחיר כולל למקומות" 
              value={`₪${totalLocationsPrice.toFixed(2)}`} 
              icon={DollarSign}
              iconColor="text-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => navigate("/companies")}
              className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Building className="w-6 h-6" />
              <span className="text-lg font-semibold">ניהול חברות</span>
            </button>
            
            <button 
              onClick={() => navigate("/locations")}
              className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <MapPin className="w-6 h-6" />
              <span className="text-lg font-semibold">ניהול מקומות</span>
            </button>
            
            <button 
              onClick={() => navigate("/employees")}
              className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Users className="w-6 h-6" />
              <span className="text-lg font-semibold">ניהול עובדים</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
