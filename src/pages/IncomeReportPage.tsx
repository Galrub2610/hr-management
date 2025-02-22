import { useState } from "react";
import { getAllCompanies } from "../services/CompanyService";
import { getAllLocations } from "../services/LocationService";
import { toast } from "react-toastify";

export default function IncomeReportPage() {
  /** 🔹 משתני ימי החודש */
  const [countMidWeek, setCountMidWeek] = useState(0);
  const [countFriday, setCountFriday] = useState(0);
  const [countSaturday, setCountSaturday] = useState(0);

  /** 🔹 טבלת ניהול העסק */
  const [rows, setRows] = useState([
    { company: "", location: "", calcType: "", workDays: {} },
  ]);

  const companies = getAllCompanies();
  const locations = getAllLocations();

  /** 🔹 פונקציה להוספת שורה חדשה */
  const addRow = () => {
    setRows([...rows, { company: "", location: "", calcType: "", workDays: {} }]);
  };

  /** 🔹 פונקציה לעדכון ערך בטבלה */
  const updateRow = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (field === "calcType") {
      updatedRows[index].workDays = {};
    }

    setRows(updatedRows);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 דוח הכנסות ומשכורות</h1>

      {/* 🔹 טבלת ימי החודש */}
      <div className="mb-6 bg-white shadow p-4 rounded w-1/3">
        <h2 className="text-xl font-bold mb-4">🗓 טבלת ימי החודש</h2>
        <div className="grid grid-cols-2 gap-4">
          <label>כמות ימי אמצע שבוע:</label>
          <input
            type="number"
            value={countMidWeek}
            onChange={(e) => setCountMidWeek(Number(e.target.value))}
            className="border p-2"
          />
          <label>כמות ימי שישי:</label>
          <input
            type="number"
            value={countFriday}
            onChange={(e) => setCountFriday(Number(e.target.value))}
            className="border p-2"
          />
          <label>כמות ימי שבת:</label>
          <input
            type="number"
            value={countSaturday}
            onChange={(e) => setCountSaturday(Number(e.target.value))}
            className="border p-2"
          />
        </div>
      </div>

      {/* 🔹 טבלת ניהול העסק */}
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-xl font-bold mb-4">📋 טבלת ניהול העסק</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">חברת ניהול</th>
              <th className="border p-2">מקום עבודה</th>
              <th className="border p-2">סגנון חישוב</th>
              <th className="border p-2">כמות ימי עבודה אמצע שבוע</th>
              <th className="border p-2">כמות ימי עבודה שישי</th>
              <th className="border p-2">כמות ימי עבודה שבת</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">
                  <select
                    value={row.company}
                    onChange={(e) => updateRow(index, "company", e.target.value)}
                    className="border p-2"
                  >
                    <option value="">בחר</option>
                    {companies.map((company) => (
                      <option key={company.code} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">
                  <select
                    value={row.location}
                    onChange={(e) => updateRow(index, "location", e.target.value)}
                    className="border p-2"
                  >
                    <option value="">בחר</option>
                    {locations.map((location) => (
                      <option key={location.code} value={location.street}>
                        {location.street} ({location.city})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">
                  <select
                    value={row.calcType}
                    onChange={(e) => updateRow(index, "calcType", e.target.value)}
                    className="border p-2"
                  >
                    <option value="">בחר</option>
                    <option value="calc_by_hours">חישוב שעתי</option>
                    <option value="calc_globaly">חישוב גלובלי</option>
                    <option value="calc_fixed_hours">כמות שעות מוכתבת</option>
                  </select>
                </td>
                <td className="border p-2">{countMidWeek}</td>
                <td className="border p-2">{countFriday}</td>
                <td className="border p-2">{countSaturday}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addRow}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          ➕ הוסף שורה חדשה
        </button>
      </div>
    </div>
  );
}
