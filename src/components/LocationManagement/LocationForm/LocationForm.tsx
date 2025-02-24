import React, { useState } from 'react';
import {
  LocationFormState,
  CalculationType,
  WeekDays,
  Location,
  HourlyLocation,
  GlobalLocation,
  DictatedLocation,
  CreateLocationDto
} from '../../../types/location.types';
import { HourlyCalculationStep, GlobalCalculationStep, DictatedCalculationStep } from './CalculationSteps';
import styles from './LocationForm.module.css';

interface LocationFormProps {
  cities: string[];                   // רשימת ערים זמינות
  onSubmit: (data: CreateLocationDto) => void;  // פונקציה לשליחת המיקום החדש
  onCancel: () => void;              // פונקציה לביטול התהליך
}

/**
 * טופס יצירת מיקום חדש בשלבים
 * מציג למשתמש שאלה אחת בכל פעם ומתקדם בהתאם לתשובות
 */
const LocationForm: React.FC<LocationFormProps> = ({ cities, onSubmit, onCancel }) => {
  const [formState, setFormState] = useState<LocationFormState>({
    city: '',
    street: '',
    streetNumber: '',
    calculationType: CalculationType.HOURLY,
    currentStep: 1,
    totalSteps: 5
  });

  /**
   * עדכון מספר השלבים הכולל בהתאם לסוג החישוב
   */
  const handleCalculationTypeSelect = (type: CalculationType) => {
    setFormState(prev => ({
      ...prev,
      calculationType: type,
      currentStep: prev.currentStep + 1
    }));
  };

  /**
   * חישוב אחוז ההתקדמות בטופס
   */
  const calculateProgress = (): number => {
    return Math.round((formState.currentStep / formState.totalSteps) * 100);
  };

  /**
   * שליחת הטופס
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locationData: CreateLocationDto = {
      city: formState.city,
      street: formState.street,
      streetNumber: formState.streetNumber,
      calculationType: formState.calculationType
    };
    onSubmit(locationData);
  };

  /**
   * מעבר לשלב הבא בטופס
   */
  const handleNextStep = () => {
    setFormState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps)
    }));
  };

  /**
   * חזרה לשלב הקודם בטופס
   */
  const handlePrevStep = () => {
    setFormState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }));
  };

  /**
   * רינדור תוכן השלב הנוכחי
   */
  const renderStep = () => {
    switch (formState.currentStep) {
      case 1:
        return (
          <div className={styles.formGroup}>
            <label>עיר:</label>
            <select
              value={formState.city}
              onChange={(e) => setFormState({ ...formState, city: e.target.value })}
              required
            >
              <option value="">בחר עיר</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        );
      case 2:
        return (
          <div className={styles.formGroup}>
            <label>רחוב:</label>
            <input
              type="text"
              value={formState.street}
              onChange={(e) => setFormState({ ...formState, street: e.target.value })}
              required
            />
          </div>
        );
      case 3:
        return (
          <div className={styles.formGroup}>
            <label>מספר בית:</label>
            <input
              type="text"
              value={formState.streetNumber}
              onChange={(e) => setFormState({ ...formState, streetNumber: e.target.value })}
              required
            />
          </div>
        );
      case 4:
        return (
          <div className={styles.formGroup}>
            <label>סוג חישוב:</label>
            <select
              value={formState.calculationType}
              onChange={(e) => handleCalculationTypeSelect(e.target.value as CalculationType)}
              required
            >
              <option value={CalculationType.HOURLY}>חישוב שעתי</option>
              <option value={CalculationType.GLOBAL}>חישוב גלובלי</option>
              <option value={CalculationType.DICTATED}>חישוב שעתי מוכתב</option>
            </select>
          </div>
        );
      case 5:
        switch (formState.calculationType) {
          case CalculationType.HOURLY:
            return <HourlyCalculationStep formState={formState} setFormState={setFormState} />;
          case CalculationType.GLOBAL:
            return <GlobalCalculationStep formState={formState} setFormState={setFormState} />;
          case CalculationType.DICTATED:
            return <DictatedCalculationStep formState={formState} setFormState={setFormState} />;
          default:
            return null;
        }
      default:
        return null;
    }
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h2>הוספת מיקום חדש</h2>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
        <form onSubmit={handleSubmit}>
          {renderStep()}
          <div className={styles.formActions}>
            {formState.currentStep > 1 && (
              <button type="button" className={styles.prevButton} onClick={handlePrevStep}>
                חזור
              </button>
            )}
            {formState.currentStep < formState.totalSteps ? (
              <button 
                type="button" 
                className={styles.nextButton} 
                onClick={handleNextStep}
                disabled={!formState.city && formState.currentStep === 1}
              >
                המשך
              </button>
            ) : (
              <button type="submit" className={styles.submitButton}>
                צור
              </button>
            )}
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationForm; 