import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './CitiesPage.module.css';

interface City {
  id: string;
  name: string;
  code: string;
}

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  useEffect(() => {
    setCities([
      { id: '1', name: 'תל אביב', code: 'TLV' },
      { id: '2', name: 'ירושלים', code: 'JLM' }
    ]);
  }, []);

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setIsAddFormOpen(true);
  };

  const handleDelete = async (cityId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק עיר זו?')) {
      try {
        toast.success('העיר נמחקה בהצלחה');
      } catch (error) {
        toast.error('אירעה שגיאה במחיקת העיר');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>ניהול ערים</h1>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>מזהה</th>
              <th>שם עיר</th>
              <th>קוד עיר</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city.id}>
                <td>{city.id}</td>
                <td>{city.name}</td>
                <td>{city.code}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button onClick={() => handleEdit(city)}>ערוך</button>
                    <button onClick={() => handleDelete(city.id)}>מחק</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 