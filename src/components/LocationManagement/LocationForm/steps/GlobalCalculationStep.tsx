import React, { useState } from 'react';
import { WeekDays, Location, LocationFormState, CalculationType } from '../../../../types/location.types';
import styles from '../LocationForm.module.css';

interface GlobalCalculationStepProps {
  formState: LocationFormState;
  onSubmit: (location: Location) => void;
  onBack: () => void;
}

/**
 * רשימת ימי השבוע
 */
const WEEK_DAYS: WeekDays[] = [
  WeekDays.SUNDAY,
  WeekDays.MONDAY,
  WeekDays.TUESDAY,
  WeekDays.WEDNESDAY,
  WeekDays.THURSDAY,
  WeekDays.FRIDAY,
  WeekDays.SATURDAY
];

/**
 * שלב הגדרת ימי עבודה ותשלום חודשי גלובלי
 */
const GlobalCalculationStep: React.FC<GlobalCalculationStepProps> = ({ formState, onSubmit, onBack }) => {
  // ימי עבודה נבחרים
  const [selectedDays, setSelectedDays] = useState<WeekDays[]>([]);
  
  // תשלום חודשי
  const [monthlyPayment, setMonthlyPayment] = useState('');
  
  // שגיאות
  const [errors, setErrors] = useState({
    days: '',
    payment: ''
  });

  /**
   * טוגל בחירת יום
   */
  const handleDayToggle = (day: WeekDays) => {
    setSelectedDays(prev => {
      const isSelected = prev.includes(day);
      if (isSelected) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
    setErrors(prev => ({ ...prev, days: '' }));
  };

  /**
   * ולידציה והגשת הטופס
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { days: '', payment: '' };
    let hasError = false;

    // בדיקה שנבחר לפחות יום אחד
    if (selectedDays.length === 0) {
      newErrors.days = 'יש לבחור לפחות יום עבודה אחד';
      hasError = true;
    }

    // בדיקת תשלום חודשי
    if (!monthlyPayment) {
      newErrors.payment = 'יש להזין סכום לתשלום חודשי';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // יצירת אובייקט המיקום
    const location: Location = {
      id: crypto.randomUUID(),
      city: formState.city,
      street: formState.street,
      streetNumber: formState.streetNumber,
      calculationType: CalculationType.GLOBAL,
      workDays: selectedDays,
      monthlyPayment: parseFloat(monthlyPayment)
    };

    onSubmit(location);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>הגדרת ימי עבודה ותשלום חודשי</h2>

      <div className={styles.workDaysContainer}>
        <h3>ימי עבודה</h3>
        <div className={styles.daysGrid}>
          {WEEK_DAYS.map(day => (
            <div key={day} className={styles.dayRow}>
              <label className={styles.dayCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={() => handleDayToggle(day)}
                />
                <span>{day}</span>
              </label>
            </div>
          ))}
        </div>
        {errors.days && <span className={styles.errorText}>{errors.days}</span>}
      </div>

      <div className={styles.paymentContainer}>
        <h3>סכום לתשלום חודשי</h3>
        <div className={styles.paymentInput}>
          <input
            type="text"
            value={monthlyPayment}
            onChange={(e) => {
              if (e.target.value && !/^\d*\.?\d*$/.test(e.target.value)) return;
              setMonthlyPayment(e.target.value);
              setErrors(prev => ({ ...prev, payment: '' }));
            }}
            placeholder="הזן סכום חודשי"
          />
          <span className={styles.currency}>₪</span>
        </div>
        {errors.payment && <span className={styles.errorText}>{errors.payment}</span>}
      </div>

      <div className={styles.buttonContainer}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          חזור
        </button>
        <button type="submit" className={styles.nextButton}>
          סיום
        </button>
      </div>
    </form>
  );
};

export default GlobalCalculationStep; 