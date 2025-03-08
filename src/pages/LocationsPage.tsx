import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AddLocationForm from "../components/AddLocationForm/AddLocationForm";
import { generateUniqueLocationCode, formatCurrency } from "../utils/locationUtils";
import { getAllLocations, createLocation, deleteLocation, updateLocation } from "../services/LocationService";
import { getAllCities, City } from '../services/CitiesService';
import { getAllCompanies } from '../services/CompanyService';
import { 
  Location, 
  CalculationType, 
  CreateLocationDto, 
  HourlyLocation, 
  GlobalLocation, 
  DictatedLocation,
  WorkDay
} from "../types/location.types";
import styles from './LocationsPage.module.css';

// פונקציית עזר להמרת ימים לעברית
const daysMap: { [key: string]: string } = {
  'SUNDAY': 'ראשון',
  'MONDAY': 'שני',
  'TUESDAY': 'שלישי',
  'WEDNESDAY': 'רביעי',
  'THURSDAY': 'חמישי',
  'FRIDAY': 'שישי',
  'SATURDAY': 'שבת'
};

interface WorkDayDisplay {
  dayName: string;
  hours?: number;
}

const formatWorkDays = (workDays: WorkDay[] | undefined, calculationType: CalculationType) => {
  if (!workDays || !Array.isArray(workDays)) return '';

  const isHourly = calculationType === CalculationType.HOURLY;

  return (
    `<div class="workdays-grid">
      <div class="workdays-headers ${isHourly ? 'two-columns' : 'one-column'}">
        <div class="days-header">
          <span>ימים</span>
        </div>
        ${isHourly ? `
        <div class="hours-header">
          <span>כמות שעות</span>
        </div>
        ` : ''}
      </div>
      <div class="workdays-content ${isHourly ? 'two-columns' : 'one-column'}">
        <div class="days-column">
          <div class="column-title"></div>
          ${workDays.map(workDay => 
            `<div class="day-row">${daysMap[workDay.dayName] || workDay.dayName}</div>`
          ).join('')}
        </div>
        ${isHourly ? `
        <div class="hours-column">
          <div class="column-title"></div>
          ${workDays.map(workDay => 
            `<div class="hours-row">${workDay.hours || 0}</div>`
          ).join('')}
        </div>
        ` : ''}
      </div>
    </div>`
  );
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // טעינת נתונים התחלתית
  useEffect(() => {
    loadLocations();
    loadCities();
    loadCompanies();
  }, []);

  // טעינת רשימת המיקומים
  const loadLocations = async () => {
    try {
      const locs = await getAllLocations();
      setLocations(locs);
    } catch (error) {
      console.error("❌ Failed to load locations:", error);
      toast.error("❌ שגיאה בטעינת המיקומים");
    }
  };

  // טעינת רשימת הערים
  const loadCities = async () => {
    try {
      const citiesData = await getAllCities();
      setCities(citiesData);
    } catch (error) {
      console.error('Error loading cities:', error);
      toast.error("❌ שגיאה בטעינת רשימת הערים");
    }
  };

  // טעינת רשימת החברות
  const loadCompanies = async () => {
    try {
      const companiesData = await getAllCompanies();
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error("❌ שגיאה בטעינת רשימת החברות");
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setIsAddFormOpen(true);
  };

  const handleSubmit = async (formData: any) => {
    if (editingLocation) {
      await handleUpdate(formData);
    } else {
      await handleAddLocation(formData);
    }
  };

  const handleUpdate = async (formData: any) => {
    if (!editingLocation) return;

    try {
      const selectedCity = cities.find(c => c.code === formData.cityCode);
      const selectedCompany = companies.find(c => c.code === formData.managementCompanyCode);
      
      if (!selectedCity) {
        throw new Error("City not found");
      }

      const workDays = formData.weekDays.map((dayName: string) => ({
        dayName,
        hours: formData.calculationType === CalculationType.HOURLY 
          ? Number(formData.dayHours?.find((dh: { dayId: string; hours: number }) => dh.dayId === dayName)?.hours || 0)
          : 0
      }));

      const locationData: CreateLocationDto = {
        street: formData.street,
        streetNumber: formData.streetNumber,
        city: selectedCity.name,
        cityCode: selectedCity.code,
        managementCompany: selectedCompany ? {
          code: selectedCompany.code,
          name: selectedCompany.name
        } : undefined,
        calculationType: formData.calculationType as CalculationType,
        workDays,
        hourlyRate: formData.calculationType === CalculationType.HOURLY ? Number(formData.hourlyRate) : undefined,
        globalAmount: formData.calculationType === CalculationType.GLOBAL ? Number(formData.globalAmount) : undefined
      };

      await updateLocation(editingLocation.code, locationData);
      await loadLocations();
      setEditingLocation(null);
      setIsAddFormOpen(false);
      toast.success("✅ המיקום עודכן בהצלחה");
    } catch (error) {
      console.error("❌ Failed to update location:", error);
      toast.error("❌ שגיאה בעדכון המיקום");
    }
  };

  const handleAddLocation = async (formData: any) => {
    try {
      const selectedCity = cities.find(c => c.code === formData.cityCode);
      const selectedCompany = companies.find(c => c.code === formData.managementCompanyCode);
      
      if (!selectedCity) {
        throw new Error("City not found");
      }

      if (!formData.weekDays || !Array.isArray(formData.weekDays) || formData.weekDays.length === 0) {
        toast.error("❌ יש לבחור לפחות יום אחד");
        return;
      }

      const workDays = formData.weekDays.map((dayName: string) => ({
        dayName,
        hours: formData.calculationType === CalculationType.HOURLY 
          ? Number(formData.dayHours?.find((dh: { dayId: string; hours: number }) => dh.dayId === dayName)?.hours || 0)
          : 0
      }));

      const locationData: CreateLocationDto = {
        street: formData.street,
        streetNumber: formData.streetNumber,
        city: selectedCity.name,
        cityCode: selectedCity.code,
        managementCompany: selectedCompany ? {
          code: selectedCompany.code,
          name: selectedCompany.name
        } : undefined,
        calculationType: formData.calculationType as CalculationType,
        workDays,
        hourlyRate: formData.calculationType === CalculationType.HOURLY ? Number(formData.hourlyRate) : undefined,
        globalAmount: formData.calculationType === CalculationType.GLOBAL ? Number(formData.globalAmount) : undefined
      };

      await createLocation(locationData);
      await loadLocations();
      setIsAddFormOpen(false);
      toast.success("✅ המיקום נוסף בהצלחה");
    } catch (error) {
      console.error("❌ Failed to add location:", error);
      toast.error("❌ שגיאה בהוספת המיקום");
    }
  };

  const handleDelete = async (code: string) => {
    if (confirm(`האם אתה בטוח שברצונך למחוק את המיקום עם קוד ${code}?`)) {
      try {
        const success = await deleteLocation(code);
        if (success) {
          await loadLocations();
          toast.success("✅ המיקום נמחק בהצלחה");
        } else {
          toast.error("❌ המיקום לא נמצא");
        }
      } catch (error) {
        console.error("❌ Failed to delete location:", error);
        toast.error("❌ שגיאה במחיקת המיקום");
      }
    }
  };

  const getCityFullName = (cityCode: string) => {
    const city = cities.find(c => c.code === cityCode);
    return city ? `${city.code} - ${city.name}` : cityCode;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          ניהול מיקומים
        </h1>
        <button onClick={() => setIsAddFormOpen(true)} className={styles.addButton}>
          הוסף מיקום חדש
        </button>
      </header>

      <div className={styles.tableContainer}>
        <div className={styles.tableTitle}>
          <h2>טבלת מיקומים (locationsDataTable)</h2>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable} data-variable-name="locationsDataTable">
            <thead>
              <tr>
                <th>קוד מיקום (locationCode)</th>
                <th>רחוב (locationStreet)</th>
                <th>מספר רחוב (streetNumber)</th>
                <th>עיר (cityName)</th>
                <th>ימי עבודה (workDays)</th>
                <th>סוג חישוב (calculationType)</th>
                <th>פרטי חישוב (paymentDetails)</th>
                <th>חברת ניהול (managementCompany)</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.code}>
                  <td>{loc.code}</td>
                  <td>{loc.street}</td>
                  <td>{loc.streetNumber}</td>
                  <td>{getCityFullName(loc.cityCode)}</td>
                  <td dir="rtl" className={styles.workdaysCell}>
                    {loc.workDays.map(day => daysMap[day.dayName]).join(', ')}
                  </td>
                  <td>
                    {loc.calculationType === CalculationType.HOURLY ? 'חישוב שעתי' :
                     loc.calculationType === CalculationType.GLOBAL ? 'חישוב גלובלי' : 'חישוב מוכתב'}
                  </td>
                  <td className={styles.calculationDetailsCell}>
                    {loc.calculationType === CalculationType.HOURLY ? (
                      <div className={styles.calculationDetails}>
                        <div className={styles.detailsGrid}>
                          <div className={styles.detailsColumn}>
                            <div className={styles.columnHeader}>יום (dayNameColumn)</div>
                            {loc.workDays.map(day => (
                              <div key={day.dayName} className={styles.detailRow}>
                                {daysMap[day.dayName]}
                              </div>
                            ))}
                          </div>
                          <div className={styles.detailsColumn}>
                            <div className={styles.columnHeader}>שעות (dayHoursColumn)</div>
                            {loc.workDays.map(day => (
                              <div key={day.dayName} className={styles.detailRow}>
                                {day.hours}
                              </div>
                            ))}
                          </div>
                          <div className={styles.detailsColumn}>
                            <div className={styles.columnHeader}>תעריף לשעה (hourlyRateInput)</div>
                            <div className={styles.detailRow}>
                              {formatCurrency(loc.hourlyRate || 0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : loc.calculationType === CalculationType.GLOBAL ? (
                      <div className={styles.calculationDetails}>
                        <div className={styles.detailsGrid}>
                          <div className={styles.detailsColumn}>
                            <div className={styles.columnHeader}>סכום גלובלי (globalAmountInput)</div>
                            <div className={styles.detailRow}>
                              {formatCurrency(loc.globalAmount || 0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </td>
                  <td>{loc.managementCompany ? `${loc.managementCompany.name} (${loc.managementCompany.code})` : '-'}</td>
                  <td>
                    <div className={styles.actionsGroup}>
                      <button onClick={() => handleEdit(loc)} className={styles.editButton}>
                        ערוך
                      </button>
                      <button onClick={() => handleDelete(loc.code)} className={styles.deleteButton}>
                        מחק
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.emptyState}>
                    לא נמצאו מיקומים
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddFormOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <AddLocationForm
              isOpen={isAddFormOpen}
              cities={cities}
              companies={companies}
              onSubmit={handleSubmit}
              onClose={() => {
                setIsAddFormOpen(false);
                setEditingLocation(null);
              }}
              initialData={editingLocation}
            />
          </div>
        </div>
      )}
    </div>
  );
}
