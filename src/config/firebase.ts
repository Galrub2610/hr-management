// src/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth"; // ✅ ייבוא מעודכן

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
    console.error("❌ Failed to initialize Recaptcha:", error);
    return null;
  }
};
