import { addActivityLog } from "./ActivityLogService"; // ✅ שמירת לוג פעילות
import { validateCompany } from "../utils/validation"; // ✅ ולידציה
import { Company } from "../types/models"; // ✅ שימוש במבנה נתונים אחיד

// זיכרון מקומי (מדמה API - ניתן להחליף בהמשך)
let companies: Company[] = [
  { code: "01", name: "Alpha Corp", createdAt: new Date(), updatedAt: new Date() },
  { code: "02", name: "Beta Ltd", createdAt: new Date(), updatedAt: new Date() },
];

// ✅ שליפת כל החברות
export const getAllCompanies = (): Company[] => {
  console.log("📊 כל החברות:", companies);
  return companies;
};

// ✅ יצירת חברה חדשה עם בדיקות
export const createCompany = (company: Company): void => {
  const error = validateCompany(company);
  if (error) {
    console.error("❌ שגיאה באימות הנתונים:", error);
    throw new Error(error);
  }

  if (companies.some((c) => c.code === company.code)) {
    console.error(`❌ קוד החברה ${company.code} כבר קיים.`);
    throw new Error("קוד החברה כבר קיים.");
  }

  company.createdAt = new Date();
  company.updatedAt = new Date();
  companies.push(company);
  console.log("✅ חברה נוצרה בהצלחה:", company);

  // ✅ רישום לוג
  addActivityLog("Admin", "Create", "Company", company.code);
};

// ✅ עדכון חברה עם בדיקות לקוד חדש
export const updateCompany = (code: string, updates: Partial<Company>, newCode?: string): void => {
  const index = companies.findIndex((c) => c.code === code);
  if (index === -1) {
    console.error(`❌ חברה עם הקוד ${code} לא נמצאה.`);
    throw new Error("חברה לא נמצאה.");
  }

  // ✅ ולידציה על הנתונים המעודכנים
  const updatedData = { ...companies[index], ...updates, code: newCode ?? companies[index].code };
  const error = validateCompany(updatedData);
  if (error) {
    console.error("❌ שגיאה באימות הנתונים:", error);
    throw new Error(error);
  }

  // ✅ אם הקוד משתנה, יש לוודא שאין כפילות
  if (newCode && newCode !== code) {
    if (companies.some((c) => c.code === newCode)) {
      console.error(`❌ לא ניתן לעדכן: קוד החברה ${newCode} כבר קיים.`);
      throw new Error("קוד החברה כבר קיים.");
    }
    // מחיקת הרשומה הישנה והוספת החדשה
    companies = companies.filter((c) => c.code !== code);
    companies.push(updatedData);
  } else {
    companies[index] = updatedData;
  }

  companies[index].updatedAt = new Date();
  console.log("🔄 חברה עודכנה בהצלחה:", updatedData);

  // ✅ רישום לוג
  addActivityLog("Admin", "Update", "Company", code);
};

// ✅ מחיקת חברה
export const deleteCompany = (code: string): void => {
  const index = companies.findIndex((c) => c.code === code);
  if (index === -1) {
    console.error(`❌ חברה עם הקוד ${code} לא נמצאה.`);
    throw new Error("חברה לא נמצאה.");
  }

  const deleted = companies[index];
  companies.splice(index, 1);
  console.log("🗑️ חברה נמחקה:", deleted);

  // ✅ רישום לוג
  addActivityLog("Admin", "Delete", "Company", code);
};
