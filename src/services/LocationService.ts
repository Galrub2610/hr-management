import { Location, CreateLocationDto, CalculationType } from "../types/location.types";
import { addActivityLog } from "./ActivityLogService";

let locations: Location[] = [];

// ✅ רשימת הערים המותרות
const allowedCities = [
  "תל אביב", "הרצליה", "רעננה", "כפר סבא", "נתניה", "חדרה", "ראש העין",
  "שוהם", "קריית אונו", "פתח תקווה", "גני תקווה", "אשדוד", "באר שבע",
  "רמת השרון", "הוד השרון", "לוד", "רמלה"
];

// ✅ פונקציה ליצירת קוד ייחודי של 5 ספרות
const generateUniqueCode = (): string => {
  let code: string;
  do {
    // יצירת מספר רנדומלי בין 10000 ל-99999
    code = Math.floor(10000 + Math.random() * 90000).toString();
  } while (locations.some(loc => loc.code === code)); // בדיקה שהקוד לא קיים כבר

  return code;
};

// ✅ יצירת מקום חדש
export const createLocation = (locationData: CreateLocationDto): Location => {
  if (!locationData.street || locationData.street.trim() === "") {
    throw new Error("❌ שם הרחוב לא יכול להיות ריק.");
  }
  if (!locationData.city || locationData.city.trim() === "") {
    throw new Error("❌ יש לבחור עיר.");
  }
  if (!allowedCities.includes(locationData.city)) {
    throw new Error("❌ העיר שנבחרה אינה ברשימת הערים המותרות.");
  }

  const uniqueCode = generateUniqueCode();
  
  const baseLocation = {
    id: uniqueCode,
    code: uniqueCode,
    city: locationData.city.trim(),
    street: locationData.street.trim(),
    streetNumber: locationData.streetNumber,
    calculationType: locationData.calculationType,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  let newLocation: Location;

  switch (locationData.calculationType) {
    case CalculationType.HOURLY:
      newLocation = {
        ...baseLocation,
        calculationType: CalculationType.HOURLY,
        workDays: [],
        hourlyRate: 0,
        workHours: {}
      };
      break;
    case CalculationType.GLOBAL:
      newLocation = {
        ...baseLocation,
        calculationType: CalculationType.GLOBAL,
        workDays: [],
        monthlyPayment: 0
      };
      break;
    case CalculationType.DICTATED:
      newLocation = {
        ...baseLocation,
        calculationType: CalculationType.DICTATED,
        dictatedHours: 0
      };
      break;
    default:
      throw new Error("❌ סוג חישוב לא חוקי");
  }

  locations.push(newLocation);
  console.log("✅ מקום חדש נוסף:", newLocation);
  
  // ✅ רישום ביומן פעילות
  addActivityLog("Admin", "Create", "Location", uniqueCode);

  return newLocation;
};

// ✅ שליפת כל המקומות
export const getAllLocations = (): Location[] => {
  return locations;
};

// ✅ עדכון מקום עם ולידציה
export const updateLocation = (
  id: string,
  updates: Partial<Location>,
  newId?: string
): Location | null => {
  const index = locations.findIndex((loc) => loc.id === id);
  if (index === -1) {
    console.warn(`⚠️ מקום עם המזהה ${id} לא נמצא.`);
    return null;
  }

  // ✅ בדיקות ולידציה לפני עדכון
  if (updates.street !== undefined && updates.street.trim() === "") {
    throw new Error("❌ שם הרחוב לא יכול להיות ריק.");
  }
  if (updates.city !== undefined && !allowedCities.includes(updates.city)) {
    throw new Error("❌ העיר שנבחרה אינה חוקית.");
  }

  // ✅ אם מעדכנים את המזהה, יש לוודא שאין כפילות
  if (newId && newId !== id) {
    if (locations.some((loc) => loc.id === newId)) {
      console.error(`❌ לא ניתן לעדכן: מזהה המקום ${newId} כבר קיים.`);
      throw new Error(`❌ מזהה המקום ${newId} כבר קיים.`);
    }
  }

  const updatedLocation = {
    ...locations[index],
    ...updates,
    id: newId ?? locations[index].id,
    updatedAt: new Date(),
  };

  locations[index] = updatedLocation;

  console.log("🔄 מקום עודכן:", updatedLocation);

  // ✅ רישום ביומן פעילות
  addActivityLog("Admin", "Update", "Location", id);

  return updatedLocation;
};

// ✅ מחיקת מקום לפי קוד
export const deleteLocation = (code: string): boolean => {
  console.log("מנסה למחוק מיקום עם קוד:", code); // לוג לבדיקה
  console.log("מיקומים לפני מחיקה:", locations); // לוג לבדיקה
  
  const index = locations.findIndex((loc) => loc.code === code);
  console.log("אינדקס שנמצא:", index); // לוג לבדיקה
  
  if (index === -1) {
    console.warn(`⚠️ מקום עם הקוד ${code} לא נמצא.`);
    return false;
  }

  const deletedLocation = locations.splice(index, 1)[0];
  console.log("✅ מקום נמחק:", deletedLocation);
  console.log("מיקומים אחרי מחיקה:", locations); // לוג לבדיקה

  // ✅ רישום ביומן פעילות
  addActivityLog("Admin", "Delete", "Location", code);

  return true;
};
