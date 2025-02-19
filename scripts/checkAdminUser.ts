// scripts/checkAdminUser.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../firebase-adminsdk.json" assert { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
});

async function checkAdminUser() {
  try {
    const user = await getAuth().getUserByEmail("admin@hr.com");
    console.log(`✅ User exists: ${user.email}`);
    console.log(`🔑 User UID: ${user.uid}`);
    console.log(`📛 Display Name: ${user.displayName}`);
    console.log(`👮 Custom Claims: ${JSON.stringify(user.customClaims)}`);
  } catch (error) {
    console.error("❌ User not found or error:", error);
  }
}

checkAdminUser();
