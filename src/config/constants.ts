export const APP_CONFIG = {
  APP_NAME: 'מערכת ניהול משאבי אנוש',
  VERSION: '1.0.0',
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  DATE_FORMAT: 'DD/MM/YYYY',
  TIME_FORMAT: 'HH:mm',
  ITEMS_PER_PAGE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_LOCALES: ['he', 'en'],
  DEFAULT_LOCALE: 'he',
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  DATABASE: '/database',
  COMPANIES: '/database/companies',
  LOCATIONS: '/database/locations',
  EMPLOYEES: '/database/employees',
  CITIES: '/database/cities',
  REPORTS: '/reports',
  ACTIVITY_LOG: '/activity-log',
  INCOME_REPORT: '/reports/income'
};

export const CITIES = [
  'גבעתיים',
  'גני תקווה',
  'הוד השרון',
  'הרצליה',
  'חדרה',
  'כפר סבא',
  'לוד',
  'מודיעין',
  'נתניה',
  'פתח תקווה',
  'קריית אונו',
  'ראש העין',
  'רמלה',
  'רמת גן',
  'רמת השרון',
  'רעננה',
  'שוהם',
  'תל אביב'
];

export const WEEK_DAYS = {
  SUNDAY: 'ראשון',
  MONDAY: 'שני',
  TUESDAY: 'שלישי',
  WEDNESDAY: 'רביעי',
  THURSDAY: 'חמישי',
  FRIDAY: 'שישי',
  SATURDAY: 'שבת'
};

export const AUTH_ERRORS = {
  INVALID_EMAIL: 'כתובת האימייל אינה תקינה',
  WRONG_PASSWORD: 'הסיסמה שגויה',
  USER_NOT_FOUND: 'המשתמש לא נמצא',
  EMAIL_IN_USE: 'כתובת האימייל כבר בשימוש',
  WEAK_PASSWORD: 'הסיסמה חלשה מדי',
  NETWORK_ERROR: 'שגיאת תקשורת, נא לבדוק את החיבור לאינטרנט',
  UNKNOWN_ERROR: 'אירעה שגיאה לא צפויה'
};

export const TOAST_MESSAGES = {
  SAVE_SUCCESS: 'הנתונים נשמרו בהצלחה',
  DELETE_SUCCESS: 'הפריט נמחק בהצלחה',
  UPDATE_SUCCESS: 'הפריט עודכן בהצלחה',
  CREATE_SUCCESS: 'הפריט נוצר בהצלחה',
  OPERATION_ERROR: 'אירעה שגיאה בביצוע הפעולה'
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'שדה חובה',
  MIN_LENGTH: (min: number) => `אורך מינימלי הוא ${min} תווים`,
  MAX_LENGTH: (max: number) => `אורך מקסימלי הוא ${max} תווים`,
  EMAIL_FORMAT: 'כתובת אימייל לא תקינה',
  PHONE_FORMAT: 'מספר טלפון לא תקין',
  ID_FORMAT: 'מספר זהות לא תקין',
  POSITIVE_NUMBER: 'יש להזין מספר חיובי',
  DATE_FORMAT: 'פורמט תאריך לא תקין'
};

export const TABLE_CONFIG = {
  ROWS_PER_PAGE_OPTIONS: [10, 25, 50, 100],
  DEFAULT_ROWS_PER_PAGE: 25,
  MIN_SEARCH_CHARS: 2
};

export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME_DISPLAY: 'DD/MM/YYYY HH:mm',
  DATETIME_API: 'YYYY-MM-DD HH:mm:ss'
};

export const CALCULATION_TYPES = {
  HOURLY: 'hourly',
  GLOBAL: 'global',
  DICTATED: 'dictated'
};

export const CALCULATION_TYPE_LABELS = {
  [CALCULATION_TYPES.HOURLY]: 'חישוב לפי שעות',
  [CALCULATION_TYPES.GLOBAL]: 'חישוב גלובלי',
  [CALCULATION_TYPES.DICTATED]: 'חישוב מוכתב'
};

export const WORK_DAYS = [
  { id: 0, name: 'ראשון' },
  { id: 1, name: 'שני' },
  { id: 2, name: 'שלישי' },
  { id: 3, name: 'רביעי' },
  { id: 4, name: 'חמישי' },
  { id: 5, name: 'שישי' },
  { id: 6, name: 'שבת' }
];

// הוספת קונסטנטה חדשה עבור מיון ברירת המחדל
export const DEFAULT_SORT = {
  DIRECTION: 'asc' as const,
  LOCALE: 'he' as const,
  LOCALE_OPTIONS: { 
    sensitivity: 'base' as const 
  }
}; 