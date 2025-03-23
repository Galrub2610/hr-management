import { Location, CreateLocationDto, CalculationType, WorkDay, HourlyLocation, GlobalLocation, DictatedLocation } from "../types/location.types";
import { v4 as uuidv4 } from 'uuid';
import { addActivityLog } from "./ActivityLogService";
import { toast } from 'react-toastify';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase'; // נשתמש ב-db מהקובץ החדש
import axios from 'axios';

// הוספת פונקציית ניטור
const logError = (functionName: string, error: any) => {
  console.error(`Error in ${functionName}:`, {
    message: error.message,
    code: error.code,
    stack: error.stack,
    details: error
  });
};

// פונקציה לבדיקת חיבור
export const testConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    const locationsRef = collection(db, 'locations');
    const snapshot = await getDocs(locationsRef);
    console.log('Connection test successful. Found', snapshot.size, 'locations');
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

// עדכון הטיפוסים
interface LocationDocument extends Omit<Location, 'id'> {
  createdAt: any;
  updatedAt: any;
}

// עדכון פונקציות ה-CRUD עם טיפול שגיאות מפורט
export const getAllLocations = async (): Promise<Location[]> => {
  try {
    console.log('Fetching locations...');
    const locationsSnapshot = await getDocs(collection(db, 'locations'));
    console.log('Fetched locations count:', locationsSnapshot.size);
    
    if (locationsSnapshot.empty) {
      console.log('No locations found, initializing collection...');
      await ensureCollectionExists();
      return [];
    }
    
    const locations = locationsSnapshot.docs.map(doc => {
      const data = doc.data() as LocationDocument;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null
      } as unknown as Location;
    });
    
    console.log('Processed locations:', locations);
    return locations;
  } catch (error) {
    logError('getAllLocations', error);
    throw error;
  }
};

export const createLocation = async (locationData: Partial<Location>): Promise<Location> => {
  try {
    console.log('Creating new location:', locationData);
    const locationsRef = collection(db, 'locations');
    
    const newLocationData = {
      ...locationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(locationsRef, newLocationData);
    const newDocSnapshot = await getDoc(docRef);
    
    if (!newDocSnapshot.exists()) {
      throw new Error('Failed to create location');
    }

    const createdLocation = {
      id: docRef.id,
      ...newDocSnapshot.data()
    } as Location;

    console.log('Location created successfully:', createdLocation);
    return createdLocation;
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
};

export const updateLocation = async (id: string, locationData: Partial<Location>): Promise<void> => {
  try {
    const locationRef = doc(db, 'locations', id);
    
    // וודא שה-managementCompany הוא null אם הוא undefined
    const updateData: Record<string, any> = {
      ...locationData,
      managementCompany: locationData.managementCompany || null,
      updatedAt: serverTimestamp()
    };

    // הסר שדות undefined לפני העדכון
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log('Updating location with data:', updateData);
    await updateDoc(locationRef, updateData);
  } catch (error) {
    console.error('Error updating location:', error);
    throw new Error('שגיאה בעדכון המיקום');
  }
};

export const deleteLocation = async (id: string): Promise<boolean> => {
  try {
    const locationRef = doc(db, 'locations', id);
    await deleteDoc(locationRef);
    return true;
  } catch (error) {
    console.error('Error deleting location from Firestore:', error);
    throw error;
  }
};

// פונקציה לאתחול הקולקציה
export const ensureCollectionExists = async () => {
  try {
    console.log('Checking locations collection...');
    const locationsRef = collection(db, 'locations');
    const snapshot = await getDocs(locationsRef);
    
    if (snapshot.empty) {
      console.log('Creating initial location...');
      await addDoc(locationsRef, {
        code: 'LOC-INITIAL',
        street: 'Test Location',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Initial location created');
    } else {
      console.log('Collection already exists with', snapshot.size, 'documents');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing collection:', error);
    return false;
  }
};

export const fetchLocations = async (): Promise<Location[]> => {
  try {
    console.log('Fetching locations...');
    const response = await axios.get<Location[]>('/api/locations');
    const locations = response.data;
    
    // וידוא תקינות הנתונים
    const validLocations = locations.filter(location => {
      if (!location || !location.code) {
        console.error('נמצא מיקום לא תקין:', location);
        return false;
      }
      return true;
    });

    console.log('Fetched locations count:', validLocations.length);
    console.log('Processed locations:', validLocations);
    
    return validLocations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw new Error('שגיאה בטעינת המיקומים');
  }
};
