import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, RecaptchaVerifier, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// בדיקה שכל הערכים הנדרשים קיימים
const validateConfig = (config: typeof firebaseConfig) => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field as keyof typeof config]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
  }
};

// הגדרת משתנים גלובליים עם טיפוסים מדויקים
let firebaseApp: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let analytics: Analytics | undefined;
let storage: FirebaseStorage | undefined;

// פונקציה לאתחול Firebase
const initializeFirebase = () => {
  if (!firebaseApp) {
    try {
      validateConfig(firebaseConfig);
      
      // בדיקה אם כבר קיימת אפליקציית Firebase
      firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

      // אתחול שירותים
      auth = getAuth(firebaseApp);
      db = getFirestore(firebaseApp);
      storage = getStorage(firebaseApp);
      
      // אתחול Analytics רק בסביבת הפרודקשן
      if (import.meta.env.PROD) {
        analytics = getAnalytics(firebaseApp);
      }

      // הגדרת התמדת המשתמש
      if (auth) {
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            console.log("✅ Auth persistence set successfully");
          })
          .catch((error) => {
            console.error("❌ Auth persistence error:", error);
          });
      }

      console.log("✅ Firebase initialized successfully");
    } catch (error) {
      console.error("❌ Firebase initialization error:", error);
      throw error;
    }
  }
  
  if (!auth || !db || !storage) {
    throw new Error("Firebase services not initialized properly");
  }
  
  return { auth, db, storage, analytics };
};

// אתחול Firebase בעת טעינת המודול
const { auth: initializedAuth, db: initializedDb, storage: initializedStorage } = initializeFirebase();

// פונקציית עזר ל-Recaptcha
const initRecaptcha = (containerId: string) => {
  if (!initializedAuth) return null;
  
  try {
    initializedAuth.useDeviceLanguage();
    return new RecaptchaVerifier(initializedAuth, containerId, {
      size: "invisible",
      callback: (response: any) => {
        console.log("✅ Recaptcha verified");
      },
    });
  } catch (error) {
    console.error("❌ Error initializing Recaptcha:", error);
    return null;
  }
};

export { initializedAuth as auth, initializedDb as db, initializedStorage as storage, initRecaptcha };
