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
    { company: "", location: "", calcType: "", workHours: 0, hourlyRate: 0, monthlySalary: 0, totalAmount: 0 },
  ]);

  const companies = getAllCompanies();
  const locations = getAllLocations();

  /** 🔹 פונקציה להוספת שורה חדשה */
  const addRow = () => {
    setRows([...rows, { company: "", location: "", calcType: "", workHours: 0, hourlyRate: 0, monthlySalary: 0, totalAmount: 0 }]);
  };

  /** 🔹 פונקציה לחישוב הסכום לתשלום */
  const calculateTotal = (index) => {
    const updatedRows = [...rows];
    const row = updatedRows[index];

    if (row.calcType === "calc_by_hours") {
      row.totalAmount = row.workHours * row.hourlyRate * (countMidWeek + countFriday + countSaturday);
    } else if (row.calcType === "calc_globaly") {
      row.totalAmount = row.monthlySalary;
    } else if (row.calcType === "calc_fixed_hours") {
      row.totalAmount = row.workHours * row.hourlyRate;
    }

    setRows(updatedRows);
  };

  /** 🔹 פונקציה לעדכון ערך בטבלה */
  const updateRow = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (field === "calcType") {
      updatedRows[index].workHours = 0;
      updatedRows[index].hourlyRate = 0;
      updatedRows[index].monthlySalary = 0;
      updatedRows[index].totalAmount = 0;
    }

    setRows(updatedRows);
    calculateTotal(index);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">📊 דוח הכנסות ומשכורות</h1>

      {/* 🔹 טבלת ימי החודש */}
      <div className="mb-6 bg-white rounded w-1/3 p-4">
        <h2 className="text-xl font-bold mb-4 text-black">🗓 טבלת ימי החודש</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="text-black">כמות ימי אמצע שבוע:</label>
          <input 
            type="number" 
            value={countMidWeek} 
            onChange={(e) => setCountMidWeek(Number(e.target.value))} 
            className="border p-2 bg-white text-black focus:bg-white hover:bg-white active:bg-white" 
          />
          <label className="text-black">כמות ימי שישי:</label>
          <input 
            type="number" 
            value={countFriday} 
            onChange={(e) => setCountFriday(Number(e.target.value))} 
            className="border p-2 bg-white text-black focus:bg-white hover:bg-white active:bg-white" 
          />
          <label className="text-black">כמות ימי שבת:</label>
          <input 
            type="number" 
            value={countSaturday} 
            onChange={(e) => setCountSaturday(Number(e.target.value))} 
            className="border p-2 bg-white text-black focus:bg-white hover:bg-white active:bg-white" 
          />
        </div>
      </div>

      {/* 🔹 טבלת ניהול העסק */}
      <div className="bg-white rounded p-4">
        <h2 className="text-xl font-bold mb-4 text-black">📋 טבלת ניהול העסק</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2 bg-white text-black">חברת ניהול</th>
              <th className="border p-2 bg-white text-black">מקום עבודה</th>
              <th className="border p-2 bg-white text-black">סגנון חישוב</th>
              <th className="border p-2 bg-white text-black">נתוני חישוב</th>
              <th className="border p-2 bg-white text-black">סכום לתשלום לפני מע"מ (₪)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2 bg-white">
                  <select 
                    value={row.company} 
                    onChange={(e) => updateRow(index, "company", e.target.value)} 
                    className="border p-2 w-full bg-white text-black focus:bg-white hover:bg-white active:bg-white"
                  >
                    <option value="">בחר</option>
                    {companies.map((company) => (
                      <option key={company.code} value={company.name}>{company.name}</option>
                    ))}
                  </select>
                </td>
                <td className="border p-2 bg-white">
                  <select 
                    value={row.location} 
                    onChange={(e) => updateRow(index, "location", e.target.value)} 
                    className="border p-2 w-full bg-white text-black focus:bg-white hover:bg-white active:bg-white"
                  >
                    <option value="">בחר</option>
                    {locations.map((location) => (
                      <option key={location.code} value={location.street}>{location.street} ({location.city})</option>
                    ))}
                  </select>
                </td>
                <td className="border p-2 bg-white">
                  <select 
                    value={row.calcType} 
                    onChange={(e) => updateRow(index, "calcType", e.target.value)} 
                    className="border p-2 w-full bg-white text-black focus:bg-white hover:bg-white active:bg-white"
                  >
                    <option value="">בחר</option>
                    <option value="calc_by_hours">חישוב שעתי</option>
                    <option value="calc_globaly">חישוב גלובלי</option>
                    <option value="calc_fixed_hours">כמות שעות מוכתבת</option>
                  </select>
                </td>
                <td className="border p-2 bg-white">
                  <input 
                    type="number" 
                    placeholder="מחיר לשעה (₪)" 
                    value={row.hourlyRate} 
                    onChange={(e) => updateRow(index, "hourlyRate", Number(e.target.value))} 
                    className="border p-2 w-full bg-white text-black focus:bg-white hover:bg-white active:bg-white mb-2" 
                  />
                  <input 
                    type="number" 
                    placeholder="סה״כ שעות" 
                    value={row.workHours} 
                    onChange={(e) => updateRow(index, "workHours", Number(e.target.value))} 
                    className="border p-2 w-full bg-white text-black focus:bg-white hover:bg-white active:bg-white" 
                  />
                </td>
                <td className="border p-2 bg-white text-black font-bold">{row.totalAmount.toFixed(2)} ₪</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addRow} className="mt-4 bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-500 active:bg-blue-500">➕ הוסף שורה חדשה</button>
      </div>
    </div>
  );
}
