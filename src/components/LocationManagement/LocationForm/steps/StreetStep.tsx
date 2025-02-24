import React, { useState } from 'react';
import styles from '../LocationForm.module.css';

interface StreetStepProps {
  value: string;
  onNext: (street: string) => void;
  onBack: () => void;
}

/**
 * שלב הזנת שם הרחוב בטופס
 */
const StreetStep: React.FC<StreetStepProps> = ({ value, onNext, onBack }) => {
  const [street, setStreet] = useState(value);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ולידציה בסיסית
    const trimmedStreet = street.trim();
    if (!trimmedStreet) {
      setError('נא להזין שם רחוב');
      return;
    }

    // ולידציה שהוזנו רק אותיות בעברית ורווחים
    const hebrewLettersRegex = /^[\u0590-\u05FF\s]+$/;
    if (!hebrewLettersRegex.test(trimmedStreet)) {
      setError('נא להזין שם רחוב בעברית בלבד');
      return;
    }

    onNext(trimmedStreet);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>מה שם הרחוב?</h2>
      
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={street}
          onChange={(e) => {
            setStreet(e.target.value);
            setError('');
          }}
          placeholder="הזן שם רחוב"
          className={error ? styles.errorInput : ''}
          dir="rtl"
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>

      <div className={styles.buttonContainer}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          חזור
        </button>
        <button type="submit" className={styles.nextButton}>
          המשך
        </button>
      </div>
    </form>
  );
};

export default StreetStep; 