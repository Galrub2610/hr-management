// src/tests/locationTest.ts
import { createLocation, getAllLocations, updateLocation, deleteLocation } from '../services/LocationService';

// בדיקה: יצירת מקום
const location = createLocation({
  code: '00001',
  address: '123 Main St',
  price: 1500,
  companyId: '01',
  createdAt: new Date(),
  updatedAt: new Date(),
});
console.log('Location Created:', location);

// בדיקה: קריאת כל המקומות
console.log('All Locations:', getAllLocations());

// בדיקה: עדכון מקום
const updatedLocation = updateLocation('00001', { address: '456 Oak St' });
console.log('Location Updated:', updatedLocation);

// בדיקה: מחיקת מקום
const deleted = deleteLocation('00001');
console.log('Location Deleted:', deleted);

// בדיקה: קריאה אחרי מחיקה
console.log('All Locations After Deletion:', getAllLocations());
