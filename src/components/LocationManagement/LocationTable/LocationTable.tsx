import React from 'react';
import { Location } from '../../../types/location.types';
import styles from './LocationTable.module.css';

interface LocationTableProps {
  locations: Location[];
  onDelete: (locationId: string) => void;
}

/**
 * קומפוננטת טבלה להצגת רשימת המיקומים
 */
const LocationTable: React.FC<LocationTableProps> = ({ locations, onDelete }) => {
  if (!locations || locations.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>עדיין לא נוספו מיקומים</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>קוד</th>
            <th>עיר</th>
            <th>רחוב</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td>{location.code}</td>
              <td>{location.city}</td>
              <td>{location.street}</td>
              <td>
                <button
                  onClick={() => onDelete(location.id)}
                  className={styles.deleteButton}
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
};

/**
 * המרת סוג החישוב לטקסט מתאים בעברית
 */
const getCalculationTypeDisplay = (type: Location['calculationType']): string => {
  switch (type) {
    case 'hourly':
      return 'חישוב שעתי';
    case 'global':
      return 'חישוב גלובלי';
    case 'dictated':
      return 'חישוב שעתי מוכתב';
    default:
      return '';
  }
};

/**
 * הצגת פרטי החישוב בהתאם לסוג המיקום
 */
const getCalculationDetails = (location: Location): string => {
  switch (location.calculationType) {
    case 'hourly':
      return `${location.hourlyRate} ₪ לשעה`;
    case 'global':
      return `${location.monthlyPayment} ₪ לחודש`;
    case 'dictated':
      return `${location.dictatedHours} שעות`;
    default:
      return '';
  }
};

export default LocationTable; 