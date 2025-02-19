// src/services/LocationService.ts
import { Location } from '../models/Location';
import { addActivityLog } from './ActivityLogService'; // ✅ חדש

let locations: Location[] = [];

// ✅ צור מקום חדש עם בדיקת כפילות ובדיקות נוספות
export const createLocation = (location: Location): Location => {
  if (locations.some(loc => loc.code === location.code)) {
    alert(`Location with code ${location.code} already exists.`);
    console.error(`❌ Location with code ${location.code} already exists.`);
    throw new Error(`Location with code ${location.code} already exists.`);
  }

  location.createdAt = new Date();
  location.updatedAt = new Date();
  locations.push(location);
  console.log("✅ Location created:", location);

  // ✅ רישום לוג
  addActivityLog('Admin', 'Create', 'Location', location.code);

  return location;
};

// ✅ קרא את כל המקומות עם לוג לבדיקה
export const getAllLocations = (): Location[] => {
  console.log("📊 getAllLocations:", locations);
  return locations;
};

// ✅ עדכן מקום לפי קוד עם תמיכה בעדכון קוד חדש
export const updateLocation = (
  code: string,
  updates: Partial<Location>,
  newCode?: string
): Location | null => {
  const index = locations.findIndex(loc => loc.code === code);
  if (index === -1) {
    console.warn(`⚠️ Location with code ${code} not found.`);
    return null;
  }

  const updatedLocation = {
    ...locations[index],
    ...updates,
    code: newCode ?? locations[index].code,
    updatedAt: new Date(),
  };

  // ✅ אם מעדכנים את הקוד, יש לוודא שאין כפילות
  if (newCode && newCode !== code) {
    if (locations.some(loc => loc.code === newCode)) {
      alert('❌ This Location Code already exists!');
      console.error(`❌ Cannot update: Location with code ${newCode} already exists.`);
      return null;
    }
    // הסר את הרשומה הישנה והוסף את החדשה
    locations = locations.filter(loc => loc.code !== code);
    locations.push(updatedLocation);
  } else {
    locations[index] = updatedLocation;
  }

  console.log("🔄 Location updated:", updatedLocation);

  // ✅ רישום לוג
  addActivityLog('Admin', 'Update', 'Location', code);

  return updatedLocation;
};

// ✅ מחק מקום לפי קוד עם לוג לבדיקה
export const deleteLocation = (code: string): boolean => {
  const initialLength = locations.length;
  locations = locations.filter(loc => loc.code !== code);
  const deleted = locations.length < initialLength;

  if (deleted) {
    console.log(`🗑️ Location with code ${code} deleted.`);
    // ✅ רישום לוג
    addActivityLog('Admin', 'Delete', 'Location', code);
  } else {
    console.warn(`⚠️ Location with code ${code} not found.`);
  }

  return deleted;
};
