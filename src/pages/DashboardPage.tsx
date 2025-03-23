// src/pages/DashboardPage.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllLocations, createLocation, updateLocation, testConnection, ensureCollectionExists, deleteLocation } from '../services/LocationService';
import { Location, DayName, CalculationType, ManagementCompany, WorkDay, BaseLocation } from '../types/location.types';
import { formatCurrency } from '../utils/locationUtils';
import styles from './DashboardPage.module.css';
import { INCOME_TABLE_VARIABLES } from '../constants/variableNames';

// פונקציית עזר להמרת ימים לעברית
const daysMap: Record<DayName, string> = {
  [DayName.SUNDAY]: 'ראשון',
  [DayName.MONDAY]: 'שני',
  [DayName.TUESDAY]: 'שלישי',
  [DayName.WEDNESDAY]: 'רביעי',
  [DayName.THURSDAY]: 'חמישי',
  [DayName.FRIDAY]: 'שישי',
  [DayName.SATURDAY]: 'שבת'
};

interface MonthTab {
  id: string;
  label: string;
  date: Date;
}

// פונקציה ליצירת חודשים מהחודש הנוכחי ועד סוף 2025
const generateMonthTabs = (): MonthTab[] => {
  const tabs: MonthTab[] = [];
  const currentDate = new Date();
  const endDate = new Date(2025, 11); // דצמבר 2025

  let currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth());
  
  while (currentMonth <= endDate) {
    const monthStr = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
    const yearStr = currentMonth.getFullYear().toString();
    
    tabs.push({
      id: `${yearStr}-${monthStr}`,
      label: `${monthStr}-${yearStr}`,
      date: new Date(currentMonth)
    });
    
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }
  
  return tabs;
};

// נוסיף את הטיפוסים החסרים בראש הקובץ
interface EditableFields {
  managementCompany?: ManagementCompany;
  street?: string;
  streetNumber?: string;
  city?: string;
  workDays?: WorkDay[];
  calculationType?: CalculationType;
  hourlyRate?: number;
  globalAmount?: number;
}

// עדכון את EditableLocationData
interface EditableLocationData extends Omit<BaseLocation, 'id'> {
  id: string;
  isEditing?: boolean;
  hourlyRate?: number;
  globalAmount?: number;
  dictatedHours?: number;
}

interface MonthlyData {
  locations: EditableLocationData[];
  isModified: boolean;
  lastModified: Date;
}

interface MonthlyDataState {
  [key: string]: MonthlyData;
}

// נוסיף את הממשק להודעות
interface Notification {
  type: 'success' | 'error';
  message: string;
}

// נוסיף את הממשקים החדשים
interface SortConfig {
  column: keyof EditableLocationData | 'amount' | '';
  direction: 'asc' | 'desc';
}

interface Filters {
  search: string;
  minAmount: number;
  maxAmount: number;
}

// נוסיף ממשקים חדשים
interface UserSettings {
  display: {
    rowsPerPage: number;
    defaultSort: SortConfig;
    defaultFilters: Filters;
  };
  export: {
    dateFormat: string;
    customHeaders: {
      [key: string]: string;
    };
  };
}

// נוסיף קבועים
const USER_SETTINGS_KEY = 'userSettings';
const STORAGE_KEY = 'monthlyFinanceData';

// נוסיף פונקציות עזר
const getTotalHours = (workDays: WorkDay[]): number => {
  return workDays.reduce((total, day) => total + (day.hours || 0), 0);
};

const calculateAmount = (location: EditableLocationData): number => {
  if (!location) return 0;

  switch (location.calculationType) {
    case CalculationType.HOURLY:
      return (location.hourlyRate ?? 0) * getTotalHours(location.workDays);
    case CalculationType.GLOBAL:
      return location.globalAmount ?? 0;
    case CalculationType.DICTATED:
      return (location.hourlyRate ?? 0) * (location.dictatedHours ?? 0);
    default:
      return 0;
  }
};

const calculateSummary = (data: EditableLocationData[]) => {
  return {
    totalAmount: data.reduce((sum, location) => sum + calculateAmount(location), 0),
    totalLocations: data.length,
    byCalculationType: {
      hourly: data.filter(loc => loc.calculationType === CalculationType.HOURLY).length,
      global: data.filter(loc => loc.calculationType === CalculationType.GLOBAL).length
    },
    totalHours: data.reduce((sum, location) => 
      sum + location.workDays.reduce((daySum, day) => daySum + (day.hours || 0), 0), 
    0)
  };
};

const convertToLocationType = (data: EditableLocationData): Partial<Location> => {
  if (!data) return {};

  const baseData: Partial<Location> = {
    id: data.id,
    code: data.code,
    street: data.street,
    streetNumber: data.streetNumber,
    city: data.city,
    cityCode: data.cityCode,
    workDays: data.workDays,
    calculationType: data.calculationType,
    managementCompany: data.managementCompany
  };

  return baseData;
};

const saveToLocalStorage = (data: MonthlyDataState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

const loadFromLocalStorage = (): MonthlyDataState | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData) as MonthlyDataState;
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  return null;
};

const initialMonthData: MonthlyData = {
  locations: [],
  isModified: false,
  lastModified: new Date()
};

export default function DashboardPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedMonthId, setSelectedMonthId] = useState<string>('');
  const [monthTabs] = useState<MonthTab[]>(generateMonthTabs());
  const [monthlyData, setMonthlyData] = useState<MonthlyDataState>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: '', direction: 'asc' });
  const [filters, setFilters] = useState<Filters>({
    search: '',
    minAmount: 0,
    maxAmount: Infinity
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem(USER_SETTINGS_KEY);
    return savedSettings ? JSON.parse(savedSettings) : {
      display: {
        rowsPerPage: 10,
        defaultSort: { column: '', direction: 'asc' },
        defaultFilters: {
          search: '',
          minAmount: 0,
          maxAmount: Infinity
        }
      },
      export: {
        dateFormat: 'DD/MM/YYYY',
        customHeaders: {
          managementCompany: 'חברת ניהול',
          address: 'כתובת',
          workDays: 'ימי עבודה',
          paymentDetails: 'פרטי תשלום',
          amount: 'סכום לגבייה'
        }
      }
    };
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await testConnection();
        if (isConnected) {
          showNotification('success', 'מחובר בהצלחה ל-Firebase');
        } else {
          showNotification('error', 'בעיה בחיבור ל-Firebase');
        }
      } catch (error) {
        console.error('Connection test failed:', error);
        showNotification('error', 'שגיאה בבדיקת החיבור');
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await ensureCollectionExists();
        const isConnected = await testConnection();
        
        if (isConnected) {
          const locations = await getAllLocations();
          console.log('Initial locations loaded:', locations);
          setLocations(locations);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('error', 'שגיאה באתחול האפליקציה');
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const fetchedLocations = await getAllLocations();
        setLocations(fetchedLocations);
        
        if (fetchedLocations.length > 0 && monthTabs.length > 0) {
          const currentMonthId = monthTabs[0].id;
          setSelectedMonthId(currentMonthId);
          
          const editableLocations: EditableLocationData[] = fetchedLocations.map(loc => 
            convertLocationToEditable(loc)
          );

          setMonthlyData(prev => ({
            ...prev,
            [currentMonthId]: {
              locations: editableLocations,
              isModified: false,
              lastModified: new Date()
            }
          }));
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        showNotification('error', 'אירעה שגיאה בטעינת הנתונים');
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    try {
      if (locations.length > 0 && monthTabs.length > 0) {
        const savedData = loadFromLocalStorage();
        if (savedData) {
          setMonthlyData(savedData);
          const lastModifiedMonth = Object.entries(savedData)
            .reduce((latest, [monthId, data]) => {
              if (!latest || (data.lastModified && new Date(data.lastModified) > new Date(latest.lastModified!))) {
                return { monthId, lastModified: data.lastModified };
              }
              return latest;
            }, null as { monthId: string; lastModified: Date | undefined } | null);
          
          setSelectedMonthId(lastModifiedMonth?.monthId || monthTabs[0].id);
        } else {
          const currentMonthId = monthTabs[0].id;
          setSelectedMonthId(currentMonthId);
          setMonthlyData(prev => ({
            ...prev,
            [currentMonthId]: {
              locations: locations.map(convertLocationToEditable),
              isModified: false,
              lastModified: new Date()
            }
          }));
        }
      }
    } catch (error) {
      showNotification('error', 'אירעה שגיאה באתחול הדף');
      console.error('Error in useEffect:', error);
    }
  }, [locations, monthTabs]);

  const convertLocationToEditable = (location: Location): EditableLocationData => {
    const workDays: WorkDay[] = (location.workDays || []).map(day => ({
      dayName: day.dayName,
      hours: day.hours || 0
    }));

    const managementCompany: ManagementCompany | undefined = location.managementCompany ? {
      code: location.managementCompany.code,
      name: location.managementCompany.name
    } : undefined;

    const baseLocation: EditableLocationData = {
      id: location.id || '',
      code: location.code || '',
      street: location.street || '',
      streetNumber: location.streetNumber || '',
      city: location.city || '',
      cityCode: location.cityCode || '',
      workDays,
      isEditing: false,
      managementCompany,
      calculationType: location.calculationType,
      hourlyRate: 'hourlyRate' in location ? location.hourlyRate : 0,
      globalAmount: 'globalAmount' in location ? location.globalAmount : 0,
      dictatedHours: 'dictatedHours' in location ? location.dictatedHours : 0
    };

    return baseLocation;
  };

  // פונקציה להצגת פרטי התשלום
  const renderPaymentDetails = (location: EditableLocationData) => {
    if (location.calculationType === CalculationType.HOURLY) {
      return (
        <div>
          <div>תעריף לשעה: {formatCurrency(location.hourlyRate ?? 0)}</div>
          {location.workDays.map(day => (
            <div key={day.dayName}>
              {daysMap[day.dayName as DayName]}: {day.hours ?? 0} שעות
            </div>
          ))}
        </div>
      );
    } else if (location.calculationType === CalculationType.GLOBAL) {
      return <div>סכום גלובלי: {formatCurrency(location.globalAmount ?? 0)}</div>;
    }
    return null;
  };

  // פונקציה לטיפול בשינויים בטבלה
  const handleTableDataChange = (updatedLocations: EditableLocationData[]) => {
    if (!selectedMonthId) return;

    setMonthlyData(prev => ({
      ...prev,
      [selectedMonthId]: {
        locations: updatedLocations.map(loc => ({
          ...loc,
          isEditing: false
        })) as EditableLocationData[],
        isModified: true,
        lastModified: new Date()
      }
    }));
    setHasUnsavedChanges(true);
  };

  // עדכון את פונקציית handleSaveMonthChanges
  const handleSaveMonthChanges = async () => {
    if (!selectedMonthId || !monthlyData[selectedMonthId]) return;
    
    try {
      const currentLocations = monthlyData[selectedMonthId].locations;
      const validLocations = currentLocations.filter(location => location.id);
      
      await Promise.all(validLocations.map(location => 
        updateLocation(location.id, convertToLocationType(location))
      ));
      
      setMonthlyData(prev => ({
        ...prev,
        [selectedMonthId]: {
          locations: validLocations,
          isModified: false,
          lastModified: new Date()
        }
      }));
      
      setHasUnsavedChanges(false);
      showNotification('success', 'כל השינויים נשמרו בהצלחה');
    } catch (error) {
      console.error('Error saving changes:', error);
      showNotification('error', 'אירעה שגיאה בשמירת השינויים');
    }
  };

  // עדכון את פונקציית החלפת חודש
  const handleMonthChange = (newMonthId: string) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm('יש שינויים שלא נשמרו. האם ברצונך להמשיך?');
      if (!confirmChange) return;
    }

    if (!monthlyData[newMonthId]) {
      const previousMonthData = getPreviousMonthData(newMonthId);
      const initialLocations = previousMonthData?.locations || locations.map(loc => convertLocationToEditable(loc));
      
      setMonthlyData(prev => ({
        ...prev,
        [newMonthId]: {
          locations: initialLocations,
          isModified: false,
          lastModified: new Date()
        }
      }));
    }

    setSelectedMonthId(newMonthId);
    setHasUnsavedChanges(false);
  };

  // פונקציית עזר לקבלת נתוני החודש הקודם
  const getPreviousMonthData = (monthId: string): MonthlyData | null => {
    const [year, month] = monthId.split('-').map(Number);
    const previousDate = new Date(year, month - 2);
    const previousMonthId = `${previousDate.getFullYear()}-${(previousDate.getMonth() + 1).toString().padStart(2, '0')}`;
    
    return monthlyData[previousMonthId] || null;
  };

  // עדכון את פונקציית handleEdit
  const handleEdit = (locationId: string) => {
    if (!selectedMonthId || !locationId || !monthlyData[selectedMonthId]) return;

    setMonthlyData(prev => ({
      ...prev,
      [selectedMonthId]: {
        ...prev[selectedMonthId],
        isModified: true,
        lastModified: new Date(),
        locations: prev[selectedMonthId].locations.map(loc =>
          loc.id === locationId ? { ...loc, isEditing: true } : loc
        )
      }
    }));
  };

  // עדכון את פונקציית handleSaveEdit
  const handleSaveEdit = async (locationId: string, updatedFields: Partial<EditableLocationData>) => {
    if (!locationId || !selectedMonthId || !monthlyData[selectedMonthId]) return;
    
    try {
      const currentLocation = monthlyData[selectedMonthId].locations.find(loc => loc.id === locationId);
      if (!currentLocation) return;

      const updatedLocation: EditableLocationData = {
        ...currentLocation,
        ...updatedFields
      };

      const locationForUpdate = convertToLocationType(updatedLocation);
      await updateLocation(locationId, locationForUpdate);

      setMonthlyData(prev => ({
        ...prev,
        [selectedMonthId]: {
          ...prev[selectedMonthId],
          locations: prev[selectedMonthId].locations.map(loc =>
            loc.id === locationId ? updatedLocation : loc
          ),
          isModified: true,
          lastModified: new Date()
        }
      }));

      showNotification('success', 'המיקום עודכן בהצלחה');
    } catch (error) {
      console.error('Error updating location:', error);
      showNotification('error', 'אירעה שגיאה בעדכון המיקום');
    }
  };

  // עדכון את פונקציית filterAndSortData
  const filterAndSortData = useCallback((data: EditableLocationData[]) => {
    // וידוא שיש נתונים
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data
      .filter(location => {
        const amount = calculateAmount(location);
        const searchMatch = filters.search
          ? location.managementCompany?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
            `${location.street} ${location.streetNumber}, ${location.city}`.toLowerCase().includes(filters.search.toLowerCase())
          : true;
        const amountMatch = amount >= filters.minAmount && amount <= filters.maxAmount;
        return searchMatch && amountMatch;
      })
      .sort((a, b) => {
        if (sortConfig.column === 'amount') {
          const amountA = calculateAmount(a);
          const amountB = calculateAmount(b);
          return sortConfig.direction === 'asc' ? amountA - amountB : amountB - amountA;
        }
        return 0;
      });
  }, [filters, sortConfig]);

  // מזכרון לנתונים מסוננים
  const filteredData = useMemo(() => {
    if (!monthlyData[selectedMonthId]?.locations) return [];
    return filterAndSortData(monthlyData[selectedMonthId].locations);
  }, [monthlyData, selectedMonthId, filterAndSortData]);

  // מזכרון לסיכומים
  const summary = useMemo(() => {
    return calculateSummary(filteredData);
  }, [filteredData]);

  // עדכון את פונקציית renderIncomeSection
  const renderIncomeSection = () => {
    if (!monthlyData[selectedMonthId] || !monthlyData[selectedMonthId].locations) {
      return (
        <div className={styles.emptyState}>
          <p>אין נתונים זמינים לחודש זה</p>
        </div>
      );
    }

    return (
      <div className={styles.tableContainer}>
        <div className={styles.tableTitle}>
          <h2>טבלת ניהול הכנסות ({INCOME_TABLE_VARIABLES.TABLE})</h2>
        </div>
        <div className={styles.filtersWrapper}>
          {renderFilters()}
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.excelTable} data-testid={INCOME_TABLE_VARIABLES.TABLE}>
            <thead>
              <tr>
                <th colSpan={8} className={styles.sectionHeader}>הכנסות</th>
              </tr>
              <tr>
                <th data-testid={INCOME_TABLE_VARIABLES.MANAGEMENT_COMPANY}>
                  קוד חברת ניהול ({INCOME_TABLE_VARIABLES.MANAGEMENT_COMPANY})
                </th>
                <th onClick={() => handleSort('managementCompany')} className={styles.sortableHeader}>
                  שם חברת ניהול {renderSortIndicator('managementCompany')}
                </th>
                <th data-testid={INCOME_TABLE_VARIABLES.LOCATION_ADDRESS}>
                  רחוב ({INCOME_TABLE_VARIABLES.LOCATION_ADDRESS})
                </th>
                <th>
                  עיר ({INCOME_TABLE_VARIABLES.LOCATION_ADDRESS})
                </th>
                <th data-testid={INCOME_TABLE_VARIABLES.WORK_DAYS}>
                  ימי עבודה ({INCOME_TABLE_VARIABLES.WORK_DAYS})
                </th>
                <th data-testid={INCOME_TABLE_VARIABLES.PAYMENT_DETAILS}>
                  פרטי תשלום ({INCOME_TABLE_VARIABLES.PAYMENT_DETAILS})
                </th>
                <th onClick={() => handleSort('amount')} className={styles.sortableHeader} data-testid={INCOME_TABLE_VARIABLES.COLLECTION_AMOUNT}>
                  סכום לגבייה ({INCOME_TABLE_VARIABLES.COLLECTION_AMOUNT}) {renderSortIndicator('amount')}
                </th>
                <th data-testid={INCOME_TABLE_VARIABLES.ACTIONS}>
                  פעולות ({INCOME_TABLE_VARIABLES.ACTIONS})
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((location) => (
                <tr key={location.id}>
                  <td>{location.managementCompany?.code || 'לא הוגדר'}</td>
                  <td>{location.managementCompany?.name || 'לא הוגדר'}</td>
                  <td>{location.street}</td>
                  <td>{location.city}</td>
                  <td>{location.workDays.map(day => daysMap[day.dayName as DayName]).join(', ')}</td>
                  <td>{renderPaymentDetails(location)}</td>
                  <td>{formatCurrency(calculateAmount(location))}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button onClick={() => handleEdit(location.id)} className={styles.editButton}>ערוך</button>
                      <button onClick={() => handleDelete(location.id)} className={styles.deleteButton}>מחק</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.summaryRow} data-testid={INCOME_TABLE_VARIABLES.SUMMARY_ROW}>
                <td colSpan={4}>סיכום ({INCOME_TABLE_VARIABLES.SUMMARY_ROW})</td>
                <td data-testid={INCOME_TABLE_VARIABLES.TOTAL_HOURS}>
                  שעות סה״כ ({INCOME_TABLE_VARIABLES.TOTAL_HOURS}): {summary.totalHours}
                </td>
                <td data-testid={INCOME_TABLE_VARIABLES.CALCULATION_SUMMARY}>
                  סיכום חישוב ({INCOME_TABLE_VARIABLES.CALCULATION_SUMMARY}):<br/>
                  שעתי: {summary.byCalculationType.hourly}<br/>
                  גלובלי: {summary.byCalculationType.global}
                </td>
                <td data-testid={INCOME_TABLE_VARIABLES.TOTAL_AMOUNT}>
                  סה״כ ({INCOME_TABLE_VARIABLES.TOTAL_AMOUNT}): {formatCurrency(summary.totalAmount)}
                </td>
                <td data-testid={INCOME_TABLE_VARIABLES.TOTAL_LOCATIONS}>
                  מיקומים ({INCOME_TABLE_VARIABLES.TOTAL_LOCATIONS}): {summary.totalLocations}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  // נוסיף פונקציה לטיפול במיון
  const handleSort = (column: keyof EditableLocationData | 'amount') => {
    setSortConfig(prev => ({
      column: prev.column === column ? column : column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // נוסיף פונקציה להצגת אינדיקטור המיון
  const renderSortIndicator = (column: string) => {
    if (sortConfig.column !== column) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  // עדכן את renderTableRow
  const renderTableRow = (location: EditableLocationData) => {
    const amount = calculateAmount(location);
    
    if (location.isEditing) {
      return (
        <tr key={location.id} className={styles.editingRow}>
          <td>
            <input
              type="text"
              value={location.managementCompany?.code || ''}
              onChange={(e) => {
                const currentCompany = location.managementCompany || { code: '', name: '' };
                handleSaveEdit(location.id, {
                  managementCompany: {
                    ...currentCompany,
                    code: e.target.value
                  }
                });
              }}
              className={styles.editInput}
              placeholder="קוד חברת ניהול"
            />
          </td>
          <td>
            <input
              type="text"
              value={location.street}
              onChange={(e) => handleSaveEdit(location.id, {
                street: e.target.value
              })}
              className={styles.editInput}
              placeholder="רחוב"
            />
          </td>
          <td>
            <div className={styles.workDaysEdit}>
              {location.workDays.map((day, index) => (
                <div key={day.dayName} className={styles.workDayItem}>
                  {daysMap[day.dayName as DayName]}
                  <input
                    type="number"
                    value={day.hours || 0}
                    onChange={(e) => {
                      const newWorkDays = [...location.workDays];
                      newWorkDays[index] = {
                        ...day,
                        hours: parseInt(e.target.value) || 0
                      };
                      handleSaveEdit(location.id, {
                        workDays: newWorkDays
                      });
                    }}
                    className={styles.hoursInput}
                    min="0"
                  />
                </div>
              ))}
            </div>
          </td>
          <td>
            {location.calculationType === CalculationType.HOURLY ? (
              <input
                type="number"
                value={location.hourlyRate || 0}
                onChange={(e) => handleSaveEdit(location.id, {
                  hourlyRate: parseFloat(e.target.value) || 0
                })}
                className={styles.editInput}
                min="0"
              />
            ) : (
              <input
                type="number"
                value={location.globalAmount || 0}
                onChange={(e) => handleSaveEdit(location.id, {
                  globalAmount: parseFloat(e.target.value) || 0
                })}
                className={styles.editInput}
                min="0"
              />
            )}
          </td>
          <td>{formatCurrency(amount)}</td>
          <td>
            <button onClick={() => handleSaveEdit(location.id, location)}>שמור</button>
            <button onClick={() => handleCancelEdit(location.id)}>בטל</button>
          </td>
        </tr>
      );
    }

    return (
      <tr key={location.id}>
        <td>{location.managementCompany?.code || 'לא הוגדר'}</td>
        <td>{location.managementCompany?.name || 'לא הוגדר'}</td>
        <td>{location.street}</td>
        <td>{location.city}</td>
        <td>{location.workDays.map(day => daysMap[day.dayName as DayName]).join(', ')}</td>
        <td>{renderPaymentDetails(location)}</td>
        <td>{formatCurrency(calculateAmount(location))}</td>
        <td>
          <button onClick={() => handleEdit(location.id)}>ערוך</button>
          <button onClick={() => handleDelete(location.id)}>מחק</button>
        </td>
      </tr>
    );
  };

  // עדכן את פונקציית handleAddLocation
  const handleAddLocation = async () => {
    if (!selectedMonthId) {
      showNotification('error', 'יש לבחור חודש תחילה');
      return;
    }

    try {
      console.log('Starting location creation...');
      
      const newLocationData: Partial<Location> = {
        street: '',
        streetNumber: '',
        city: '',
        cityCode: '',
        workDays: [
          { dayName: DayName.SUNDAY, hours: 0 },
          { dayName: DayName.MONDAY, hours: 0 },
          { dayName: DayName.TUESDAY, hours: 0 },
          { dayName: DayName.WEDNESDAY, hours: 0 },
          { dayName: DayName.THURSDAY, hours: 0 },
          { dayName: DayName.FRIDAY, hours: 0 },
          { dayName: DayName.SATURDAY, hours: 0 }
        ],
        calculationType: CalculationType.HOURLY
      };

      console.log('Creating new location with data:', newLocationData);
      const newLocation = await createLocation(newLocationData);
      console.log('Location created:', newLocation);

      const editableLocation = convertLocationToEditable(newLocation);
      editableLocation.isEditing = true;

      console.log('Updating state with new location:', editableLocation);
      setMonthlyData(prev => ({
        ...prev,
        [selectedMonthId]: {
          locations: [...(prev[selectedMonthId]?.locations || []), editableLocation],
          isModified: true,
          lastModified: new Date()
        }
      }));
      
      setHasUnsavedChanges(true);
      showNotification('success', 'נוסף מיקום חדש');
      
      const updatedLocations = await getAllLocations();
      setLocations(updatedLocations);
      
    } catch (err) {
      console.error('Error in handleAddLocation:', err);
      const error = err as Error;
      showNotification('error', `שגיאה בהוספת המיקום: ${error.message}`);
    }
  };

  // עדכן את פונקציית showNotification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    
    // מסיר את ההודעה אחרי 3 שניות
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // עדכן את פונקציית saveUserSettings
  const saveUserSettings = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = {
      ...userSettings,
      ...newSettings
    };
    setUserSettings(updatedSettings);
    localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(updatedSettings));
    showNotification('success', 'ההגדרות נשמרו בהצלחה');
  };

  // עדכן את קומפוננטת SettingsModal
  const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [tempSettings, setTempSettings] = useState(userSettings);

    const handleSave = () => {
      saveUserSettings(tempSettings);
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2>הגדרות</h2>
          
          <div className={styles.settingsSection}>
            <h3>הגדרות תצוגה</h3>
            <div className={styles.settingItem}>
              <label>מספר שורות בטבלה:</label>
              <input
                type="number"
                value={tempSettings.display.rowsPerPage}
                onChange={(e) => setTempSettings(prev => ({
                  ...prev,
                  display: {
                    ...prev.display,
                    rowsPerPage: Number(e.target.value)
                  }
                }))}
                min="5"
                max="50"
              />
            </div>
          </div>

          <div className={styles.settingsSection}>
            <h3>הגדרות ייצוא</h3>
            <div className={styles.settingItem}>
              <label>פורמט תאריך:</label>
              <select
                value={tempSettings.export.dateFormat}
                onChange={(e) => setTempSettings(prev => ({
                  ...prev,
                  export: {
                    ...prev.export,
                    dateFormat: e.target.value
                  }
                }))}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            
            <div className={styles.settingItem}>
              <h4>כותרות מותאמות אישית:</h4>
              {Object.entries(tempSettings.export.customHeaders).map(([key, value]) => (
                <div key={key} className={styles.headerInput}>
                  <label>{key}:</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setTempSettings(prev => ({
                      ...prev,
                      export: {
                        ...prev.export,
                        customHeaders: {
                          ...prev.export.customHeaders,
                          [key]: e.target.value
                        }
                      }
                    }))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.modalButtons}>
            <button onClick={handleSave} className={styles.saveButton}>
              שמור הגדרות
            </button>
            <button onClick={onClose} className={styles.cancelButton}>
              ביטול
            </button>
          </div>
        </div>
      </div>
    );
  };

  // עדכן את ה-render של הטבלה
  const renderFilters = () => (
    <div className={styles.filtersContainer}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          placeholder="חיפוש לפי חברת ניהול או כתובת..."
          className={styles.searchInput}
        />
      </div>
      <div className={styles.amountFilters}>
        <input
          type="number"
          value={filters.minAmount || ''}
          onChange={(e) => setFilters(prev => ({ 
            ...prev, 
            minAmount: e.target.value ? Number(e.target.value) : 0 
          }))}
          placeholder="סכום מינימלי"
          className={styles.amountInput}
        />
        <span>עד</span>
        <input
          type="number"
          value={filters.maxAmount === Infinity ? '' : filters.maxAmount}
          onChange={(e) => setFilters(prev => ({ 
            ...prev, 
            maxAmount: e.target.value ? Number(e.target.value) : Infinity 
          }))}
          placeholder="סכום מקסימלי"
          className={styles.amountInput}
        />
      </div>
    </div>
  );

  // עדכון את פונקציית exportMonthData
  const exportMonthData = (monthId: string) => {
    const monthData = monthlyData[monthId];
    if (!monthData) {
      showNotification('error', 'לא נמצאו נתונים לייצוא');
      return;
    }

    try {
      const summary = calculateSummary(monthData.locations);
      
      const csvData = [
        // כותרות
        ['חברת ניהול', 'כתובת', 'ימי עבודה', 'סוג חישוב', 'תעריף/סכום', 'סה"כ שעות', 'סכום לגבייה'],
        
        // נתונים
        ...monthData.locations.map(location => [
          location.managementCompany?.name || '-',
          `${location.street} ${location.streetNumber}, ${location.city}`,
          location.workDays.map(day => 
            `${daysMap[day.dayName as DayName]}${day.hours ? `: ${day.hours}` : ''}`
          ).join('; '),
          location.calculationType === CalculationType.HOURLY ? 'שעתי' : 'גלובלי',
          location.calculationType === CalculationType.HOURLY 
            ? location.hourlyRate 
            : location.globalAmount,
          location.workDays.reduce((sum, day) => sum + (day.hours || 0), 0),
          calculateAmount(location)
        ]),
        
        // שורה ריקה
        [],
        
        // סיכום
        ['סיכום'],
        [`סה"כ מיקומים: ${summary.totalLocations}`],
        [`סה"כ שעות: ${summary.totalHours}`],
        [`שעתי: ${summary.byCalculationType.hourly}`],
        [`גלובלי: ${summary.byCalculationType.global}`],
        [`סה"כ לגבייה: ${formatCurrency(summary.totalAmount)}`]
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `דוח_הכנסות_${monthId}.csv`;
      link.click();

      showNotification('success', 'הדוח יוצא בהצלחה');
    } catch (error) {
      showNotification('error', 'אירעה שגיאה בייצוא הדוח');
    }
  };

  const exportAllData = () => {
    try {
      const allData = Object.entries(monthlyData).map(([monthId, data]) => {
        const monthSummary = calculateSummary(data.locations);
        return {
          monthId,
          locations: data.locations,
          summary: monthSummary
        };
      });

      // יצירת מסמך אקסל עם מספר גליונות
      const workbook = [
        // כותרות
        'חודש,חברת ניהול,כתובת,ימי עבודה,סוג חישוב,תעריף/סכום,סה"כ שעות,סכום לגבייה\n',
        
        // נתונים לכל חודש
        ...allData.flatMap(({ monthId, locations }) =>
          locations.map(location => [
            monthId,
            location.managementCompany?.name || '-',
            `${location.street} ${location.streetNumber}, ${location.city}`,
            location.workDays.map(day => 
              `${daysMap[day.dayName as DayName]}${day.hours ? `: ${day.hours}` : ''}`
            ).join('; '),
            location.calculationType === CalculationType.HOURLY ? 'שעתי' : 'גלובלי',
            location.calculationType === CalculationType.HOURLY 
              ? location.hourlyRate 
              : location.globalAmount,
            location.workDays.reduce((sum, day) => sum + (day.hours || 0), 0),
            calculateAmount(location)
          ].join(','))
        ),
        
        // שורה ריקה
        '\n',
        
        // סיכומים
        'סיכומים לכל החודשים\n',
        ...allData.map(({ monthId, summary }) => [
          `${monthId},`,
          `סה"כ מיקומים: ${summary.totalLocations},`,
          `סה"כ שעות: ${summary.totalHours},`,
          `שעתי: ${summary.byCalculationType.hourly},`,
          `גלובלי: ${summary.byCalculationType.global},`,
          `סה"כ לגבייה: ${formatCurrency(summary.totalAmount)}`
        ].join(','))
      ].join('\n');

      // יצירת קובץ והורדה
      const blob = new Blob(['\ufeff' + workbook], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `דוח_הכנסות_מרוכז_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      showNotification('success', 'הדוח המרוכז יוצא בהצלחה');
    } catch (error) {
      showNotification('error', 'אירעה שגיאה בייצוא הדוח המרוכז');
    }
  };

  const handleCancelEdit = (locationId: string) => {
    setMonthlyData(prevData => ({
      ...prevData,
      [selectedMonthId]: {
        ...prevData[selectedMonthId],
        locations: prevData[selectedMonthId].locations.map(loc =>
          loc.id === locationId ? { ...loc, isEditing: false } : loc
        )
      }
    }));
  };

  const handleDelete = async (locationId: string) => {
    if (!selectedMonthId || !locationId || !monthlyData[selectedMonthId]) return;

    try {
      await deleteLocation(locationId);
      
      setMonthlyData(prev => ({
        ...prev,
        [selectedMonthId]: {
          ...prev[selectedMonthId],
          isModified: true,
          lastModified: new Date(),
          locations: prev[selectedMonthId].locations.filter(loc => loc.id !== locationId)
        }
      }));
      
      showNotification('success', 'המיקום נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting location:', error);
      showNotification('error', 'אירעה שגיאה במחיקת המיקום');
    }
  };

  return (
    <div className={styles.container}>
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}
      <div className={styles.titleWrapper}>
        <h1 className={styles.mainTitle}>
          דוח ניהול חברת אורלנדו אחזקות וניהול מבנים א.ג בע״מ
        </h1>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.headerLeft}>
            <h2>ניהול ההכנסות וההוצאות של החברה</h2>
            <div className={styles.headerButtons}>
              <div className={styles.exportButtons}>
                {selectedMonthId && (
                  <button
                    onClick={() => exportMonthData(selectedMonthId)}
                    className={styles.exportButton}
                  >
                    ייצא נתוני חודש
                  </button>
                )}
                <button
                  onClick={exportAllData}
                  className={`${styles.exportButton} ${styles.exportAllButton}`}
                >
                  ייצא דוח שנתי מרוכז
                </button>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className={styles.settingsButton}
              >
                הגדרות
              </button>
              <button
                onClick={handleAddLocation}
                className={styles.addButton}
                disabled={!selectedMonthId}
              >
                הוסף מיקום חדש
              </button>
            </div>
          </div>
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveMonthChanges}
              className={styles.saveButton}
            >
              שמור שינויים לחודש {selectedMonthId}
            </button>
          )}
        </div>
        
        {hasUnsavedChanges && (
          <div className={styles.unsavedChangesIndicator}>
            * יש שינויים שלא נשמרו בחודש הנוכחי
          </div>
        )}

        {renderIncomeSection()}
      </div>

      <div className={styles.monthsTabsContainer}>
        <div className={styles.monthsTabs}>
          {monthTabs.map((month) => (
            <button
              key={month.id}
              onClick={() => handleMonthChange(month.id)}
              className={`${styles.monthTab} 
                ${selectedMonthId === month.id ? styles.selected : ''} 
                ${monthlyData[month.id]?.isModified ? styles.modified : ''} 
                ${monthlyData[month.id]?.locations?.length ? styles.hasData : ''}`}
            >
              {month.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}