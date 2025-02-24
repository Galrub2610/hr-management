import React, { useState } from 'react';
import styles from '../LocationForm.module.css';

interface StreetNumberStepProps {
  value: string;
  onNext: (streetNumber: string) => void;
  onBack: () => void;
}

/**
 * שלב הזנת מספר הבית בטופס
 */
const StreetNumberStep: React.FC<StreetNumberStepProps> = ({ value, onNext, onBack }) => {
  const [streetNumber, setStreetNumber] = useState(value);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ולידציה בסיסית
    const trimmedNumber = streetNumber.trim();
    if (!trimmedNumber) {
      setError('נא להזין מספר בית');
      return;
    }

    // ולידציה שהוזן מספר תקין (יכול לכלול אותיות עבור כניסה/דירה)
    // מאפשר: מספרים, אותיות בעברית, מקף, קו נטוי ורווח
    const validNumberRegex = /^[\u0590-\u05FF0-9\s\-\/]+$/;
    if (!validNumberRegex.test(trimmedNumber)) {
      setError('נא להזין מספר בית תקין');
      return;
    }

    onNext(trimmedNumber);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>מה מספר הבית?</h2>
      
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={streetNumber}
          onChange={(e) => {
            setStreetNumber(e.target.value);
            setError('');
          }}
          placeholder="הזן מספר בית (לדוגמה: 15, 15א, 15/2)"
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

export default StreetNumberStep; 