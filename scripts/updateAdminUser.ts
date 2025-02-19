// scripts/updateAdminUser.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";
import dotenv from "dotenv";
import serviceAccount from "../firebase-adminsdk.json" assert { type: "json" };

// טען משתני סביבה
dotenv.config();

// אתחול Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

async function updateAdminUser() {
  try {
    const user = await getAuth().getUserByEmail("admin@hr.com");

    // עדכן את המשתמש הקיים להיות מנהל
    await getAuth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Existing user updated to Admin: ${user.email}`);
  } catch (error) {
    console.error("❌ Failed to update admin user:", error);
  }
}

updateAdminUser();
