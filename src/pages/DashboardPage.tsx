// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { getAllLocations } from '../services/LocationService';
import { Location, CalculationType } from '../types/location.types';
import { formatCurrency } from '../utils/locationUtils';
import styles from './DashboardPage.module.css';

// פונקציית עזר להמרת ימים לעברית
const daysMap: { [key: string]: string } = {
  'SUNDAY': 'ראשון',
  'MONDAY': 'שני',
  'TUESDAY': 'שלישי',
  'WEDNESDAY': 'רביעי',
  'THURSDAY': 'חמישי',
  'FRIDAY': 'שישי',
  'SATURDAY': 'שבת'
};

export default function DashboardPage() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await getAllLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  // חישוב הסכום לגבייה
  const calculateAmount = (location: Location): number => {
    if (location.calculationType === CalculationType.HOURLY) {
      const totalHours = location.workDays.reduce((sum, day) => sum + (day.hours || 0), 0);
      return totalHours * (location as any).hourlyRate;
    } else if (location.calculationType === CalculationType.GLOBAL) {
      return (location as any).globalAmount;
    }
    return 0;
  };

  // פונקציה להצגת פרטי התשלום
  const renderPaymentDetails = (location: Location) => {
    if (location.calculationType === CalculationType.HOURLY) {
      return (
        <div>
          <div>תעריף לשעה: {formatCurrency((location as any).hourlyRate)}</div>
          {location.workDays.map(day => (
            <div key={day.dayName}>
              {daysMap[day.dayName]}: {day.hours} שעות
            </div>
          ))}
        </div>
      );
    } else if (location.calculationType === CalculationType.GLOBAL) {
      return <div>סכום גלובלי: {formatCurrency((location as any).globalAmount)}</div>;
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.mainTitle}>
          דוח ניהול חברת אורלנדו אחזקות וניהול מבנים א.ג בע״מ
        </h1>
      </div>

      <div className={styles.tableContainer}>
        <h2 className={styles.tableTitle}>
          ניהול ההכנסות וההוצאות של החברה (companyFinanceTable)
        </h2>
        
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th colSpan={5} className={styles.sectionHeader}>
                  הכנסות (incomeSection)
                </th>
              </tr>
              <tr>
                <th>חברות ניהול (managementCompany)</th>
                <th>כתובת (locationAddress)</th>
                <th>ימי עבודה (workDays)</th>
                <th>פרטי תשלום (paymentDetails)</th>
                <th>סכום לגבייה (collectionAmount)</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.code}>
                  <td>
                    {location.managementCompany 
                      ? `${location.managementCompany.name} (${location.managementCompany.code})`
                      : '-'}
                  </td>
                  <td>
                    {`${location.street}, ${location.streetNumber}, ${location.city}`}
                  </td>
                  <td>
                    {location.workDays.map(day => daysMap[day.dayName]).join(', ')}
                  </td>
                  <td>
                    {renderPaymentDetails(location)}
                  </td>
                  <td>
                    {formatCurrency(calculateAmount(location))}
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    לא נמצאו נתונים
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
