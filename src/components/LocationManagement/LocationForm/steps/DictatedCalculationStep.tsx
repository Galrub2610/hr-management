import React, { useState } from 'react';
import { Location, LocationFormState, CalculationType } from '../../../../types/location.types';
import styles from '../LocationForm.module.css';

interface DictatedCalculationStepProps {
  formState: LocationFormState;
  onSubmit: (location: Location) => void;
  onBack: () => void;
}

/**
 * שלב הגדרת שעות מוכתבות
 */
const DictatedCalculationStep: React.FC<DictatedCalculationStepProps> = ({ formState, onSubmit, onBack }) => {
  // כמות שעות מוכתבת
  const [dictatedHours, setDictatedHours] = useState('');
  
  // שגיאה
  const [error, setError] = useState('');

  /**
   * ולידציה והגשת הטופס
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // בדיקת הזנת שעות
    if (!dictatedHours) {
      setError('יש להזין כמות שעות');
      return;
    }

    // בדיקה שהערך חיובי
    const hours = parseFloat(dictatedHours);
    if (hours <= 0) {
      setError('יש להזין מספר שעות חיובי');
      return;
    }

    // יצירת אובייקט המיקום
    const location: Location = {
      id: crypto.randomUUID(),
      city: formState.city,
      street: formState.street,
      streetNumber: formState.streetNumber,
      calculationType: CalculationType.DICTATED,
      dictatedHours: hours
    };

    onSubmit(location);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>הגדרת שעות מוכתבות</h2>

      <div className={styles.dictatedContainer}>
        <div className={styles.infoBox}>
          <p>
            בחישוב שעתי מוכתב, מספר השעות קבוע מראש ללא תלות בשעות העבודה בפועל.
            הזן את מספר השעות הקבוע לחישוב.
          </p>
        </div>

        <div className={styles.hoursInputContainer}>
          <h3>כמות שעות מוכתבת</h3>
          <div className={styles.inputWithUnit}>
            <input
              type="text"
              value={dictatedHours}
              onChange={(e) => {
                // אפשר רק מספרים ונקודה עשרונית
                if (e.target.value && !/^\d*\.?\d*$/.test(e.target.value)) return;
                setDictatedHours(e.target.value);
                setError('');
              }}
              placeholder="הזן מספר שעות"
              className={error ? styles.errorInput : ''}
            />
            <span className={styles.unit}>שעות</span>
          </div>
          {error && <span className={styles.errorText}>{error}</span>}
        </div>
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

export default DictatedCalculationStep; 