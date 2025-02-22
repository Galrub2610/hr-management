import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, RecaptchaVerifier } from "firebase/auth"; // ✅ עדכון ייבוא

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ✅ אתחול Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

// ✅ הגדרת התמדה (שימור חיבור המשתמש) ב-LocalStorage
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✅ Auth persistence set to LocalStorage.");
  })
  .catch((error) => {
    console.error("❌ Failed to set auth persistence:", error);
  });

// ✅ אתחול Recaptcha עם תמיכה מובנית
export const initRecaptcha = (containerId: string) => {
  auth.useDeviceLanguage();
  try {
    return new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: (response) => {
        console.log("✅ Recaptcha verified:", response);
      },
    });
  } catch (error) {
    console.error("❌ שגיאה באתחול Recaptcha:", error);
    return null;
  }
};
