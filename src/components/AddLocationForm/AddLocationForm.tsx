import React, { useState, useEffect } from 'react';
import { CalculationType, Location } from '../../types/location.types';
import './AddLocationForm.css';
import { City } from '../../services/CitiesService';
import { Company } from '../../types/models';

interface AddLocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  cities: City[];
  companies: Company[];
  initialData?: Location | null;
}

// ימי השבוע
const DAYS = [
  { id: 'SUNDAY', label: 'ראשון' },
  { id: 'MONDAY', label: 'שני' },
  { id: 'TUESDAY', label: 'שלישי' },
  { id: 'WEDNESDAY', label: 'רביעי' },
  { id: 'THURSDAY', label: 'חמישי' },
  { id: 'FRIDAY', label: 'שישי' },
  { id: 'SATURDAY', label: 'שבת' }
];

export default function AddLocationForm({ isOpen, onClose, onSubmit, cities, companies, initialData }: AddLocationFormProps) {
  // מצב התחלתי של הטופס
  const [formData, setFormData] = useState({
    street: '',
    streetNumber: '',
    cityCode: '',
    managementCompanyCode: '',
    calculationType: CalculationType.HOURLY as CalculationType,
    weekDays: [] as string[],
    dayHours: [] as { dayId: string; hours: number }[],
    hourlyRate: '',
    globalAmount: ''
  });

  // טעינת נתונים קיימים כשהטופס נפתח במצב עריכה
  useEffect(() => {
    if (initialData) {
      setFormData({
        street: initialData.street || '',
        streetNumber: initialData.streetNumber || '',
        cityCode: initialData.cityCode || '',
        managementCompanyCode: initialData.managementCompany?.code || '',
        calculationType: initialData.calculationType || CalculationType.HOURLY,
        weekDays: initialData.workDays?.map(wd => wd.dayName) || [],
        dayHours: initialData.workDays?.map(wd => ({
          dayId: wd.dayName,
          hours: wd.hours || 0
        })) || [],
        hourlyRate: initialData.calculationType === CalculationType.HOURLY ? 
          (initialData as any).hourlyRate?.toString() || '' : '',
        globalAmount: initialData.calculationType === CalculationType.GLOBAL ? 
          (initialData as any).globalAmount?.toString() || '' : ''
      });
    } else {
      resetForm();
    }
  }, [initialData]);

  // איפוס הטופס
  const resetForm = () => {
    setFormData({
      street: '',
      streetNumber: '',
      cityCode: '',
      managementCompanyCode: '',
      calculationType: CalculationType.HOURLY,
      weekDays: [],
      dayHours: [],
      hourlyRate: '',
      globalAmount: ''
    });
  };

  // שליחת הטופס
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // בדיקה שנבחר לפחות יום אחד
    if (formData.weekDays.length === 0) {
      alert('יש לבחור לפחות יום אחד');
      return;
    }

    onSubmit(formData);
    resetForm();
  };

  // עדכון שעות ליום ספציפי
  const handleHoursChange = (dayId: string, hours: number) => {
    setFormData(prev => ({
      ...prev,
      dayHours: [
        ...prev.dayHours.filter(dh => dh.dayId !== dayId),
        { dayId, hours }
      ].sort((a, b) => {
        const dayOrder = DAYS.findIndex(d => d.id === a.dayId) - DAYS.findIndex(d => d.id === b.dayId);
        return dayOrder;
      })
    }));
  };

  // טיפול בבחירת יום
  const handleDayToggle = (dayId: string) => {
    setFormData(prev => {
      const isSelected = prev.weekDays.includes(dayId);
      
      let newDayHours = prev.dayHours;
      if (!isSelected) {
        // כשמוסיפים יום, מוסיפים גם את השעות שלו (אם זה חישוב שעתי)
        if (prev.calculationType === CalculationType.HOURLY) {
          const existingHours = prev.dayHours.find(dh => dh.dayId === dayId)?.hours || 0;
          newDayHours = [
            ...prev.dayHours,
            { dayId, hours: existingHours }
          ].sort((a, b) => {
            const dayOrder = DAYS.findIndex(d => d.id === a.dayId) - DAYS.findIndex(d => d.id === b.dayId);
            return dayOrder;
          });
        }
      } else {
        // כשמסירים יום, מסירים גם את השעות שלו
        newDayHours = prev.dayHours.filter(dh => dh.dayId !== dayId);
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

  // טיפול בשינוי של שדה כלשהו
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {initialData ? 'עריכת מיקום' : 'הוספת מיקום חדש'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              בחר חברת ניהול
            </label>
            <select
              name="managementCompanyCode"
              value={formData.managementCompanyCode}
              onChange={handleInputChange}
              required
            >
              <option value="">בחר חברת ניהול</option>
              {companies.map(company => (
                <option key={company.code} value={company.code}>
                  {company.name} ({company.code})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              רחוב
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              מספר
            </label>
            <input
              type="text"
              name="streetNumber"
              value={formData.streetNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              עיר
            </label>
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
          </div>

          <div className="form-group">
            <label>
              סוג חישוב
            </label>
            <select
              name="calculationType"
              value={formData.calculationType}
              onChange={handleInputChange}
              required
            >
              <option value={CalculationType.HOURLY}>חישוב שעתי</option>
              <option value={CalculationType.GLOBAL}>חישוב גלובלי</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              ימי עבודה
            </label>
            <div className="days-table">
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
                              step="0.5"
                              value={formData.dayHours.find(dh => dh.dayId === day.id)?.hours || ''}
                              onChange={e => handleHoursChange(day.id, Number(e.target.value))}
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
          </div>

          {formData.calculationType === CalculationType.HOURLY && (
            <div className="form-group">
              <label>
                תעריף לשעה
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {formData.calculationType === CalculationType.GLOBAL && (
            <div className="form-group">
              <label>
                סכום גלובלי
              </label>
              <input
                type="number"
                name="globalAmount"
                value={formData.globalAmount}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
            >
              {initialData ? 'עדכן' : 'הוסף'}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="cancel-button"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          width: 95%;
          max-width: 800px;
          max-height: 85vh;
          overflow-y: auto;
          direction: rtl;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 1001;
        }

        .modal-title {
          text-align: center;
          margin-bottom: 2rem;
          color: #2d1f5b;
          font-size: 1.5rem;
          font-weight: 600;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #6c63ff;
          box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
        }

        .days-table {
          margin: 1.5rem 0;
          background: white;
          border-radius: 8px;
          overflow-x: auto;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .days-table table {
          width: 100%;
          min-width: 600px;
          border-collapse: collapse;
        }

        .days-table th,
        .days-table td {
          padding: 0.75rem;
          text-align: center;
          border: 1px solid #f0f0f0;
        }

        .days-table th {
          background: #f3f0ff;
          color: #2d1f5b;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .days-table tr:nth-child(even) {
          background: #fafafa;
        }

        .days-table tr:hover {
          background: #f5f5f5;
        }

        .days-table input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .days-table input[type="number"] {
          width: 70px;
          padding: 0.4rem;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          text-align: center;
          font-size: 0.9rem;
        }

        .days-table input[type="number"]:focus {
          outline: none;
          border-color: #6c63ff;
          box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f0f0f0;
        }

        .submit-button,
        .cancel-button {
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .submit-button {
          background: linear-gradient(135deg, #6c63ff 0%, #5a52d5 100%);
          color: white;
        }

        .submit-button:hover {
          background: linear-gradient(135deg, #5a52d5 0%, #4a43c5 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(108, 99, 255, 0.2);
        }

        .cancel-button {
          background: #f3f0ff;
          color: #6c63ff;
        }

        .cancel-button:hover {
          background: #e5e0ff;
          color: #5a52d5;
        }

        @media (max-width: 600px) {
          .modal-content {
            padding: 1.5rem;
            width: 100%;
            height: 100%;
            max-height: 100vh;
            border-radius: 0;
          }

          .form-group {
            padding: 0.75rem;
          }

          .submit-button,
          .cancel-button {
            width: 100%;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
} 