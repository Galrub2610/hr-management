import React, { useState } from 'react';
import styles from '../LocationForm.module.css';

interface CityStepProps {
  value: string;
  onNext: (city: string) => void;
}

/**
 * רשימת הערים לבחירה
 * TODO: להעביר למקור נתונים חיצוני
 */
const CITIES = [
  'תל אביב',
  'ירושלים',
  'חיפה',
  'באר שבע',
  'ראשון לציון',
  'פתח תקווה',
  'אשדוד',
  'נתניה',
  'רמת גן',
  'חולון'
];

/**
 * שלב בחירת העיר בטופס
 */
const CityStep: React.FC<CityStepProps> = ({ value, onNext }) => {
  const [selectedCity, setSelectedCity] = useState(value);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCity) {
      setError('נא לבחור עיר');
      return;
    }

    onNext(selectedCity);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>באיזה עיר מיקום העבודה?</h2>
      
      <div className={styles.selectContainer}>
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setError('');
          }}
          className={error ? styles.errorInput : ''}
        >
          <option value="">בחר עיר</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>

      <div className={styles.buttonContainer}>
        <button type="submit" className={styles.nextButton}>
          המשך
        </button>
      </div>
    </form>
  );
};

export default CityStep; 