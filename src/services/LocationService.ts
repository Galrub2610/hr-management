import { Location, CreateLocationDto, CalculationType, WorkDay } from "../types/location.types";
import { v4 as uuidv4 } from 'uuid';
import { addActivityLog } from "./ActivityLogService";
import { toast } from 'react-toastify';

// טעינת מיקומים מהלוקל סטורג'
const loadLocations = (): Location[] => {
  const locationsJson = localStorage.getItem('locations');
  if (!locationsJson) return [];
  
  try {
    const parsedLocations = JSON.parse(locationsJson);
    return parsedLocations.map((loc: any) => ({
      ...loc,
      createdAt: new Date(loc.createdAt),
      updatedAt: new Date(loc.updatedAt)
    }));
  } catch (error) {
    console.error('Error parsing locations from localStorage:', error);
    return [];
  }
};

// שמירת מיקומים בלוקל סטורג'
const saveLocations = (locations: Location[]): void => {
  localStorage.setItem('locations', JSON.stringify(locations));
};

// מערך זמני של מיקומים
let locations: Location[] = loadLocations();

// ✅ רשימת הערים המותרות
const allowedCities = [
  "תל אביב", "הרצליה", "רעננה", "כפר סבא", "נתניה", "חדרה", "ראש העין",
  "שוהם", "קריית אונו", "פתח תקווה", "גני תקווה", "אשדוד", "באר שבע",
  "רמת השרון", "הוד השרון", "לוד", "רמלה"
];

// יצירת קוד ייחודי למיקום
const generateUniqueCode = (): string => {
  let code: string;
  do {
    code = Math.floor(10000 + Math.random() * 90000).toString();
  } while (locations.some(loc => loc.code === code));
  return code;
};

// שליפת כל המיקומים
export const getAllLocations = async (): Promise<Location[]> => {
  return locations;
};

// יצירת מיקום חדש
export const createLocation = async (data: CreateLocationDto): Promise<Location> => {
  const code = generateUniqueCode();
  
  const newLocation: Location = {
    ...data,
    id: uuidv4(), // מזהה ייחודי
    code,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system' // או כל מזהה אחר של המשתמש
  } as Location;

  // שמירה במערך המקומי
  locations = [...locations, newLocation];
  
  // שמירה בלוקל סטורג'
  saveLocations(locations);
  
  return newLocation;
};

// מחיקת מיקום
export const deleteLocation = async (code: string): Promise<boolean> => {
  const initialLength = locations.length;
  locations = locations.filter(loc => loc.code !== code);
  
  if (locations.length !== initialLength) {
    saveLocations(locations);
    return true;
  }
  
  return false;
};

// עדכון מיקום
export const updateLocation = async (
  code: string,
  data: Partial<CreateLocationDto>
): Promise<Location | null> => {
  const index = locations.findIndex(loc => loc.code === code);
  if (index === -1) return null;

  const updatedLocation: Location = {
    ...locations[index],
    ...data,
    updatedAt: new Date()
  } as Location;

  locations[index] = updatedLocation;
  saveLocations(locations);
  
  return updatedLocation;
};
