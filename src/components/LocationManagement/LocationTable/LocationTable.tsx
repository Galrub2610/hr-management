import React from 'react';
import { Location, CalculationType } from '../../../types/location.types';
import styles from './LocationTable.module.css';

interface LocationTableProps {
  locations: Location[];
  onDelete: (code: string) => void;
  onEdit: (location: Location) => void;
}

/**
 * קומפוננטת טבלה להצגת רשימת המיקומים
 */
const LocationTable: React.FC<LocationTableProps> = ({ locations, onDelete, onEdit }) => {
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
            <th>מספר</th>
            <th>סוג חישוב</th>
            <th>פרטי חישוב</th>
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
              <td>{getCalculationDetails(location)}</td>
              <td>
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => onEdit(location)}
                    className={styles.editButton}
                  >
                    ערוך
                  </button>
                  <button
                    onClick={() => onDelete(location.code)}
                    className={styles.deleteButton}
                  >
                    מחק
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
      return '';
  }
};

/**
 * הצגת פרטי החישוב בהתאם לסוג המיקום
 */
const getCalculationDetails = (location: Location): string => {
  switch (location.calculationType) {
    case CalculationType.HOURLY:
      return `${(location as any).hourlyRate || 0} ₪ לשעה`;
    case CalculationType.GLOBAL:
      return `${(location as any).monthlyPayment || 0} ₪ לחודש`;
    case CalculationType.DICTATED:
      return `${(location as any).dictatedHours || 0} שעות`;
    default:
      return '-';
  }
};

export default LocationTable; 