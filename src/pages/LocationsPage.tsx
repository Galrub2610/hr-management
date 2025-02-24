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

  // ✅ מחיקת מקום
  const handleDelete = (code: string) => {
    if (confirm(`האם אתה בטוח שברצונך למחוק את המיקום עם קוד ${code}?`)) {
      try {
        const success = deleteLocation(code);
        if (success) {
          console.log(`🗑️ Deleted location with code ${code}`);
          toast.info("✅ המיקום נמחק בהצלחה");
          setLocations(locations.filter(loc => loc.code !== code));
        } else {
          toast.error("❌ המיקום לא נמצא");
        }
      } catch (error) {
        console.error("❌ Delete location failed:", error);
        toast.error("❌ מחיקת המיקום נכשלה");
      }
    }
  };

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h1>ניהול מיקומים</h1>
        <p className="subtitle">נהל את רשימת המיקומים והערים שלך</p>
      </header>

      <div className="card add-city-card">
        <h2>הוספת עיר חדשה</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="הזן שם עיר"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            className="city-input"
          />
          <button
            onClick={handleAddCity}
            className="add-button"
          >
            הוסף עיר
          </button>
        </div>
      </div>

      <div className="card locations-table-card">
        <div className="table-header">
          <h2>רשימת מיקומים</h2>
          <span className="location-count">{locations.length} מיקומים</span>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>קוד</th>
                <th>רחוב</th>
                <th>עיר</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.code} className="location-row">
                  <td>{loc.code}</td>
                  <td>{loc.street}</td>
                  <td>{loc.city}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(loc.code)}
                      className="delete-button"
                    >
                      מחק
                    </button>
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-state">
                    לא נמצאו מיקומים
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .page-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .page-header h1 {
          color: #2d1f5b;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #666;
          margin-top: 0.5rem;
          font-size: 1.1rem;
        }

        .card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(100, 100, 255, 0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(100, 100, 255, 0.15);
        }

        .add-city-card {
          margin-bottom: 2rem;
        }

        .add-city-card h2 {
          color: #2d1f5b;
          margin-bottom: 1.5rem;
        }

        .input-group {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .city-input {
          flex: 1;
          border: 2px solid #e0e0ff;
          transition: all 0.3s ease;
        }

        .city-input:focus {
          border-color: #8b7fdb;
          box-shadow: 0 0 0 3px rgba(139, 127, 219, 0.2);
        }

        .add-button {
          background: linear-gradient(135deg, #8b7fdb 0%, #6c63ff 100%);
          white-space: nowrap;
          border: none;
          transition: all 0.3s ease;
        }

        .add-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
        }

        .locations-table-card {
          overflow: hidden;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .table-header h2 {
          color: #2d1f5b;
          margin: 0;
        }

        .location-count {
          background: #f3f0ff;
          color: #6c63ff;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #e0e0ff;
        }

        table {
          background: white;
          width: 100%;
        }

        th {
          background: #f3f0ff;
          color: #2d1f5b;
          font-weight: 600;
          padding: 1rem;
          text-align: right;
        }

        .location-row {
          transition: background-color 0.2s ease;
        }

        .location-row:hover {
          background-color: #f8f7ff;
        }

        td {
          padding: 1rem;
          border-bottom: 1px solid #e0e0ff;
        }

        .delete-button {
          background: #ff4d6d;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .delete-button:hover {
          background: #ff3557;
          transform: translateY(-2px);
        }

        .empty-state {
          text-align: center;
          color: #666;
          padding: 3rem !important;
          background: #f8f7ff;
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 1rem;
          }

          .input-group {
            flex-direction: column;
          }

          .add-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
