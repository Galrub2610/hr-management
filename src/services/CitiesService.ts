import { addActivityLog } from "./ActivityLogService";
import { CITIES } from "../config/constants";

export interface City {
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCityDto {
  name: string;
}

// Load cities from localStorage or initialize with default cities
const loadCities = (): City[] => {
  const citiesJson = localStorage.getItem('cities');
  if (!citiesJson) {
    // Initialize with default cities
    const defaultCities: City[] = CITIES.map((cityName, index) => ({
      code: (index + 10).toString(), // Starting from 10 to avoid single digits
      name: cityName,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    saveCities(defaultCities);
    return defaultCities;
  }

  try {
    const parsedCities = JSON.parse(citiesJson);
    return parsedCities.map((city: any) => ({
      ...city,
      createdAt: new Date(city.createdAt),
      updatedAt: new Date(city.updatedAt)
    }));
  } catch (error) {
    console.error('Error parsing cities from localStorage:', error);
    return [];
  }
};

// Save cities to localStorage
const saveCities = (cities: City[]): void => {
  localStorage.setItem('cities', JSON.stringify(cities));
};

let cities: City[] = loadCities();

// ✅ פונקציה ליצירת קוד עיר ייחודי בן 2 ספרות
const generateUniqueCityCode = (): string => {
  let code: string;
  do {
    code = Math.floor(10 + Math.random() * 90).toString();
  } while (cities.some(city => city.code === code));
  return code;
};

// ✅ יצירת עיר חדשה
export const createCity = (cityData: CreateCityDto): City => {
  if (!cityData.name || cityData.name.trim() === "") {
    throw new Error("שם העיר הוא שדה חובה");
  }

  // בדיקה האם העיר כבר קיימת
  if (cities.some(city => city.name.trim().toLowerCase() === cityData.name.trim().toLowerCase())) {
    throw new Error("עיר זו כבר קיימת במערכת");
  }

  const newCity: City = {
    code: generateUniqueCityCode(),
    name: cityData.name.trim(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  cities.push(newCity);
  saveCities(cities);
  console.log("עיר חדשה נוספה:", newCity);
  
  addActivityLog("default-user", "Create", "City", newCity.code);
  return newCity;
};

// ✅ קבלת כל הערים
export const getAllCities = (): City[] => {
  return cities;
};

// ✅ מחיקת עיר
export const deleteCity = (code: string): boolean => {
  const index = cities.findIndex(city => city.code === code);
  if (index === -1) return false;
  
  cities.splice(index, 1);
  saveCities(cities);
  console.log("עיר נמחקה:", code);
  
  addActivityLog("default-user", "Delete", "City", code);
  return true;
};

// ✅ עדכון עיר
export const updateCity = (code: string, cityData: CreateCityDto): City | null => {
  const index = cities.findIndex(city => city.code === code);
  if (index === -1) return null;

  if (!cityData.name || cityData.name.trim() === "") {
    throw new Error("שם העיר הוא שדה חובה");
  }

  // בדיקה האם השם החדש כבר קיים (מלבד העיר הנוכחית)
  if (cities.some(city => 
    city.code !== code && 
    city.name.trim().toLowerCase() === cityData.name.trim().toLowerCase()
  )) {
    throw new Error("עיר זו כבר קיימת במערכת");
  }

  const updatedCity: City = {
    ...cities[index],
    name: cityData.name.trim(),
    updatedAt: new Date()
  };

  cities[index] = updatedCity;
  saveCities(cities);
  console.log("עיר עודכנה:", updatedCity);
  
  addActivityLog("default-user", "Update", "City", code);
  return updatedCity;
}; 