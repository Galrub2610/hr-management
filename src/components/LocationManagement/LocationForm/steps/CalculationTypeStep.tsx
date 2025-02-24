import React, { useState } from 'react';
import { CalculationType } from '../../../../types/location.types';
import styles from '../LocationForm.module.css';

interface CalculationTypeStepProps {
  value?: CalculationType;
  onNext: (type: CalculationType) => void;
  onBack: () => void;
}

/**
 * אפשרויות החישוב השונות
 */
const CALCULATION_OPTIONS = [
  {
    type: CalculationType.HOURLY,
    label: 'חישוב שעתי',
    description: 'חישוב לפי שעות עבודה בפועל'
  },
  {
    type: CalculationType.GLOBAL,
    label: 'חישוב גלובלי',
    description: 'תשלום קבוע חודשי'
  },
  {
    type: CalculationType.DICTATED,
    label: 'חישוב שעתי מוכתב',
    description: 'חישוב לפי מספר שעות קבוע'
  }
];

/**
 * שלב בחירת סוג החישוב בטופס
 */
const CalculationTypeStep: React.FC<CalculationTypeStepProps> = ({ value, onNext, onBack }) => {
  const [selectedType, setSelectedType] = useState<CalculationType | undefined>(value);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType) {
      setError('נא לבחור סוג חישוב');
      return;
    }

    onNext(selectedType);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>מה סוג החישוב?</h2>
      
      <div className={styles.calculationOptions}>
        {CALCULATION_OPTIONS.map(option => (
          <div 
            key={option.type}
            className={`${styles.calculationOption} ${selectedType === option.type ? styles.selected : ''}`}
            onClick={() => {
              setSelectedType(option.type);
              setError('');
            }}
          >
            <div className={styles.optionHeader}>
              <input
                type="radio"
                name="calculationType"
                checked={selectedType === option.type}
                onChange={() => {
                  setSelectedType(option.type);
                  setError('');
                }}
              />
              <h3>{option.label}</h3>
            </div>
            <p className={styles.optionDescription}>{option.description}</p>
          </div>
        ))}
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

export default CalculationTypeStep; 