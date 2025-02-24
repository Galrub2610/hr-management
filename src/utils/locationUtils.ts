// פונקציה ליצירת קוד מיקום ייחודי
export const generateLocationCode = (existingCodes: string[]): string => {
  const min = 10000; // מספר מינימלי בן 5 ספרות
  const max = 99999; // מספר מקסימלי בן 5 ספרות
  
  let newCode: string;
  do {
    // יצירת מספר רנדומלי בין 10000 ל-99999
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    newCode = randomNum.toString();
  } while (existingCodes.includes(newCode));

  return newCode;
};

// פונקציה לבדיקת תקינות קוד מיקום
export const isValidLocationCode = (code: string): boolean => {
  // בדיקה שהקוד הוא מספר בן 5 ספרות בדיוק
  return /^\d{5}$/.test(code);
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