import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AddLocationForm from "../components/AddLocationForm/AddLocationForm";
import { generateLocationCode, formatCurrency, isHourlyLocation, isGlobalLocation, isDictatedLocation, isValidLocationCode } from "../utils/locationUtils";
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
  WorkDay,
  DayName,
  LocationFormData,
  ManagementCompany
} from "../types/location.types";
import { Company } from '../types/company.types';
import styles from './LocationsPage.module.css';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// פונקציית עזר להמרת ימים לעברית
const daysMap: { [key in DayName]: string } = {
  [DayName.SUNDAY]: 'ראשון',
  [DayName.MONDAY]: 'שני',
  [DayName.TUESDAY]: 'שלישי',
  [DayName.WEDNESDAY]: 'רביעי',
  [DayName.THURSDAY]: 'חמישי',
  [DayName.FRIDAY]: 'שישי',
  [DayName.SATURDAY]: 'שבת'
};

interface WorkDayDisplay {
  dayName: string;
  hours?: number;
}

const formatWorkDays = (workDays: WorkDay[] | undefined, calculationType: CalculationType) => {
  if (!workDays || !Array.isArray(workDays)) return '';

  const isHourly = calculationType === CalculationType.HOURLY;
  return workDays.map(day => ({
    dayName: daysMap[day.dayName],
    hours: isHourly ? day.hours : undefined
  }));
};

// הוספת פונקציית המרה
const convertToCompanyArray = (managementCompanies: ManagementCompany[]): Company[] => {
  return managementCompanies.map(mc => ({
    ...mc,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
};

interface LocationRow {
  id: string;
  code: string;
  street: string;
  streetNumber: string;
  city: string;
  cityCode: string;
  calculationType: CalculationType;
  workDays: WorkDay[];
  managementCompany?: ManagementCompany;
  hourlyRate?: number;
  globalAmount?: number;
  dictatedHours?: number;
}

const generateUniqueLocationCode = (existingLocations: Location[]): string => {
  try {
    // המרת כל הקודים הקיימים למערך של מספרים
    const existingCodes = existingLocations
      .map(loc => {
        // וידוא שהקוד הוא מספרי ובן 4 ספרות
        const code = loc.code?.toString().replace(/\D/g, ''); // להסיר תווים שאינם מספרים
        return code?.length === 4 ? parseInt(code) : null;
      })
      .filter((code): code is number => code !== null && !isNaN(code));

    // יצירת קוד חדש
    let newCode: number;
    do {
      // יצירת מספר רנדומלי בין 1000 ל-9999
      newCode = 1000 + Math.floor(Math.random() * 9000);
      
      // וידוא שהמספר הוא בן 4 ספרות
      if (newCode < 1000) newCode = 1000;
      if (newCode > 9999) newCode = 9999;
      
    } while (existingCodes.includes(newCode));

    // החזרת הקוד כמחרוזת עם אפסים מובילים
    return newCode.toString().padStart(4, '0');
  } catch (error) {
    console.error("❌ Error generating location code:", error);
    throw new Error("שגיאה ביצירת קוד מיקום");
  }
};

const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      console.log('Starting data load process...');
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching data from all services...');
      const [locationsData, citiesData, companiesData] = await Promise.all([
        getAllLocations(),
        getAllCities(),
        getAllCompanies()
      ]);
      console.log('Data fetched successfully:', {
        locationsCount: locationsData.length,
        citiesCount: citiesData.length,
        companiesCount: companiesData.length
      });

      const invalidCompanies = companiesData.filter(c => !c.code || c.code.length !== 4);
      if (invalidCompanies.length > 0) {
        console.warn('נמצאו חברות עם קוד לא תקין:', invalidCompanies);
      }

      setLocations(locationsData);
      setCities(citiesData);
      setCompanies(companiesData);
      console.log('State updated with new data');
    } catch (error) {
      console.error('Error in loadData:', error);
      setError('שגיאה בטעינת הנתונים');
    } finally {
      setIsLoading(false);
      console.log('Loading process completed');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (location: Location) => {
    try {
      console.log('Editing location:', location);
      
      if (!location.id) {
        throw new Error('מיקום ללא מזהה');
      }
      
      // יצירת אובייקט בסיס עם שדות משותפים
      const baseLocation = {
        id: location.id,
        code: location.code || '',
        street: location.street || '',
        streetNumber: location.streetNumber || '',
        cityCode: location.cityCode || '',
        city: location.city || '',
        calculationType: location.calculationType,
        workDays: Array.isArray(location.workDays) ? location.workDays : [],
        managementCompany: location.managementCompany
      };

      // הוספת שדות ספציפיים לפי סוג החישוב
      let defaultLocation: Location;
      
      switch (location.calculationType) {
        case CalculationType.HOURLY:
          defaultLocation = {
            ...baseLocation,
            calculationType: CalculationType.HOURLY,
            hourlyRate: (location as HourlyLocation).hourlyRate || 0
          } as HourlyLocation;
          break;
        
        case CalculationType.GLOBAL:
          defaultLocation = {
            ...baseLocation,
            calculationType: CalculationType.GLOBAL,
            globalAmount: (location as GlobalLocation).globalAmount || 0
          } as GlobalLocation;
          break;
        
        case CalculationType.DICTATED:
          defaultLocation = {
            ...baseLocation,
            calculationType: CalculationType.DICTATED,
            dictatedHours: (location as DictatedLocation).dictatedHours || 0
          } as DictatedLocation;
          break;
        
        default:
          throw new Error('סוג חישוב לא תקין');
      }

      console.log('Default location prepared:', defaultLocation);

      // המרה לפורמט הטופס
      const formData: LocationFormData = {
        street: defaultLocation.street,
        streetNumber: defaultLocation.streetNumber,
        cityCode: defaultLocation.cityCode,
        managementCompanyCode: defaultLocation.managementCompany?.code || '',
        calculationType: defaultLocation.calculationType,
        weekDays: defaultLocation.workDays.map(day => day.dayName),
        dayHours: defaultLocation.workDays.map(day => ({
          dayId: day.dayName,
          hours: day.hours || 0
        })),
        hourlyRate: isHourlyLocation(defaultLocation) ? defaultLocation.hourlyRate.toString() : '0',
        globalAmount: isGlobalLocation(defaultLocation) ? defaultLocation.globalAmount.toString() : '0',
        dictatedHours: isDictatedLocation(defaultLocation) ? defaultLocation.dictatedHours.toString() : '0'
      };

      console.log('Form data prepared:', formData);
      setSelectedLocation(defaultLocation);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error in handleEdit:', error);
      showErrorToast('שגיאה בטעינת נתוני המיקום');
    }
  };

  const handleSubmit = async (formData: LocationFormData) => {
    try {
      if (!formData) {
        throw new Error('לא התקבלו נתונים');
      }

      console.log('Form data received:', formData);
      console.log('Selected location:', selectedLocation);

      // מצא את החברה המנהלת לפי הקוד
      const selectedCompany = companies.find(c => c.code === formData.managementCompanyCode);
      const selectedCity = cities.find(c => c.code === formData.cityCode);

      // המרת הנתונים מהטופס למבנה של Location
      const baseLocationData = {
        street: formData.street,
        streetNumber: formData.streetNumber,
        cityCode: formData.cityCode,
        city: selectedCity?.name || '',
        calculationType: formData.calculationType,
        managementCompany: selectedCompany ? {
          code: selectedCompany.code,
          name: selectedCompany.name
        } : undefined,
        workDays: formData.dayHours.map(dh => ({
          dayName: dh.dayId,
          hours: dh.hours
        }))
      };

      console.log('Base location data:', baseLocationData);

      // יצירת אובייקט Location לפי סוג החישוב
      let locationData: Partial<Location>;
      switch (formData.calculationType) {
        case CalculationType.HOURLY:
          locationData = {
            ...baseLocationData,
            calculationType: CalculationType.HOURLY,
            hourlyRate: parseFloat(formData.hourlyRate || '0')
          } as Partial<HourlyLocation>;
          break;
        case CalculationType.GLOBAL:
          locationData = {
            ...baseLocationData,
            calculationType: CalculationType.GLOBAL,
            globalAmount: parseFloat(formData.globalAmount || '0')
          } as Partial<GlobalLocation>;
          break;
        case CalculationType.DICTATED:
          locationData = {
            ...baseLocationData,
            calculationType: CalculationType.DICTATED,
            dictatedHours: parseFloat(formData.dictatedHours || '0')
          } as Partial<DictatedLocation>;
          break;
        default:
          throw new Error('סוג חישוב לא תקין');
      }

      console.log('Final location data:', locationData);

      if (selectedLocation?.id) {
        // עדכון מיקום קיים
        console.log('Updating existing location with ID:', selectedLocation.id);
        console.log('Current location in state:', locations.find(loc => loc.id === selectedLocation.id));
        
        // שמירה על ה-ID והקוד המקוריים
        const updatedLocation = {
          ...locationData,
          id: selectedLocation.id,
          code: selectedLocation.code
        };
        
        console.log('Update data with preserved ID and code:', updatedLocation);
        
        await updateLocation(selectedLocation.id, updatedLocation);
        showSuccessToast('המיקום עודכן בהצלחה');
        
        // עדכון ה-state המקומי
        setLocations(prevLocations => 
          prevLocations.map(loc => 
            loc.id === selectedLocation.id 
              ? { ...loc, ...updatedLocation } as Location
              : loc
          )
        );
      } else {
        // יצירת מיקום חדש
        const newLocationCode = generateUniqueLocationCode(locations);
        
        // בדיקה שהקוד תקין
        if (!/^\d{4}$/.test(newLocationCode)) {
          throw new Error('נוצר קוד לא תקין');
        }

        console.log('New location code generated:', newLocationCode);

        const newLocation = {
          ...locationData,
          code: newLocationCode
        } as Location;
        
        const createdLocation = await createLocation(newLocation);
        showSuccessToast('המיקום נוצר בהצלחה');
        
        // עדכון ה-state המקומי
        setLocations(prevLocations => [...prevLocations, createdLocation]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      showErrorToast('שגיאה בשמירת המיקום');
    }
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (locationId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מיקום זה?')) {
      try {
        console.log('Starting deletion process for location:', locationId);
        await deleteLocation(locationId);
        console.log('Location deleted, showing success toast');
        showSuccessToast('המיקום נמחק בהצלחה');
        console.log('Updating local state...');
        setLocations(prevLocations => prevLocations.filter(loc => loc.id !== locationId));
        console.log('Local state updated successfully');
      } catch (error) {
        console.error('Error in handleDelete:', error);
        showErrorToast('שגיאה במחיקת המיקום');
      }
    }
  };

  const getCityFullName = (cityCode: string) => {
    const city = cities.find(c => c.code === cityCode);
    return city ? `${city.code} - ${city.name}` : cityCode;
  };

  // פונקציית עזר להצגת הודעת שגיאה
  const renderError = () => (
    <div className={styles.error}>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>נסה שוב</button>
    </div>
  );

  // פונקציית עזר להצגת אנימציית טעינה
  const renderLoading = () => (
    <div className={styles.loading}>
      <p>טוען מיקומים...</p>
    </div>
  );

  // פונקציית עזר להצגת הודעה כשאין מיקומים
  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <p>לא נמצאו מיקומים</p>
      <button onClick={() => setIsModalOpen(true)}>הוסף מיקום חדש</button>
    </div>
  );

  // פונקציה לעיבוד נתוני המיקום לפני הצגתם
  const processLocation = (location: Location): LocationRow => {
    if (!location || !location.code) {
      console.error('מיקום לא תקין:', location);
      throw new Error('מיקום לא תקין');
    }

    return {
      id: location.id || '',
      code: location.code,
      street: location.street,
      streetNumber: location.streetNumber,
      city: location.city,
      cityCode: location.cityCode,
      calculationType: location.calculationType,
      workDays: location.workDays || [],
      managementCompany: location.managementCompany,
      hourlyRate: location.calculationType === CalculationType.HOURLY 
        ? (location as HourlyLocation).hourlyRate 
        : undefined,
      globalAmount: location.calculationType === CalculationType.GLOBAL 
        ? (location as GlobalLocation).globalAmount 
        : undefined,
      dictatedHours: location.calculationType === CalculationType.DICTATED 
        ? (location as DictatedLocation).dictatedHours 
        : undefined
    };
  };

  // עדכון הרנדור של הטבלה
  const renderLocationRow = (location: Location) => {
    try {
      const processedLocation = processLocation(location);
      
      if (!processedLocation || !processedLocation.workDays) {
        console.error('קוד מיקום לא תקין:', location.code);
        return null;
      }

      return (
        <tr key={processedLocation.id || `location-${Math.random()}`}>
          <td>{processedLocation.code}</td>
          <td>{processedLocation.street} {processedLocation.streetNumber}</td>
          <td>{processedLocation.city}</td>
          <td>{processedLocation.managementCompany?.name || 'אין'}</td>
          <td>{processedLocation.calculationType}</td>
          <td>{processedLocation.workDays.map(day => daysMap[day.dayName]).join(', ')}</td>
          <td>
            <button 
              onClick={() => handleEdit(location)}
              className={styles.editButton}
            >
              ערוך
            </button>
            <button 
              onClick={() => handleDelete(processedLocation.id)}
              className={styles.deleteButton}
            >
              מחק
            </button>
          </td>
        </tr>
      );
    } catch (error) {
      console.error('שגיאה בעיבוד שורת מיקום:', error);
      return null;
    }
  };

  // הוספת פונקציית עזר לחישוב סה"כ שעות למיקום שעתי
  const calculateTotalHours = (location: HourlyLocation): number => {
    return location.workDays.reduce((total, day) => total + (day.hours || 0), 0);
  };

  // הוספת פונקציית עזר לחישוב סה"כ עלות למיקום שעתי
  const calculateTotalCost = (location: HourlyLocation): number => {
    return calculateTotalHours(location) * location.hourlyRate;
  };

  // עדכון הרנדור של פרטי החישוב
  const renderCalculationDetails = (location: Location) => {
    if (isHourlyLocation(location)) {
      const totalHours = calculateTotalHours(location);
      const totalCost = calculateTotalCost(location);

      return (
        <div className={styles.calculationDetails}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailsColumn}>
              <div className={styles.columnHeader}>יום</div>
              {location.workDays.map(day => (
                <div key={day.dayName} className={styles.detailRow}>
                  {daysMap[day.dayName]}
                </div>
              ))}
              <div className={styles.totalRow}>סה"כ</div>
            </div>
            <div className={styles.detailsColumn}>
              <div className={styles.columnHeader}>שעות</div>
              {location.workDays.map(day => (
                <div key={day.dayName} className={styles.detailRow}>
                  {day.hours || 0}
                </div>
              ))}
              <div className={styles.totalRow}>{totalHours}</div>
            </div>
            <div className={styles.detailsColumn}>
              <div className={styles.columnHeader}>תעריף לשעה</div>
              <div className={styles.detailRow}>
                {formatCurrency(location.hourlyRate)}
              </div>
              <div className={styles.totalRow}>{formatCurrency(totalCost)}</div>
            </div>
          </div>
        </div>
      );
    }

    if (isGlobalLocation(location)) {
      return (
        <div className={styles.calculationDetails}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailsColumn}>
              <div className={styles.columnHeader}>סכום גלובלי</div>
              <div className={styles.detailRow}>
                {formatCurrency(location.globalAmount)}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isDictatedLocation(location)) {
      return (
        <div className={styles.calculationDetails}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailsColumn}>
              <div className={styles.columnHeader}>שעות מוכתבות</div>
              <div className={styles.detailRow}>
                {location.dictatedHours} שעות
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // הוספת פונקציית getCalculationTypeDisplay
  const getCalculationTypeDisplay = (location: LocationRow): string => {
    switch (location.calculationType) {
      case CalculationType.HOURLY:
        return `שעתי - ${location.hourlyRate} ₪ לשעה`;
      case CalculationType.GLOBAL:
        return `גלובלי - ${location.globalAmount} ₪`;
      case CalculationType.DICTATED:
        return `מוכתב - ${location.dictatedHours} שעות`;
      default:
        return 'לא ידוע';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>ניהול מיקומים</h1>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
        >
          הוסף מיקום חדש
        </button>
      </div>

      {error && renderError()}
      {isLoading ? (
        renderLoading()
      ) : locations.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h2>טבלת ניהול מיקומים (locationsManagementTable)</h2>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>קוד (locationCode)</th>
                <th>כתובת (locationAddress)</th>
                <th>עיר (locationCity)</th>
                <th>חברת ניהול (managementCompany)</th>
                <th>סוג חישוב (calculationType)</th>
                <th>ימי עבודה (workDays)</th>
                <th>פעולות (actions)</th>
              </tr>
            </thead>
            <tbody>
              {locations.map(location => renderLocationRow(location))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <AddLocationForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={selectedLocation}
          cities={cities}
          companies={companies}
        />
      )}
    </div>
  );
};

export default LocationsPage;