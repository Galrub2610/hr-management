/**
 * סוגי החישוב האפשריים למיקום עבודה
 */
export enum CalculationType {
  HOURLY = 'HOURLY',
  GLOBAL = 'GLOBAL',
  DICTATED = 'DICTATED'
}

/**
 * מידע על יום עבודה ספציפי - משמש לחישוב שעתי
 * @property day - יום בשבוע
 * @property hours - מספר שעות עבודה
 * @property isActive - האם יום זה פעיל
 */
export interface WorkDay {
  dayName: DayName;
  hours?: number;
}

/**
 * חברת ניהול
 */
export interface ManagementCompany {
  code: string;
  name: string;
}

/**
 * מידע בסיסי על מיקום - משותף לכל סוגי המיקומים
 */
export interface BaseLocation {
  id?: string;
  code: string;
  street: string;
  streetNumber: string;
  city: string;
  cityCode: string;
  calculationType: CalculationType;
  workDays: WorkDay[];
  managementCompany?: ManagementCompany;
}

/**
 * מיקום עם חישוב שעתי
 * כולל את כל המידע הבסיסי בתוספת ימי עבודה ותעריף שעתי
 */
export interface HourlyLocation extends BaseLocation {
  calculationType: CalculationType.HOURLY;
  hourlyRate: number;          // תעריף לשעה בש"ח
}

/**
 * מיקום עם חישוב גלובלי
 * כולל את כל המידע הבסיסי בתוספת ימי עבודה ותשלום חודשי קבוע
 */
export interface GlobalLocation extends BaseLocation {
  calculationType: CalculationType.GLOBAL;
  globalAmount: number;
}

/**
 * מיקום עם חישוב שעתי מוכתב
 * כולל את כל המידע הבסיסי בתוספת מספר שעות קבוע
 */
export interface DictatedLocation extends BaseLocation {
  calculationType: CalculationType.DICTATED;
  dictatedHours: number;
}

/**
 * איחוד כל סוגי המיקומים האפשריים
 */
export type Location = HourlyLocation | GlobalLocation | DictatedLocation;

/**
 * מצב הטופס בכל שלב
 * משמש לניהול הנתונים במהלך תהליך יצירת מיקום חדש
 */
export interface LocationFormState {
  currentStep: number;         // שלב נוכחי בטופס
  totalSteps: number;         // סך כל השלבים
  
  // שלבים 1-3: פרטי מיקום בסיסיים
  city: string;
  street: string;
  streetNumber: string;
  cityCode: string;
  
  // שלב 4: סוג חישוב
  calculationType?: CalculationType;
  
  // שלב 5: פרטי חישוב שעתי
  workDays?: WorkDay[];
  hourlyRate?: number;
  
  // שלב 6: פרטי חישוב גלובלי
  globalAmount?: number;
  
  // שלב 7: פרטי חישוב שעתי מוכתב
  dictatedHours?: number;
}

/**
 * נתונים נדרשים ליצירת מיקום חדש
 */
export interface CreateLocationDto extends Omit<BaseLocation, 'code' | 'id'> {
  hourlyRate?: number;
  globalAmount?: number;
  dictatedHours?: number;
}

// הוספת טיפוסים לטופס
export interface LocationFormData {
  street: string;
  streetNumber: string;
  cityCode: string;
  managementCompanyCode?: string;
  calculationType: CalculationType;
  weekDays: DayName[];
  dayHours: {
    dayId: DayName;
    hours: number;
  }[];
  hourlyRate?: string;
  globalAmount?: string;
  dictatedHours?: string;
}

export enum DayName {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY'
}

export interface DayHours {
  dayId: DayName;
  hours: number;
} 