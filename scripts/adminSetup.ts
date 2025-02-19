// scripts/adminSetup.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";
import dotenv from "dotenv";
import serviceAccount from "../firebase-adminsdk.json" assert { type: "json" };

// טען משתני סביבה
dotenv.config();

// אתחול Firebase Admin עם המפתח
initializeApp({
  credential: cert(serviceAccount),
});

async function setAdminRole() {
  const auth = getAuth();
  const email = "admin@hr.com";

  try {
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Admin role assigned to ${email}`);
  } catch (error) {
    console.error("❌ Failed to set admin role:", error);
  }
}

setAdminRole();
