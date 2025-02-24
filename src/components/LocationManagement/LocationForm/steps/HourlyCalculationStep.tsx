import React, { useState } from 'react';
import { WeekDays, Location, LocationFormState } from '../../../../types/location.types';
import styles from '../LocationForm.module.css';
import { CalculationType } from '../../../../types/location.types';

interface HourlyCalculationStepProps {
  formState: LocationFormState;
  onSubmit: (location: Location) => void;
  onBack: () => void;
}

/**
 * מבנה נתונים ליום עבודה
 */
interface DayData {
  day: WeekDays;
  isActive: boolean;
  hours: string;
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
 * שלב הגדרת שעות עבודה ותעריף לחישוב שעתי
 */
const HourlyCalculationStep: React.FC<HourlyCalculationStepProps> = ({ formState, onSubmit, onBack }) => {
  // מצב ימי העבודה - כל הימים מסומנים כברירת מחדל
  const [workDays, setWorkDays] = useState<DayData[]>(
    WEEK_DAYS.map(day => ({
      day,
      isActive: true,
      hours: ''
    }))
  );

  // תעריף לשעה
  const [hourlyRate, setHourlyRate] = useState('');
  
  // שגיאות
  const [errors, setErrors] = useState({
    days: '',
    hours: '',
    rate: ''
  });

  /**
   * עדכון סטטוס יום עבודה
   */
  const handleDayToggle = (index: number) => {
    setWorkDays(prev => {
      const newDays = [...prev];
      newDays[index] = {
        ...newDays[index],
        isActive: !newDays[index].isActive,
        hours: !newDays[index].isActive ? '' : newDays[index].hours
      };
      return newDays;
    });
    setErrors(prev => ({ ...prev, days: '' }));
  };

  /**
   * עדכון שעות עבודה ליום
   */
  const handleHoursChange = (index: number, value: string) => {
    // אפשר רק מספרים ונקודה עשרונית
    if (value && !/^\d*\.?\d*$/.test(value)) return;

    setWorkDays(prev => {
      const newDays = [...prev];
      newDays[index] = {
        ...newDays[index],
        hours: value
      };
      return newDays;
    });
    setErrors(prev => ({ ...prev, hours: '' }));
  };

  /**
   * ולידציה והגשת הטופס
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { days: '', hours: '', rate: '' };
    let hasError = false;

    // בדיקה שנבחר לפחות יום אחד
    const activeDays = workDays.filter(d => d.isActive);
    if (activeDays.length === 0) {
      newErrors.days = 'יש לבחור לפחות יום עבודה אחד';
      hasError = true;
    }

    // בדיקה שהוזנו שעות לכל יום פעיל
    const missingHours = activeDays.some(d => !d.hours);
    if (missingHours) {
      newErrors.hours = 'יש להזין שעות עבודה לכל הימים שנבחרו';
      hasError = true;
    }

    // בדיקת תעריף שעתי
    if (!hourlyRate) {
      newErrors.rate = 'יש להזין תעריף לשעה';
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
      calculationType: CalculationType.HOURLY,
      workDays: workDays
        .filter(d => d.isActive)
        .map(d => ({
          day: d.day,
          hours: parseFloat(d.hours),
          isActive: true
        })),
      hourlyRate: parseFloat(hourlyRate)
    };

    onSubmit(location);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>הגדרת שעות עבודה ותעריף</h2>

      <div className={styles.workDaysContainer}>
        <h3>ימי עבודה ושעות</h3>
        <div className={styles.daysGrid}>
          {workDays.map((day, index) => (
            <div key={day.day} className={styles.dayRow}>
              <label className={styles.dayCheckbox}>
                <input
                  type="checkbox"
                  checked={day.isActive}
                  onChange={() => handleDayToggle(index)}
                />
                <span>{day.day}</span>
              </label>
              <input
                type="text"
                value={day.hours}
                onChange={(e) => handleHoursChange(index, e.target.value)}
                placeholder="שעות"
                disabled={!day.isActive}
                className={`${styles.hoursInput} ${day.isActive ? '' : styles.disabled}`}
              />
            </div>
          ))}
        </div>
        {errors.days && <span className={styles.errorText}>{errors.days}</span>}
        {errors.hours && <span className={styles.errorText}>{errors.hours}</span>}
      </div>

      <div className={styles.rateContainer}>
        <h3>תעריף לשעה</h3>
        <div className={styles.rateInput}>
          <input
            type="text"
            value={hourlyRate}
            onChange={(e) => {
              if (e.target.value && !/^\d*\.?\d*$/.test(e.target.value)) return;
              setHourlyRate(e.target.value);
              setErrors(prev => ({ ...prev, rate: '' }));
            }}
            placeholder="הזן תעריף לשעה"
          />
          <span className={styles.currency}>₪</span>
        </div>
        {errors.rate && <span className={styles.errorText}>{errors.rate}</span>}
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

export default HourlyCalculationStep; 