import React from 'react';
import { LocationFormState, WeekDays, WorkDay, CalculationType } from '../../../types/location.types';
import styles from './LocationForm.module.css';

interface StepProps {
  formState: LocationFormState;
  onUpdate: (updates: Partial<LocationFormState>) => void;
}

/**
 * שלב 5 - הגדרת פרטי חישוב שעתי
 */
export const HourlyCalculationStep: React.FC<StepProps> = ({ formState, onUpdate }) => {
  const handleDayToggle = (day: WeekDays, isActive: boolean) => {
    const workDays = formState.workDays || Object.values(WeekDays).map(d => ({
      day: d,
      hours: 0,
      isActive: false
    }));

    const updatedWorkDays = workDays.map(wd => 
      wd.day === day ? { ...wd, isActive } : wd
    );

    onUpdate({ workDays: updatedWorkDays });
  };

  const handleHoursChange = (day: WeekDays, hours: number) => {
    const workDays = formState.workDays?.map(wd =>
      wd.day === day ? { ...wd, hours } : wd
    );

    onUpdate({ workDays });
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
        
        {Object.values(WeekDays).map((day) => {
          const workDay = formState.workDays?.find(wd => wd.day === day);
          const isActive = workDay?.isActive || false;
          
          return (
            <div key={day} className={styles.workDayRow}>
              <div className={styles.dayColumn}>
                <label>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => handleDayToggle(day, e.target.checked)}
                  />
                  {day}
                </label>
              </div>
              <div className={styles.hoursColumn}>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={workDay?.hours || 0}
                  onChange={(e) => handleHoursChange(day, Number(e.target.value))}
                  disabled={!isActive}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.hourlyRate}>
        <label>
          עלות לשעה (₪):
          <input
            type="number"
            min="0"
            step="0.1"
            value={formState.hourlyRate || ''}
            onChange={(e) => onUpdate({ hourlyRate: Number(e.target.value) })}
            required
          />
        </label>
      </div>
    </div>
  );
};

/**
 * שלב 6 - הגדרת פרטי חישוב גלובלי
 */
export const GlobalCalculationStep: React.FC<StepProps> = ({ formState, onUpdate }) => {
  const handleDayToggle = (day: WeekDays) => {
    const selectedDays = formState.selectedDays || [];
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    
    onUpdate({ selectedDays: updatedDays });
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
              onChange={(e) => onUpdate({ monthlyPayment: Number(e.target.value) })}
              required
            />
          </label>
        </div>
      </div>
    </div>
  );
};

/**
 * שלב 7 - הגדרת פרטי חישוב שעתי מוכתב
 */
export const DictatedCalculationStep: React.FC<StepProps> = ({ formState, onUpdate }) => {
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
            onChange={(e) => onUpdate({ dictatedHours: Number(e.target.value) })}
            required
          />
        </label>
      </div>
    </div>
  );
}; 