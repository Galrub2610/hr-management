import React, { useState, useEffect } from 'react';
import { Location, CreateLocationDto, CalculationType } from '../../types/location.types';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import { systemMessages } from '../../utils/toast';
import styles from './LocationManagement.module.css';
import LocationForm from './LocationForm/LocationForm';
import { getAllLocations, createLocation, deleteLocation } from '../../services/LocationService';

/**
 * קומפוננטה ראשית לניהול מיקומים
 * מכילה את טבלת המיקומים ואת הכפתור ליצירת מיקום חדש
 */
const LocationManagement: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [cities] = useState<string[]>([
    'תל אביב',
    'הרצליה',
    'רעננה',
    'כפר סבא',
    'נתניה',
    'חדרה',
    'ראש העין',
    'שוהם',
    'קריית אונו',
    'פתח תקווה',
    'גני תקווה',
    'אשדוד',
    'באר שבע',
    'רמת השרון',
    'הוד השרון',
    'לוד',
    'רמלה'
  ]);

  // טעינת מיקומים בטעינת הדף
  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = () => {
    try {
      const data = getAllLocations();
      console.log("נטענו מיקומים:", data);
      setLocations(data);
    } catch (error) {
      showErrorToast(systemMessages.error.general);
      console.error('Error loading locations:', error);
    }
  };

  const handleCreateLocation = (locationData: CreateLocationDto) => {
    try {
      const savedLocation = createLocation(locationData);
      console.log("נוצר מיקום חדש:", savedLocation);
      setLocations(prevLocations => [...prevLocations, savedLocation]);
      setIsFormOpen(false);
      showSuccessToast(systemMessages.success.created);
    } catch (error) {
      if (error instanceof Error) {
        showErrorToast(error.message);
      } else {
        showErrorToast(systemMessages.error.general);
      }
      console.error('Error creating location:', error);
    }
  };

  const handleDeleteLocation = (code: string) => {
    console.log("מנסה למחוק מיקום עם קוד:", code);
    
    if (window.confirm(systemMessages.warning.deleteConfirmation)) {
      try {
        const success = deleteLocation(code);
        console.log("תוצאת המחיקה:", success);
        
        if (success) {
          setLocations(prevLocations => {
            const updated = prevLocations.filter(loc => loc.code !== code);
            console.log("מיקומים אחרי מחיקה:", updated);
            return updated;
          });
          showSuccessToast(systemMessages.success.deleted);
        } else {
          showErrorToast(systemMessages.error.general);
        }
      } catch (error) {
        showErrorToast(systemMessages.error.general);
        console.error('Error deleting location:', error);
      }
    }
  };

  /**
   * המרת סוג החישוב לטקסט בעברית
   */
  const getCalculationTypeText = (type: CalculationType): string => {
    switch (type) {
      case CalculationType.HOURLY:
        return 'חישוב שעתי';
      case CalculationType.GLOBAL:
        return 'חישוב גלובלי';
      case CalculationType.DICTATED:
        return 'חישוב שעתי מוכתב';
      default:
        return type;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>ניהול מקומות עבודה</h1>
        <button 
          className={styles.addButton}
          onClick={() => setIsFormOpen(true)}
        >
          צור מיקום חדש
        </button>
      </header>

      {/* טבלת מיקומים */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>קוד מיקום</th>
              <th>עיר</th>
              <th>רחוב</th>
              <th>מספר</th>
              <th>סוג חישוב</th>
              <th>תאריך יצירה</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.code}>
                <td>{location.code}</td>
                <td>{location.city}</td>
                <td>{location.street}</td>
                <td>{location.streetNumber}</td>
                <td>{getCalculationTypeText(location.calculationType)}</td>
                <td>{new Date(location.createdAt).toLocaleDateString('he-IL')}</td>
                <td>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteLocation(location.code)}
                  >
                    מחק
                  </button>
                </td>
              </tr>
            ))}
            {locations.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  {systemMessages.info.noData}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* טופס יצירת מיקום חדש */}
      {isFormOpen && (
        <LocationForm
          cities={cities}
          onSubmit={handleCreateLocation}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default LocationManagement; 