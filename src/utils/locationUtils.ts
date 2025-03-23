import { Location, CalculationType, HourlyLocation, GlobalLocation, DictatedLocation } from '../types/location.types';

/**
 * יצירת קוד מיקום ייחודי
 * @param existingCodes רשימת קודים קיימים
 * @returns קוד מיקום חדש
 */
export const generateLocationCode = (existingCodes: string[]): string => {
  try {
    // המרת כל הקודים הקיימים למערך של מספרים
    const existingNumericCodes = existingCodes
      .map(code => {
        // הסרת כל התווים שאינם מספרים
        const numericCode = code.replace(/\D/g, '');
        // המרה למספר רק אם הוא בן 4 ספרות
        return numericCode.length === 4 ? parseInt(numericCode) : null;
      })
      .filter((code): code is number => code !== null && !isNaN(code));

    // יצירת קוד חדש
    let newCode: number;
    do {
      // יצירת מספר אקראי בין 1000 ל-9999
      newCode = Math.floor(Math.random() * 9000) + 1000;
    } while (existingNumericCodes.includes(newCode));

    // החזרת הקוד כמחרוזת עם אפסים מובילים
    return newCode.toString().padStart(4, '0');
  } catch (error) {
    console.error('שגיאה ביצירת קוד מיקום:', error);
    throw new Error('שגיאה ביצירת קוד מיקום');
  }
};

/**
 * פונקציה לבדיקת תקינות קוד מיקום
 * @param code קוד המיקום לבדיקה
 */
export const isValidLocationCode = (code: string): boolean => {
  return /^\d{5}$/.test(code);
};

/**
 * המרת סכום לפורמט מטבע
 * @param amount הסכום להמרה
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * בדיקת סוג המיקום - חישוב שעתי
 */
export const isHourlyLocation = (location: Location): location is HourlyLocation => {
  return location.calculationType === CalculationType.HOURLY;
};

/**
 * בדיקת סוג המיקום - חישוב גלובלי
 */
export const isGlobalLocation = (location: Location): location is GlobalLocation => {
  return location.calculationType === CalculationType.GLOBAL;
};

/**
 * בדיקת סוג המיקום - חישוב מוכתב
 */
export const isDictatedLocation = (location: Location): location is DictatedLocation => {
  return location.calculationType === CalculationType.DICTATED;
};

// פונקציה להשוואת קודי מיקום
export const compareLocationCodes = (code1: string, code2: string): number => {
  return parseInt(code1) - parseInt(code2);
};

/**
 * יצירת מזהה ייחודי למיקום
 * המזהה מורכב מ-5 ספרות
 */
export const generateLocationId = (existingIds: string[]): string => {
  const min = 10000;  // מספר מינימלי בן 5 ספרות
  const max = 99999;  // מספר מקסימלי בן 5 ספרות
  
  let newId: string;
  do {
    // יצירת מספר רנדומלי בן 5 ספרות
    newId = Math.floor(Math.random() * (max - min + 1) + min).toString();
  } while (existingIds.includes(newId));  // וידוא שהמזהה לא קיים כבר

  return newId;
}; 