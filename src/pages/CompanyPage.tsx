// src/pages/CompanyPage.tsx
import { useState, useEffect } from "react";
import {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../services/CompanyService";
import { toast } from "react-toastify";

interface Company {
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState({ code: "", name: "" });
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 חיפוש
  const [sortField, setSortField] = useState<keyof Company | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    refreshCompanies();
  }, []);

  const refreshCompanies = () => {
    try {
      const data = getAllCompanies();
      console.log("🔄 Refreshed companies:", data);
      setCompanies([...data]);
    } catch (error) {
      console.error("❌ Failed to fetch companies:", error);
      toast.error("❌ Failed to load companies.");
    }
  };

  const validateForm = () => {
    if (!/^\d{2}$/.test(form.code)) {
      toast.error("❌ Company code must be exactly 2 digits.");
      return false;
    }
    if (form.name.trim() === "") {
      toast.error("❌ Company name cannot be empty.");
      return false;
    }
    return true;
  };

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
      setForm({ code: "", name: "" });
    } catch (error) {
      console.error("❌ Create company failed:", error);
      toast.error("❌ Failed to create company.");
    }
  };

  const handleUpdate = (code: string) => {
    const current = companies.find((c) => c.code === code);
    if (!current) {
      toast.error("❌ Company not found.");
      return;
    }

    const newCode = prompt("Enter new company code (2 digits):", current.code)?.trim();
    const newName = prompt("Enter new company name:", current.name)?.trim();

    if (newCode && !/^\d{2}$/.test(newCode)) {
      toast.error("❌ Company code must be exactly 2 digits.");
      return;
    }

    if (newName) {
      try {
        updateCompany(code, { name: newName }, newCode || code);
        toast.success("✅ Company updated successfully!");
        refreshCompanies();
      } catch (error) {
        console.error("❌ Update company failed:", error);
        toast.error("❌ Failed to update company.");
      }
    }
  };

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

  // 🔍 **חיפוש דינמי** - מסנן את החברות בזמן אמת
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.code.includes(searchTerm)
  );

  // 🔀 **מיון רשימה** בלחיצה על כותרת העמודה
  const handleSort = (field: keyof Company) => {
    const newSortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sortedCompanies = [...companies].sort((a, b) => {
      if (a[field] < b[field]) return newSortOrder === "asc" ? -1 : 1;
      if (a[field] > b[field]) return newSortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setCompanies(sortedCompanies);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Companies</h1>

      {/* 🔍 שדה חיפוש */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Code or Name"
          className="border p-2 w-full rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCreate}>
          Add Company
        </button>
      </div>

      {/* 🟡 טבלת חברות */}
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 cursor-pointer" onClick={() => handleSort("code")}>
              Code {sortField === "code" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </th>
            <th className="border p-2 cursor-pointer" onClick={() => handleSort("name")}>
              Name {sortField === "name" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </th>
            <th className="border p-2 cursor-pointer" onClick={() => handleSort("createdAt")}>
              Created At {sortField === "createdAt" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCompanies.map((company) => (
            <tr key={company.code} className="text-center">
              <td className="border p-2">{company.code}</td>
              <td className="border p-2">{company.name}</td>
              <td className="border p-2">{new Date(company.createdAt).toLocaleString()}</td>
              <td className="border p-2 space-x-2">
                <button className="bg-yellow-400 text-white px-3 py-1 rounded" onClick={() => handleUpdate(company.code)}>
                  Edit
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(company.code)}>
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
