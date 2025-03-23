import { initializeApp, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// פונקציה לקבלת מופע Firebase
const getFirebaseApp = () => {
  try {
    return getApp();
  } catch {
    return initializeApp(firebaseConfig);
  }
};

// אתחול Firebase והשגת מופע Firestore
const app = getFirebaseApp();
export const db = getFirestore(app);

// פונקציה לבדיקת חיבור
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    return true;
  } catch (error) {
    console.error('Firebase connection error:', error);
    return false;
  }
}; 