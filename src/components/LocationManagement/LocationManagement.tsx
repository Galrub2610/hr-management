import React, { useState, useEffect, ReactElement } from 'react';
import { Location, CreateLocationDto, CalculationType, HourlyLocation, GlobalLocation, DictatedLocation } from '../../types/location.types';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import { systemMessages } from '../../utils/toast';
import styles from './LocationManagement.module.css';
import LocationForm from './LocationForm/LocationForm';
import { getAllLocations, createLocation, deleteLocation, updateLocation } from '../../services/LocationService';

/**
 * קומפוננטה ראשית לניהול מיקומים
 * מכילה את טבלת המיקומים ואת הכפתור ליצירת מיקום חדש
 */
const LocationManagement: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
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

  const loadLocations = async () => {
    try {
      const data = await getAllLocations();
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
      setLocations(prevLocations => [...prevLocations, savedLocation]);
      setIsFormOpen(false);
      showSuccessToast(systemMessages.success.created);
    } catch (error) {
      if (error instanceof Error) {
        showErrorToast(error.message);
      } else {
        showErrorToast(systemMessages.error.general);
      }
    }
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setIsFormOpen(true);
  };

  const handleUpdateLocation = (locationData: CreateLocationDto) => {
    if (!editingLocation) return;

    try {
      const updatedLocation = updateLocation(editingLocation.code, locationData);
      if (updatedLocation) {
        setLocations(prevLocations =>
          prevLocations.map(loc =>
            loc.code === editingLocation.code ? updatedLocation : loc
          )
        );
        setIsFormOpen(false);
        setEditingLocation(null);
        showSuccessToast(systemMessages.success.updated);
      }
    } catch (error) {
      if (error instanceof Error) {
        showErrorToast(error.message);
      } else {
        showErrorToast(systemMessages.error.general);
      }
      console.error('Error updating location:', error);
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

  /**
   * המרת רשימת ימים למחרוזת מפורמטת
   */
  const formatWorkDays = (workDays: string[]): string => {
    if (!workDays || workDays.length === 0) return 'לא נבחרו ימים';
    return workDays.join(', ');
  };

  /**
   * הצגת פרטי החישוב בהתאם לסוג המיקום
   */
  const renderCalculationDetails = (location: Location): ReactElement => {
    switch (location.calculationType) {
      case CalculationType.HOURLY:
        const hourlyLoc = location as HourlyLocation;
        return (
          <>
            <td>{formatWorkDays(hourlyLoc.workDays)}</td>
            <td>{hourlyLoc.hourlyRate} ₪</td>
            <td>{Object.values(hourlyLoc.workHours).join(', ')} שעות</td>
            <td>-</td>
          </>
        );
      case CalculationType.GLOBAL:
        const globalLoc = location as GlobalLocation;
        return (
          <>
            <td>{formatWorkDays(globalLoc.workDays)}</td>
            <td>-</td>
            <td>-</td>
            <td>{globalLoc.monthlyPayment} ₪</td>
          </>
        );
      case CalculationType.DICTATED:
        const dictatedLoc = location as DictatedLocation;
        return (
          <>
            <td>-</td>
            <td>-</td>
            <td>{dictatedLoc.dictatedHours} שעות</td>
            <td>-</td>
          </>
        );
      default:
        return (
          <>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </>
        );
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingLocation(null);
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

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>קוד מיקום</th>
              <th>עיר</th>
              <th>רחוב</th>
              <th>מספר</th>
              <th>סוג חישוב</th>
              <th>ימי עבודה</th>
              <th>תעריף שעתי</th>
              <th>שעות עבודה</th>
              <th>תשלום חודשי</th>
              <th>תאריך יצירה</th>
              <th>תאריך עדכון</th>
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
                {renderCalculationDetails(location)}
                <td>{new Date(location.createdAt).toLocaleDateString('he-IL')}</td>
                <td>{new Date(location.updatedAt).toLocaleDateString('he-IL')}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditLocation(location)}
                    >
                      ערוך
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteLocation(location.code)}
                    >
                      מחק
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {locations.length === 0 && (
              <tr>
                <td colSpan={12} className={styles.emptyState}>
                  {systemMessages.info.noData}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <LocationForm
          cities={cities}
          onSubmit={editingLocation ? handleUpdateLocation : handleCreateLocation}
          onCancel={handleFormClose}
          initialData={editingLocation}
        />
      )}
    </div>
  );
};

export default LocationManagement; 