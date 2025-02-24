import React from 'react';
import { LocationFormState, WeekDays, WorkDay } from '../../../types/location.types';
import styles from './LocationForm.module.css';

interface StepProps {
  formState: LocationFormState;
  setFormState: React.Dispatch<React.SetStateAction<LocationFormState>>;
}

/**
 * שלב 5 - חישוב שעתי
 * כולל בחירת ימי עבודה, הגדרת שעות לכל יום ותעריף שעתי
 */
export const HourlyCalculationStep: React.FC<StepProps> = ({ formState, setFormState }) => {
  // יצירת מערך ימי עבודה ראשוני - כל הימים מסומנים כברירת מחדל
  React.useEffect(() => {
    if (!formState.workDays) {
      const workDays = Object.values(WeekDays).map(day => ({
        day,
        hours: 0,
        isActive: true // כל הימים מסומנים כברירת מחדל
      }));
      setFormState(prev => ({ ...prev, workDays }));
    }
  }, []);

  // טיפול בשינוי סטטוס יום עבודה
  const handleDayToggle = (day: WeekDays, isActive: boolean) => {
    const updatedWorkDays = formState.workDays?.map(wd =>
      wd.day === day ? { ...wd, isActive, hours: isActive ? wd.hours : 0 } : wd
    ) || [];

    setFormState(prev => ({ ...prev, workDays: updatedWorkDays }));
  };

  // טיפול בשינוי שעות עבודה
  const handleHoursChange = (day: WeekDays, hours: number) => {
    const updatedWorkDays = formState.workDays?.map(wd =>
      wd.day === day ? { ...wd, hours } : wd
    ) || [];

    setFormState(prev => ({ ...prev, workDays: updatedWorkDays }));
  };

  return (
    <div className={styles.step}>
      <h2>חישוב שעתי</h2>
      <h3>באיזה ימים, כמה שעות עובדים ביום וכמה משלמים?</h3>
      
      <div className={styles.workDaysTable}>
        <div className={styles.tableHeader}>
          <div>ימות השבוע</div>
          <div>כמות שעות עבודה ביום</div>
        </div>
        
        {formState.workDays?.map((workDay) => (
          <div key={workDay.day} className={styles.workDayRow}>
            <div className={styles.dayColumn}>
              <label>
                <input
                  type="checkbox"
                  checked={workDay.isActive}
                  onChange={(e) => handleDayToggle(workDay.day, e.target.checked)}
                />
                {workDay.day}
              </label>
            </div>
            <div className={styles.hoursColumn}>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={workDay.hours}
                onChange={(e) => handleHoursChange(workDay.day, Number(e.target.value))}
                disabled={!workDay.isActive}
                placeholder="0"
                className={styles.input}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.hourlyRate}>
        <label>
          עלות לשעה (₪):
          <input
            type="number"
            min="0"
            step="0.1"
            value={formState.hourlyRate || ''}
            onChange={(e) => setFormState(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
            required
            placeholder="0.00"
            className={styles.input}
          />
        </label>
      </div>
    </div>
  );
};

/**
 * שלב 6 - חישוב גלובלי
 * כולל בחירת ימי עבודה ותשלום חודשי קבוע
 */
export const GlobalCalculationStep: React.FC<StepProps> = ({ formState, setFormState }) => {
  // יצירת מערך ימים נבחרים ראשוני - כל הימים מסומנים כברירת מחדל
  React.useEffect(() => {
    if (!formState.selectedDays) {
      setFormState(prev => ({ 
        ...prev, 
        selectedDays: Object.values(WeekDays) // כל הימים מסומנים כברירת מחדל
      }));
    }
  }, []);

  // טיפול בבחירת/ביטול יום עבודה
  const handleDayToggle = (day: WeekDays) => {
    const selectedDays = formState.selectedDays || [];
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    
    setFormState(prev => ({ ...prev, selectedDays: updatedDays }));
  };

  return (
    <div className={styles.step}>
      <h2>חישוב גלובלי</h2>
      <h3>כמה ימים עובדים וכמה משלמים?</h3>

      <div className={styles.globalCalculation}>
        <div className={styles.workDays}>
          <h4>ימות השבוע</h4>
          {Object.values(WeekDays).map((day) => (
            <label key={day} className={styles.dayCheckbox}>
              <input
                type="checkbox"
                checked={formState.selectedDays?.includes(day) || false}
                onChange={() => handleDayToggle(day)}
              />
              {day}
            </label>
          ))}
        </div>

        <div className={styles.monthlyPayment}>
          <label>
            סכום לתשלום חודשי (₪):
            <input
              type="number"
              min="0"
              step="0.1"
              value={formState.monthlyPayment || ''}
              onChange={(e) => setFormState(prev => ({ ...prev, monthlyPayment: Number(e.target.value) }))}
              required
              placeholder="0.00"
              className={styles.input}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

/**
 * שלב 7 - חישוב שעתי מוכתב
 * הזנת מספר שעות קבוע
 */
export const DictatedCalculationStep: React.FC<StepProps> = ({ formState, setFormState }) => {
  return (
    <div className={styles.step}>
      <h2>חישוב שעתי מוכתב</h2>
      <div className={styles.dictatedHours}>
        <label>
          כמות שעות מוכתבת:
          <input
            type="number"
            min="0"
            step="0.1"
            value={formState.dictatedHours || ''}
            onChange={(e) => setFormState(prev => ({ ...prev, dictatedHours: Number(e.target.value) }))}
            required
            placeholder="0.0"
            className={styles.input}
          />
        </label>
      </div>
    </div>
  );
}; 