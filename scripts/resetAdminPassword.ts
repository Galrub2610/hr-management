// scripts/resetAdminPassword.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../firebase-adminsdk.json" assert { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
});

async function resetAdminPassword() {
  try {
    const user = await getAuth().getUserByEmail("admin@hr.com");
    await getAuth().updateUser(user.uid, {
      password: "Admin123!",
    });
    console.log(`✅ Password reset for: ${user.email}`);
  } catch (error) {
    console.error("❌ Failed to reset password:", error);
  }
}

resetAdminPassword();
