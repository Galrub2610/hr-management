import { Location } from "../types/models"; 
import { addActivityLog } from "./ActivityLogService"; 

let locations: Location[] = [];

// ✅ רשימת הערים המותרות
const allowedCities = [
  "תל אביב", "הרצליה", "רעננה", "כפר סבא", "נתניה", "חדרה", "ראש העין",
  "שוהם", "קריית אונו", "פתח תקווה", "גני תקווה", "אשדוד", "באר שבע",
  "רמת השרון", "הוד השרון", "לוד", "רמלה"
];

// ✅ פונקציה ליצירת קוד ייחודי אוטומטי (5 ספרות)
const generateUniqueCode = (): string => {
  let newCode;
  do {
    newCode = Math.floor(10000 + Math.random() * 90000).toString();
  } while (locations.some(loc => loc.code === newCode)); // בדיקה שאין כפילות
  return newCode;
};

// ✅ יצירת מקום חדש עם ולידציה נכונה
export const createLocation = (location: Partial<Location>): Location => {
  if (!location.street || location.street.trim() === "") {
    throw new Error("❌ שם הרחוב לא יכול להיות ריק.");
  }
  if (!location.city || location.city.trim() === "") {
    throw new Error("❌ יש לבחור עיר.");
  }
  if (!allowedCities.includes(location.city)) {
    throw new Error("❌ העיר שנבחרה אינה ברשימת הערים המותרות.");
  }

  // ✅ יצירת קוד ייחודי אוטומטית
  const newLocation: Location = {
    code: generateUniqueCode(),
    street: location.street.trim(),
    city: location.city.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  locations.push(newLocation);
  console.log("✅ מקום חדש נוסף:", newLocation);

  // ✅ רישום ביומן פעילות
  addActivityLog("Admin", "Create", "Location", newLocation.code);

  return newLocation;
};

// ✅ שליפת כל המקומות
export const getAllLocations = (): Location[] => {
  return locations;
};

// ✅ עדכון מקום עם ולידציה
export const updateLocation = (
  code: string,
  updates: Partial<Location>,
  newCode?: string
): Location | null => {
  const index = locations.findIndex((loc) => loc.code === code);
  if (index === -1) {
    console.warn(`⚠️ מקום עם הקוד ${code} לא נמצא.`);
    return null;
  }

  // ✅ בדיקות ולידציה לפני עדכון
  if (updates.street !== undefined && updates.street.trim() === "") {
    throw new Error("❌ שם הרחוב לא יכול להיות ריק.");
  }
  if (updates.city !== undefined && !allowedCities.includes(updates.city)) {
    throw new Error("❌ העיר שנבחרה אינה חוקית.");
  }

  // ✅ אם מעדכנים את הקוד, יש לוודא שאין כפילות
  if (newCode && newCode !== code) {
    if (locations.some((loc) => loc.code === newCode)) {
      console.error(`❌ לא ניתן לעדכן: קוד המקום ${newCode} כבר קיים.`);
      throw new Error(`❌ קוד המקום ${newCode} כבר קיים.`);
    }
  }

  const updatedLocation = {
    ...locations[index],
    ...updates,
    code: newCode ?? locations[index].code,
    updatedAt: new Date(),
  };

  locations[index] = updatedLocation;

  console.log("🔄 מקום עודכן:", updatedLocation);

  // ✅ רישום ביומן פעילות
  addActivityLog("Admin", "Update", "Location", code);

  return updatedLocation;
};

// ✅ מחיקת מקום לפי קוד
export const deleteLocation = (code: string): boolean => {
  const index = locations.findIndex((loc) => loc.code === code);
  if (index === -1) {
    console.warn(`⚠️ מקום עם הקוד ${code} לא נמצא.`);
    return false;
  }

  const deletedLocation = locations.splice(index, 1)[0];
  console.log(`🗑️ מקום נמחק:`, deletedLocation);

  // ✅ רישום ביומן פעילות
  addActivityLog("Admin", "Delete", "Location", code);

  return true;
};
