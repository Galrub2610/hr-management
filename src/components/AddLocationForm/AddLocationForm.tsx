import React, { useState, useEffect } from 'react';
import { 
  CalculationType, 
  Location, 
  LocationFormData,
  DayName,
  HourlyLocation,
  GlobalLocation,
  DictatedLocation,
  WorkDay
} from '../../types/location.types';
import { City } from '../../services/CitiesService';
import { Company } from '../../types/company.types';
import styles from './AddLocationForm.module.css';  // שינוי לשימוש ב-CSS Modules

// העברת הסטיילינג לקובץ CSS Modules נפרד
// AddLocationForm.module.css

interface AddLocationFormProps {
  isOpen: boolean;
  cities: City[];
  companies: Company[];
  onSubmit: (data: LocationFormData) => Promise<void>;
  onClose: () => void;
  initialData?: Location | null;
}

// עדכון הימים להשתמש ב-DayName
const DAYS: Array<{ id: DayName; label: string }> = [
  { id: DayName.SUNDAY, label: 'ראשון' },
  { id: DayName.MONDAY, label: 'שני' },
  { id: DayName.TUESDAY, label: 'שלישי' },
  { id: DayName.WEDNESDAY, label: 'רביעי' },
  { id: DayName.THURSDAY, label: 'חמישי' },
  { id: DayName.FRIDAY, label: 'שישי' },
  { id: DayName.SATURDAY, label: 'שבת' }
];

const DEFAULT_FORM_DATA: LocationFormData = {
  street: '',
  streetNumber: '',
  cityCode: '',
  managementCompanyCode: '',
  calculationType: CalculationType.HOURLY,
  weekDays: [],
  dayHours: [],
  hourlyRate: '',
  globalAmount: '',
  dictatedHours: ''
};

// הוספת טיפוס לשגיאות
type FormErrors = Partial<Record<keyof LocationFormData | 'submit', string>>;

// קבועים עם טיפוסים מפורשים
const HOURS_CONSTRAINTS = {
  MIN: 0,
  MAX: 24,
  STEP: 0.5
} as const;

const WEEKLY_HOURS_CONSTRAINTS = {
  MIN: 1,
  MAX: 168,
  STEP: 0.5
} as const;

const CURRENCY_CONSTRAINTS = {
  MIN: 0,
  STEP: 0.1
} as const;

interface NumericFieldConfig {
  min: number;
  max?: number;
  step: number;
  validator: (value: number) => boolean;
}

const numericFieldsConfig: Record<string, NumericFieldConfig> = {
  hourlyRate: {
    min: CURRENCY_CONSTRAINTS.MIN,
    step: CURRENCY_CONSTRAINTS.STEP,
    validator: (value) => value >= CURRENCY_CONSTRAINTS.MIN && Number.isFinite(value)
  },
  globalAmount: {
    min: CURRENCY_CONSTRAINTS.MIN,
    step: CURRENCY_CONSTRAINTS.STEP,
    validator: (value) => value >= CURRENCY_CONSTRAINTS.MIN && Number.isFinite(value)
  },
  dictatedHours: {
    min: WEEKLY_HOURS_CONSTRAINTS.MIN,
    max: WEEKLY_HOURS_CONSTRAINTS.MAX,
    step: WEEKLY_HOURS_CONSTRAINTS.STEP,
    validator: (value) => 
      value >= WEEKLY_HOURS_CONSTRAINTS.MIN && 
      value <= WEEKLY_HOURS_CONSTRAINTS.MAX && 
      Number.isFinite(value)
  }
};

export default function AddLocationForm({ isOpen, onClose, onSubmit, cities, companies, initialData }: AddLocationFormProps) {
  const [formData, setFormData] = useState<LocationFormData>(() => ({
    street: initialData?.street || '',
    streetNumber: initialData?.streetNumber || '',
    cityCode: initialData?.cityCode || '',
    managementCompanyCode: initialData?.managementCompany?.code || '',
    calculationType: initialData?.calculationType || CalculationType.HOURLY,
    weekDays: initialData?.workDays?.map(d => d.dayName) || [],
    dayHours: initialData?.workDays?.map(d => ({
      dayId: d.dayName,
      hours: d.hours || 0
    })) || [],
    hourlyRate: '',
    globalAmount: '',
    dictatedHours: ''
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      const newFormData: LocationFormData = {
        ...DEFAULT_FORM_DATA,
        street: initialData.street,
        streetNumber: initialData.streetNumber,
        cityCode: initialData.cityCode,
        managementCompanyCode: initialData.managementCompany?.code || '',
        calculationType: initialData.calculationType,
        weekDays: initialData.workDays.map(wd => wd.dayName),
        dayHours: initialData.workDays
          .filter((wd): wd is Required<WorkDay> => wd.hours !== undefined)
          .map(wd => ({
            dayId: wd.dayName,
            hours: wd.hours
          }))
      };

      switch (initialData.calculationType) {
        case CalculationType.HOURLY:
          newFormData.hourlyRate = (initialData as HourlyLocation).hourlyRate.toString();
          break;
        case CalculationType.GLOBAL:
          newFormData.globalAmount = (initialData as GlobalLocation).globalAmount.toString();
          break;
        case CalculationType.DICTATED:
          newFormData.dictatedHours = (initialData as DictatedLocation).dictatedHours.toString();
          break;
      }

      setFormData(newFormData);
      setErrors({});
    } else {
      resetForm();
    }
  }, [initialData]);

  useEffect(() => {
    // בדיקת תקינות החברות בעת טעינת הקומפוננטה
    if (companies.length > 0) {
      const invalidCompanies = companies.filter(c => !c.code || !c.name);
      if (invalidCompanies.length > 0) {
        console.error('נמצאו חברות לא תקינות:', invalidCompanies);
      }
    }
  }, [companies]);

  const resetForm = () => {
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // ולידציה בסיסית
    if (!formData.street.trim()) {
      newErrors.street = 'יש להזין רחוב';
    }
    if (!formData.streetNumber.trim()) {
      newErrors.streetNumber = 'יש להזין מספר רחוב';
    }
    if (!formData.cityCode) {
      newErrors.cityCode = 'יש לבחור עיר';
    }
    if (formData.weekDays.length === 0) {
      newErrors.weekDays = 'יש לבחור לפחות יום אחד';
    }

    // ולידציה לפי סוג החישוב
    switch (formData.calculationType) {
      case CalculationType.HOURLY: {
        const hourlyRate = Number(formData.hourlyRate);
        if (!numericFieldsConfig.hourlyRate.validator(hourlyRate)) {
          newErrors.hourlyRate = 'יש להזין תעריף שעתי חוקי';
        }
        
        const hasInvalidHours = formData.dayHours.some(
          dh => !validateHours(dh.hours)
        );
        if (hasInvalidHours) {
          newErrors.dayHours = `יש להזין מספר שעות תקין (${HOURS_CONSTRAINTS.MIN}-${HOURS_CONSTRAINTS.MAX}) לכל יום עבודה`;
        }
        break;
      }
      case CalculationType.GLOBAL: {
        const globalAmount = Number(formData.globalAmount);
        if (!numericFieldsConfig.globalAmount.validator(globalAmount)) {
          newErrors.globalAmount = 'יש להזין סכום גלובלי חוקי';
        }
        break;
      }
      case CalculationType.DICTATED: {
        const dictatedHours = Number(formData.dictatedHours);
        if (!numericFieldsConfig.dictatedHours.validator(dictatedHours)) {
          newErrors.dictatedHours = `יש להזין מספר שעות חוקי (${WEEKLY_HOURS_CONSTRAINTS.MIN}-${WEEKLY_HOURS_CONSTRAINTS.MAX})`;
        }
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || !validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      resetForm();
      onClose();
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'שגיאה בשמירת הנתונים'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // עדכון הטיפול בשעות ליום ספציפי
  const handleHoursChange = (dayId: DayName, value: string) => {
    const hours = Number(value);
    
    if (isNaN(hours) || hours < HOURS_CONSTRAINTS.MIN || hours > HOURS_CONSTRAINTS.MAX) {
      setErrors(prev => ({
        ...prev,
        dayHours: `מספר השעות חייב להיות בין ${HOURS_CONSTRAINTS.MIN} ל-${HOURS_CONSTRAINTS.MAX}`
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      dayHours: [
        ...(prev.dayHours?.filter(dh => dh.dayId !== dayId) || []),
        { dayId, hours }
      ].sort((a, b) => DAYS.findIndex(d => d.id === a.dayId) - DAYS.findIndex(d => d.id === b.dayId))
    }));

    // ניקוי שגיאה אם קיימת
    setErrors(prev => {
      const { dayHours, ...rest } = prev;
      return rest;
    });
  };

  // עדכון הטיפול בבחירת יום
  const handleDayToggle = (dayId: DayName) => {
    setFormData(prev => {
      const isSelected = prev.weekDays.includes(dayId);
      
      let newDayHours = prev.dayHours || [];
      if (!isSelected) {
        if (prev.calculationType === CalculationType.HOURLY) {
          const existingHours = prev.dayHours?.find(dh => dh.dayId === dayId)?.hours || 0;
          newDayHours = [
            ...newDayHours,
            { dayId, hours: existingHours }
          ].sort((a, b) => {
            const dayOrder = DAYS.findIndex(d => d.id === a.dayId) - DAYS.findIndex(d => d.id === b.dayId);
            return dayOrder;
          });
        }
      } else {
        newDayHours = newDayHours.filter(dh => dh.dayId !== dayId);
      }
      
      return {
        ...prev,
        weekDays: isSelected
          ? prev.weekDays.filter(d => d !== dayId)
          : [...prev.weekDays, dayId].sort((a, b) => {
              const dayOrder = DAYS.findIndex(d => d.id === a) - DAYS.findIndex(d => d.id === b);
              return dayOrder;
            }),
        dayHours: newDayHours
      };
    });
  };

  // עדכון פונקציית handleInputChange להיות יותר ספציפית
  const handleNumericInput = (name: string, value: string) => {
    const numValue = value === '' ? null : Number(value);
    
    if (numValue === null) {
      setFormData(prev => ({ ...prev, [name]: '' }));
      return;
    }

    if (isNaN(numValue)) {
      return;
    }

    const config = numericFieldsConfig[name];
    if (!config || !config.validator(numValue)) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'managementCompanyCode') {
      console.log('Selected management company code:', value);
      // בדיקה שהחברה שנבחרה קיימת
      const selectedCompany = companies.find(c => c.code === value);
      if (value && !selectedCompany) {
        console.error('נבחרה חברה לא קיימת:', value);
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // הוספת פונקציית עזר לבדיקת תקינות שעות
  const validateHours = (hours: number): boolean => {
    return Number.isFinite(hours) && 
           hours >= HOURS_CONSTRAINTS.MIN && 
           hours <= HOURS_CONSTRAINTS.MAX;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>
          {initialData ? 'עריכת מיקום' : 'הוספת מיקום חדש'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className={`${styles.formGroup} ${errors.managementCompanyCode ? styles.hasError : ''}`}>
            <label htmlFor="managementCompany">חברת ניהול (managementCompany)</label>
            <select
              id="managementCompany"
              name="managementCompanyCode"
              value={formData.managementCompanyCode}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option key="empty" value="">בחר חברת ניהול</option>
              {companies.map(company => (
                <option key={company.code} value={company.code}>
                  {company.name} ({company.code})
                </option>
              ))}
            </select>
            {errors.managementCompanyCode && (
              <div className={styles.error}>{errors.managementCompanyCode}</div>
            )}
          </div>

          <div className={`${styles.formGroup} ${errors.street ? styles.hasError : ''}`}>
            <label>רחוב</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              required
            />
            {errors.street && (
              <div className={styles.error}>{errors.street}</div>
            )}
          </div>

          <div className={`${styles.formGroup} ${errors.streetNumber ? styles.hasError : ''}`}>
            <label>מספר</label>
            <input
              type="text"
              name="streetNumber"
              value={formData.streetNumber}
              onChange={handleInputChange}
              required
            />
            {errors.streetNumber && (
              <div className={styles.error}>{errors.streetNumber}</div>
            )}
          </div>

          <div className={`${styles.formGroup} ${errors.cityCode ? styles.hasError : ''}`}>
            <label>עיר</label>
            <select
              name="cityCode"
              value={formData.cityCode}
              onChange={handleInputChange}
              required
            >
              <option value="">בחר עיר</option>
              {cities.map(city => (
                <option key={city.code} value={city.code}>
                  {city.name} ({city.code})
                </option>
              ))}
            </select>
            {errors.cityCode && (
              <div className={styles.error}>{errors.cityCode}</div>
            )}
          </div>

          <div className={`${styles.formGroup} ${errors.calculationType ? styles.hasError : ''}`}>
            <label>סוג חישוב</label>
            <select
              name="calculationType"
              value={formData.calculationType}
              onChange={handleInputChange}
              required
            >
              <option value={CalculationType.HOURLY}>חישוב שעתי</option>
              <option value={CalculationType.GLOBAL}>חישוב גלובלי</option>
              <option value={CalculationType.DICTATED}>חישוב מוכתב</option>
            </select>
            {errors.calculationType && (
              <div className={styles.error}>{errors.calculationType}</div>
            )}
          </div>

          <div className={`${styles.formGroup} ${errors.weekDays ? styles.hasError : ''}`}>
            <label>ימי עבודה</label>
            <div className={styles.daysTable}>
              <table>
                <thead>
                  <tr>
                    <th>יום</th>
                    <th>בחירה</th>
                    {formData.calculationType === CalculationType.HOURLY && (
                      <th>שעות</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map(day => (
                    <tr key={day.id}>
                      <td>{day.label}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={formData.weekDays.includes(day.id)}
                          onChange={() => handleDayToggle(day.id)}
                        />
                      </td>
                      {formData.calculationType === CalculationType.HOURLY && (
                        <td>
                          {formData.weekDays.includes(day.id) && (
                            <input
                              type="number"
                              min="0"
                              max="24"
                              step="0.5"
                              value={formData.dayHours?.find(dh => dh.dayId === day.id)?.hours || ''}
                              onChange={e => handleHoursChange(day.id, e.target.value)}
                              required
                            />
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {errors.weekDays && (
              <div className={styles.error}>{errors.weekDays}</div>
            )}
          </div>

          {formData.calculationType === CalculationType.HOURLY && (
            <div className={`${styles.formGroup} ${errors.hourlyRate ? styles.hasError : ''}`}>
              <label>תעריף לשעה</label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                min={CURRENCY_CONSTRAINTS.MIN}
                step={CURRENCY_CONSTRAINTS.STEP}
                required
              />
              {errors.hourlyRate && (
                <div className={styles.error}>{errors.hourlyRate}</div>
              )}
            </div>
          )}

          {formData.calculationType === CalculationType.GLOBAL && (
            <div className={`${styles.formGroup} ${errors.globalAmount ? styles.hasError : ''}`}>
              <label>סכום גלובלי</label>
              <input
                type="number"
                name="globalAmount"
                value={formData.globalAmount}
                onChange={handleInputChange}
                min={CURRENCY_CONSTRAINTS.MIN}
                step={CURRENCY_CONSTRAINTS.STEP}
                required
              />
              {errors.globalAmount && (
                <div className={styles.error}>{errors.globalAmount}</div>
              )}
            </div>
          )}

          {formData.calculationType === CalculationType.DICTATED && (
            <div className={`${styles.formGroup} ${errors.dictatedHours ? styles.hasError : ''}`}>
              <label>מספר שעות מוכתב</label>
              <input
                type="number"
                name="dictatedHours"
                value={formData.dictatedHours}
                onChange={handleInputChange}
                min={WEEKLY_HOURS_CONSTRAINTS.MIN}
                max={WEEKLY_HOURS_CONSTRAINTS.MAX}
                step={WEEKLY_HOURS_CONSTRAINTS.STEP}
                required
              />
              {errors.dictatedHours && (
                <div className={styles.error}>{errors.dictatedHours}</div>
              )}
            </div>
          )}

          {errors.submit && (
            <div className={`${styles.formGroup} ${styles.hasError}`}>
              <div className={styles.error}>{errors.submit}</div>
            </div>
          )}

          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'שומר...' : (initialData ? 'עדכן' : 'הוסף')}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isSubmitting) {
                  resetForm();
                  onClose();
                }
              }}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 