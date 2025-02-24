/**
 * סוגי החישוב האפשריים למיקום עבודה
 */
export enum CalculationType {
  HOURLY = 'hourly',           // חישוב שעתי
  GLOBAL = 'global',           // חישוב גלובלי
  DICTATED = 'dictated'        // חישוב שעתי מוכתב
}

/**
 * ימי העבודה בשבוע
 */
export enum WeekDays {
  SUNDAY = 'ראשון',
  MONDAY = 'שני',
  TUESDAY = 'שלישי',
  WEDNESDAY = 'רביעי',
  THURSDAY = 'חמישי',
  FRIDAY = 'שישי',
  SATURDAY = 'שבת'
}

/**
 * מידע על יום עבודה ספציפי - משמש לחישוב שעתי
 * @property day - יום בשבוע
 * @property hours - מספר שעות עבודה
 * @property isActive - האם יום זה פעיל
 */
export interface WorkDay {
  day: WeekDays;
  hours: number;
  isActive: boolean;
}

/**
 * מידע בסיסי על מיקום - משותף לכל סוגי המיקומים
 */
export interface BaseLocation {
  id: string;                  // מזהה ייחודי
  code: string;                // קוד
  city: string;                // עיר
  street: string;              // רחוב
  streetNumber: string;        // מספר בית
  calculationType: CalculationType;  // סוג החישוב
  createdAt: Date;            // תאריך יצירה
  updatedAt: Date;            // תאריך עדכון אחרון
}

/**
 * מיקום עם חישוב שעתי
 * כולל את כל המידע הבסיסי בתוספת ימי עבודה ותעריף שעתי
 */
export interface HourlyLocation extends BaseLocation {
  calculationType: CalculationType.HOURLY;
  workDays: string[];         // ימי עבודה
  hourlyRate: number;          // תעריף לשעה בש"ח
  workHours: { [key: string]: number };
}

/**
 * מיקום עם חישוב גלובלי
 * כולל את כל המידע הבסיסי בתוספת ימי עבודה ותשלום חודשי קבוע
 */
export interface GlobalLocation extends BaseLocation {
  calculationType: CalculationType.GLOBAL;
  workDays: string[];       // ימי עבודה
  monthlyPayment: number;      // תשלום חודשי קבוע בש"ח
}

/**
 * מיקום עם חישוב שעתי מוכתב
 * כולל את כל המידע הבסיסי בתוספת מספר שעות קבוע
 */
export interface DictatedLocation extends BaseLocation {
  calculationType: CalculationType.DICTATED;
  dictatedHours: number;       // מספר שעות קבוע (יכול לכלול שבר עשרוני)
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
  
  // שלב 4: סוג חישוב
  calculationType?: CalculationType;
  
  // שלב 5: פרטי חישוב שעתי
  workDays?: WorkDay[];
  hourlyRate?: number;
  
  // שלב 6: פרטי חישוב גלובלי
  selectedDays?: WeekDays[];
  monthlyPayment?: number;
  
  // שלב 7: פרטי חישוב שעתי מוכתב
  dictatedHours?: number;
}

/**
 * נתונים נדרשים ליצירת מיקום חדש
 */
export interface CreateLocationDto {
  city: string;
  street: string;
  streetNumber: string;
  calculationType: CalculationType;
} 