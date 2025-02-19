// src/pages/CompanyPage.tsx
import { useState, useEffect } from 'react';
import {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../services/CompanyService';
import { toast } from 'react-toastify';

interface Company {
  code: string; // חייב להיות 2 ספרות
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState({ code: '', name: '' });

  // ✅ טען את רשימת החברות מהשרת עם בדיקה
  useEffect(() => {
    refreshCompanies();
  }, []);

  // ✅ רענן את הרשימה
  const refreshCompanies = () => {
    const data = getAllCompanies();
    console.log("🔄 Refreshed companies:", data);
    setCompanies([...data]);
  };

  // ✅ בדוק תקינות הקלט לפי החוקים העסקיים
  const validateForm = () => {
    if (!/^\d{2}$/.test(form.code)) {
      toast.error("❌ Company code must be exactly 2 digits.");
      return false;
    }
    if (form.name.trim() === '') {
      toast.error("❌ Company name cannot be empty.");
      return false;
    }
    return true;
  };

  // ✅ צור חברה חדשה
  const handleCreate = () => {
    if (!validateForm()) return;
    try {
      createCompany({
        code: form.code,
        name: form.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast.success("✅ Company created successfully!");
      refreshCompanies();
      setForm({ code: '', name: '' });
    } catch (error) {
      console.error("❌ Create company failed:", error);
      toast.error("❌ Failed to create company.");
    }
  };

  // ✅ עדכן חברה עם אפשרות לעדכן גם את הקוד
  const handleUpdate = (code: string) => {
    const current = companies.find(c => c.code === code);
    if (!current) {
      toast.error("❌ Company not found.");
      return;
    }

    const newCode = prompt("Enter new company code (2 digits):", current.code);
    const newName = prompt("Enter new company name:", current.name);

    if (newCode && !/^\d{2}$/.test(newCode)) {
      toast.error("❌ Company code must be exactly 2 digits.");
      return;
    }

    if (newName?.trim()) {
      try {
        updateCompany(code, { name: newName }, newCode);
        toast.success("✅ Company updated successfully!");
        refreshCompanies();
      } catch (error) {
        console.error("❌ Update company failed:", error);
        toast.error("❌ Failed to update company.");
      }
    }
  };

  // ✅ מחק חברה
  const handleDelete = (code: string) => {
    if (confirm(`Are you sure you want to delete company with code ${code}?`)) {
      try {
        deleteCompany(code);
        toast.info("✅ Company deleted.");
        refreshCompanies();
      } catch (error) {
        console.error("❌ Delete company failed:", error);
        toast.error("❌ Failed to delete company.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Companies</h1>

      {/* 🟢 טופס הוספת חברה */}
      <div className="mb-6 bg-white shadow p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Add Company</h2>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Company Code (2 digits)"
            className="border p-2 flex-1"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <input
            type="text"
            placeholder="Company Name"
            className="border p-2 flex-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleCreate}
        >
          Add Company
        </button>
      </div>

      {/* 🟡 טבלת חברות */}
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Code</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.code} className="text-center">
              <td className="border p-2">{company.code}</td>
              <td className="border p-2">{company.name}</td>
              <td className="border p-2">{new Date(company.createdAt).toLocaleString()}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-yellow-400 text-white px-3 py-1 rounded"
                  onClick={() => handleUpdate(company.code)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(company.code)}
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
