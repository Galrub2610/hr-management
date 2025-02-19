// src/pages/EmployeesPage.tsx
import { useState, useEffect } from 'react';
import {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} from '../services/EmployeeService';
import { getAllLocations } from '../services/LocationService'; // ✅ הוספנו רשימת מקומות
import { toast } from 'react-toastify';

interface Employee {
  code: string;      // 3 ספרות
  name: string;
  locationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locations, setLocations] = useState<{ code: string; address: string }[]>([]);
  const [form, setForm] = useState({ code: '', name: '', locationId: '' });

  // ✅ טעינת עובדים ומקומות
  useEffect(() => {
    try {
      const emps = getAllEmployees();
      const locs = getAllLocations();
      console.log("📊 Loaded employees:", emps);
      console.log("📍 Loaded locations:", locs);
      setEmployees(emps);
      setLocations(locs);
    } catch (error) {
      console.error("❌ Failed to load employees or locations:", error);
      toast.error("❌ Failed to load data.");
    }
  }, []);

  // ✅ רענון הטבלה
  const refreshEmployees = () => {
    const data = getAllEmployees();
    console.log("🔄 Refreshed employees:", data);
    setEmployees(data);
  };

  // ✅ בדיקות תקינות קלט עם כפילות וקיום מקום
  const validateForm = () => {
    if (!/^\d{3}$/.test(form.code)) {
      toast.error("❌ Employee code must be exactly 3 digits.");
      return false;
    }
    if (form.name.trim() === '') {
      toast.error("❌ Name cannot be empty.");
      return false;
    }
    if (!locations.some(loc => loc.code === form.locationId)) {
      toast.error("❌ Invalid Location ID.");
      return false;
    }
    if (employees.some(emp => emp.code === form.code)) {
      toast.error("❌ Employee code already exists.");
      return false;
    }
    return true;
  };

  // ✅ צור עובד חדש
  const handleCreate = () => {
    if (!validateForm()) return;

    try {
      const newEmployee = createEmployee({
        code: form.code,
        name: form.name,
        locationId: form.locationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ Created employee:", newEmployee);
      toast.success("✅ Employee created successfully!");
      refreshEmployees();
      setForm({ code: '', name: '', locationId: '' });
    } catch (error) {
      console.error("❌ Create employee failed:", error);
      toast.error("❌ Failed to create employee.");
    }
  };

  // ✅ עדכן עובד עם בדיקת כפילות
  const handleUpdate = (code: string) => {
    const current = employees.find(emp => emp.code === code);
    if (!current) {
      toast.error("❌ Employee not found.");
      return;
    }

    const newCode = prompt("Enter new employee code (3 digits):", current.code);
    const newName = prompt("Enter new name:", current.name);
    const newLocationId = prompt("Enter new Location ID:", current.locationId);

    if (newCode && !/^\d{3}$/.test(newCode)) {
      toast.error("❌ Employee code must be exactly 3 digits.");
      return;
    }
    if (newCode && newCode !== code && employees.some(emp => emp.code === newCode)) {
      toast.error("❌ New employee code already exists.");
      return;
    }
    if (newLocationId && !locations.some(loc => loc.code === newLocationId)) {
      toast.error("❌ Invalid Location ID.");
      return;
    }

    if (newCode && newName && newLocationId) {
      try {
        const updatedEmployee = updateEmployee(
          code,
          {
            name: newName,
            locationId: newLocationId,
          },
          newCode
        );
        if (updatedEmployee) {
          console.log("🔄 Updated employee:", updatedEmployee);
          toast.success("✅ Employee updated!");
          refreshEmployees();
        }
      } catch (error) {
        console.error("❌ Update employee failed:", error);
        toast.error("❌ Failed to update employee.");
      }
    }
  };

  // ✅ מחק עובד
  const handleDelete = (code: string) => {
    if (confirm(`Are you sure you want to delete employee with code ${code}?`)) {
      try {
        const success = deleteEmployee(code);
        if (success) {
          console.log(`🗑️ Deleted employee with code ${code}`);
          toast.info("✅ Employee deleted.");
          refreshEmployees();
        } else {
          toast.error("❌ Employee not found.");
        }
      } catch (error) {
        console.error("❌ Delete employee failed:", error);
        toast.error("❌ Failed to delete employee.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Employees</h1>

      {/* 🟢 טופס הוספת עובד */}
      <div className="mb-6 bg-white shadow p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Add Employee</h2>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Employee Code (3 digits)"
            className="border p-2 flex-1"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <input
            type="text"
            placeholder="Name"
            className="border p-2 flex-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            className="border p-2 flex-1"
            value={form.locationId}
            onChange={(e) => setForm({ ...form, locationId: e.target.value })}
          >
            <option value="">Select Location</option>
            {locations.map(loc => (
              <option key={loc.code} value={loc.code}>
                {loc.address} (#{loc.code})
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleCreate}
        >
          Add Employee
        </button>
      </div>

      {/* 🟡 טבלת עובדים */}
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Code</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.code} className="text-center">
              <td className="border p-2">{emp.code}</td>
              <td className="border p-2">{emp.name}</td>
              <td className="border p-2">
                {locations.find(loc => loc.code === emp.locationId)?.address || emp.locationId}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-yellow-400 text-white px-3 py-1 rounded"
                  onClick={() => handleUpdate(emp.code)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(emp.code)}
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
