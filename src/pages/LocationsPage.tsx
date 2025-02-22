import { useState, useEffect } from "react";
import { getAllLocations, createLocation, deleteLocation } from "../services/LocationService";
import { toast } from "react-toastify";

interface Location {
  code: string; // 5 ספרות - יווצר אוטומטית
  street: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

// רשימת ערים ברירת מחדל
const defaultCities = [
  "תל אביב", "הרצליה", "רעננה", "כפר סבא", "נתניה", "חדרה", "ראש העין",
  "שוהם", "קריית אונו", "פתח תקווה", "גני תקווה", "אשדוד", "באר שבע",
  "רמת השרון", "הוד השרון", "לוד", "רמלה"
];

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [cities, setCities] = useState<string[]>(defaultCities);
  const [form, setForm] = useState({ street: "", city: "" });
  const [newCity, setNewCity] = useState(""); // משתנה לשדה הוספת עיר חדשה

  // טעינת כל המקומות מהשרת
  useEffect(() => {
    try {
      const locs = getAllLocations();
      setLocations(locs);
    } catch (error) {
      console.error("❌ Failed to load locations:", error);
      toast.error("❌ Failed to load locations.");
    }
  }, []);

  // ✅ פונקציה ליצירת קוד ייחודי אוטומטי של 5 ספרות
  const generateUniqueCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString(); // מחזיר מספר בן 5 ספרות
  };

  // ✅ פונקציה להוספת עיר חדשה לרשימה
  const handleAddCity = () => {
    if (newCity.trim() === "") {
      toast.error("❌ שם העיר לא יכול להיות ריק.");
      return;
    }
    if (cities.includes(newCity)) {
      toast.error("❌ העיר כבר קיימת ברשימה.");
      return;
    }
    setCities([...cities, newCity]);
    toast.success(`✅ העיר "${newCity}" נוספה בהצלחה!`);
    setNewCity(""); // איפוס השדה
  };

  // ✅ יצירת מקום חדש
  const handleCreate = () => {
    if (form.street.trim() === "") {
      toast.error("❌ רחוב לא יכול להיות ריק.");
      return;
    }
    if (!form.city) {
      toast.error("❌ אנא בחר עיר.");
      return;
    }

    try {
      const newLocation = createLocation({
        code: generateUniqueCode(), // קוד ייחודי נוצר אוטומטית
        street: form.street,
        city: form.city,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Created location:", newLocation);
      toast.success("✅ מיקום נוסף בהצלחה!");
      setLocations([...locations, newLocation]); // עדכון הרשימה עם המקום החדש
      setForm({ street: "", city: "" }); // איפוס הטופס
    } catch (error) {
      console.error("❌ Create location failed:", error);
      toast.error("❌ יצירת מקום נכשלה.");
    }
  };

  // ✅ מחיקת מקום
  const handleDelete = (code: string) => {
    if (confirm(`אתה בטוח שברצונך למחוק את המיקום עם קוד ${code}?`)) {
      try {
        const success = deleteLocation(code);
        if (success) {
          console.log(`🗑️ Deleted location with code ${code}`);
          toast.info("✅ מקום נמחק.");
          setLocations(locations.filter(loc => loc.code !== code));
        } else {
          toast.error("❌ מקום לא נמצא.");
        }
      } catch (error) {
        console.error("❌ Delete location failed:", error);
        toast.error("❌ מחיקת מקום נכשלה.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">ניהול מקומות עבודה</h1>

      {/* 🟢 טופס הוספת מקום */}
      <div className="mb-6 bg-white shadow p-4 rounded">
        <h2 className="text-xl font-bold mb-4">הוסף מיקום חדש</h2>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="רחוב"
            className="border p-2 flex-1"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
          />
          <select
            className="border p-2 flex-1"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          >
            <option value="">בחר עיר</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleCreate}
        >
          הוסף מיקום
        </button>
      </div>

      {/* 🟢 טופס הוספת עיר חדשה */}
      <div className="mb-6 bg-white shadow p-4 rounded">
        <h2 className="text-xl font-bold mb-4">הוסף עיר חדשה</h2>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="הזן עיר חדשה"
            className="border p-2 flex-1"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddCity}
          >
            הוסף עיר
          </button>
        </div>
      </div>

      {/* 🟡 טבלת מקומות */}
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">קוד</th>
            <th className="border p-2">רחוב</th>
            <th className="border p-2">עיר</th>
            <th className="border p-2">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc.code} className="text-center">
              <td className="border p-2">{loc.code}</td>
              <td className="border p-2">{loc.street}</td>
              <td className="border p-2">{loc.city}</td>
              <td className="border p-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(loc.code)}
                >
                  מחק
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
