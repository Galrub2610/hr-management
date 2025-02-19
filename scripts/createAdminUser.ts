// scripts/createAdminUser.ts
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

async function createAdminUser() {
  try {
    const user = await getAuth().createUser({
      email: "admin@hr.com",
      password: "Admin123!",
      displayName: "Admin",
      disabled: false,
    });

    // הגדר את המשתמש כמנהל באמצעות Custom Claims
    await getAuth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Admin user created: ${user.email}`);
  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
  }
}

createAdminUser();
