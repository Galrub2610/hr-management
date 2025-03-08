import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { City, CreateCityDto, getAllCities, createCity, deleteCity, updateCity } from '../services/CitiesService';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import styles from './CitiesManagement.module.css';
import { toast } from 'react-toastify';

const CitiesManagement: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCityDto>({
    name: ''
  });

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCities();
      setCities(data);
    } catch (error) {
      showErrorToast('שגיאה בטעינת הערים');
      console.error('Error loading cities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showErrorToast('נא להזין שם עיר');
      return;
    }

    setIsLoading(true);
    try {
      if (editingCity) {
        const updatedCity = await updateCity(editingCity.code, formData);
        if (updatedCity) {
          showSuccessToast('העיר עודכנה בהצלחה');
          await loadCities();
        }
      } else {
        const newCity = await createCity(formData);
        if (newCity) {
          showSuccessToast('העיר נוספה בהצלחה');
          await loadCities();
        }
      }
      handleFormClose();
    } catch (error) {
      if (error instanceof Error) {
        showErrorToast(error.message);
      } else {
        showErrorToast('שגיאה בשמירת העיר');
      }
      console.error('Error saving city:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({
      name: city.name
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (code: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק עיר זו?')) {
      setIsLoading(true);
      try {
        const success = await deleteCity(code);
        if (success) {
          showSuccessToast('העיר נמחקה בהצלחה');
          await loadCities();
        } else {
          showErrorToast('לא ניתן למחוק את העיר');
        }
      } catch (error) {
        showErrorToast('שגיאה במחיקת העיר');
        console.error('Error deleting city:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCity(null);
    setFormData({
      name: ''
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/database" className={styles.backButton}>
            חזרה למאגרי נתונים
          </Link>
          <div>
            <h1>
              ערי ישראל
            </h1>
          </div>
        </div>
        <button 
          className={styles.addButton}
          onClick={() => setIsFormOpen(true)}
          disabled={isLoading}
        >
          הוסף עיר חדשה
        </button>
      </header>

      <div className={styles.tableContainer}>
        <div className={styles.tableTitle}>
          <h2>טבלת ניהול ערים (citiesDataTable)</h2>
        </div>
        <table className={styles.dataTable} data-variable-name="citiesDataTable">
          <thead>
            <tr>
              <th className={styles.codeColumn}>קוד עיר (cityCodeColumn)</th>
              <th className={styles.nameColumn}>שם עיר (cityNameColumn)</th>
              <th className={styles.actionsColumn}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city.code}>
                <td className={styles.codeColumn}>{city.code}</td>
                <td className={styles.nameColumn}>{city.name}</td>
                <td className={styles.actionsColumn}>
                  <div className={styles.actionButtons}>
                    <button className={styles.editButton} onClick={() => handleEdit(city)} disabled={isLoading}>ערוך</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(city.code)} disabled={isLoading}>מחק</button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && cities.length === 0 && (
              <tr>
                <td colSpan={3} className={styles.emptyState}>לא נמצאו ערים במערכת</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h2>
                {editingCity ? 'עריכת עיר' : 'הוספת עיר חדשה'}
              </h2>
              
              <div className="form-group">
                <label className="form-label">
                  שם העיר
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    disabled={isLoading}
                    placeholder="הזן שם עיר"
                    autoFocus
                  />
                </label>
              </div>

              <div className={styles.formButtons}>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {editingCity ? 'עדכן עיר' : 'צור עיר'}
                </button>
                <button 
                  type="button" 
                  onClick={handleFormClose}
                  className={styles.cancelButton}
                  disabled={isLoading}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitiesManagement; 