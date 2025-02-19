// src/pages/LocationsPage.tsx
import { useState, useEffect } from 'react';
import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../services/LocationService';
import { getAllCompanies } from '../services/CompanyService'; // ✅ נוספה בדיקה ל-companyId
import { toast } from 'react-toastify';

interface Location {
  code: string;      // 5 ספרות
  address: string;
  price: number;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [companies, setCompanies] = useState<{ code: string; name: string }[]>([]); // ✅ נוספה רשימת חברות
  const [form, setForm] = useState({ code: '', address: '', price: '', companyId: '' });

  // ✅ טעינת כל המקומות והחברות
  useEffect(() => {
    try {
      const locs = getAllLocations();
      const comps = getAllCompanies();
      console.log("📊 Loaded locations:", locs);
      console.log("🏢 Loaded companies:", comps);
      setLocations(locs);
      setCompanies(comps);
    } catch (error) {
      console.error("❌ Failed to load data:", error);
      toast.error("❌ Failed to load locations or companies.");
    }
  }, []);

  const refreshLocations = () => {
    try {
      const data = getAllLocations();
      console.log("🔄 Refreshed locations:", data);
      setLocations(data);
    } catch (error) {
      console.error("❌ Failed to refresh locations:", error);
      toast.error("❌ Failed to refresh locations.");
    }
  };

  // ✅ בדיקות תקינות קלט עם כפילות וקיום חברה
  const validateForm = () => {
    if (!/^\d{5}$/.test(form.code)) {
      toast.error("❌ Location code must be exactly 5 digits.");
      return false;
    }
    if (form.address.trim() === '') {
      toast.error("❌ Address cannot be empty.");
      return false;
    }
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      toast.error("❌ Price must be a positive number.");
      return false;
    }
    if (form.companyId.trim() === '') {
      toast.error("❌ Company ID cannot be empty.");
      return false;
    }
    // ✅ בדיקת קיום חברת האב
    if (!companies.some(c => c.code === form.companyId)) {
      toast.error("❌ Company ID not found.");
      return false;
    }
    // ✅ בדיקת כפילות קוד מקום
    if (locations.some(loc => loc.code === form.code)) {
      toast.error("❌ Location code already exists.");
      return false;
    }
    return true;
  };

  // ✅ צור מקום חדש עם בדיקות
  const handleCreate = () => {
    if (!validateForm()) return;
    try {
      const newLocation = createLocation({
        code: form.code,
        address: form.address,
        price: parseFloat(form.price),
        companyId: form.companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ Created location:", newLocation);
      toast.success("✅ Location created successfully!");
      refreshLocations();
      setForm({ code: '', address: '', price: '', companyId: '' });
    } catch (error) {
      console.error("❌ Create location failed:", error);
      toast.error("❌ Failed to create location.");
    }
  };

  // ✅ עדכן מקום עם בדיקת כפילות
  const handleUpdate = (code: string) => {
    const current = locations.find(loc => loc.code === code);
    if (!current) {
      toast.error("❌ Location not found.");
      return;
    }

    const newCode = prompt("Enter new location code (5 digits):", current.code);
    const newAddress = prompt("Enter new address:", current.address);
    const newPrice = prompt("Enter new price:", current.price.toString());
    const newCompanyId = prompt("Enter new company ID:", current.companyId);

    if (newCode && !/^\d{5}$/.test(newCode)) {
      toast.error("❌ Location code must be exactly 5 digits.");
      return;
    }
    if (newCode && newCode !== code && locations.some(loc => loc.code === newCode)) {
      toast.error("❌ New location code already exists.");
      return;
    }
    if (newCompanyId && !companies.some(c => c.code === newCompanyId)) {
      toast.error("❌ Company ID not found.");
      return;
    }

    if (newCode && newAddress && newPrice && newCompanyId) {
      try {
        const updatedLocation = updateLocation(code, {
          address: newAddress,
          price: parseFloat(newPrice),
          companyId: newCompanyId,
        }, newCode);
        if (updatedLocation) {
          console.log("🔄 Updated location:", updatedLocation);
          toast.success("✅ Location updated!");
          refreshLocations();
        }
      } catch (error) {
        console.error("❌ Update location failed:", error);
        toast.error("❌ Failed to update location.");
      }
    }
  };

  // ✅ מחק מקום
  const handleDelete = (code: string) => {
    if (confirm(`Are you sure you want to delete location with code ${code}?`)) {
      try {
        const success = deleteLocation(code);
        if (success) {
          console.log(`🗑️ Deleted location with code ${code}`);
          toast.info("✅ Location deleted.");
          refreshLocations();
        } else {
          toast.error("❌ Location not found.");
        }
      } catch (error) {
        console.error("❌ Delete location failed:", error);
        toast.error("❌ Failed to delete location.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Locations</h1>

      {/* 🟢 טופס הוספת מקום */}
      <div className="mb-6 bg-white shadow p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Add Location</h2>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Location Code (5 digits)"
            className="border p-2 flex-1"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-2 flex-1"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="Price"
            className="border p-2 flex-1"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <select
            className="border p-2 flex-1"
            value={form.companyId}
            onChange={(e) => setForm({ ...form, companyId: e.target.value })}
          >
            <option value="">Select Company</option>
            {companies.map(comp => (
              <option key={comp.code} value={comp.code}>
                {comp.name} (#{comp.code})
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleCreate}
        >
          Add Location
        </button>
      </div>

      {/* 🟡 טבלת מקומות */}
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Code</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Company ID</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc.code} className="text-center">
              <td className="border p-2">{loc.code}</td>
              <td className="border p-2">{loc.address}</td>
              <td className="border p-2">{loc.price}</td>
              <td className="border p-2">{loc.companyId}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-yellow-400 text-white px-3 py-1 rounded"
                  onClick={() => handleUpdate(loc.code)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(loc.code)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
