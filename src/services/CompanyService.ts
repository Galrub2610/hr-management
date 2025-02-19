// src/services/CompanyService.ts
import { addActivityLog } from './ActivityLogService'; // ✅ חדש

interface Company {
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// זיכרון מקומי (כאילו זה שרת - ניתן להחליף בהמשך ב-API)
let companies: Company[] = [
  { code: "01", name: "Alpha Corp", createdAt: new Date(), updatedAt: new Date() },
  { code: "02", name: "Beta Ltd", createdAt: new Date(), updatedAt: new Date() },
];

// ✅ קבל את כל החברות
export const getAllCompanies = (): Company[] => {
  console.log("📊 getAllCompanies:", companies);
  return companies;
};

// ✅ צור חברה חדשה עם בדיקת כפילות
export const createCompany = (company: Company): void => {
  if (companies.some(c => c.code === company.code)) {
    console.error(`❌ Company code ${company.code} already exists.`);
    throw new Error("Company code already exists.");
  }

  company.createdAt = new Date();
  company.updatedAt = new Date();
  companies.push(company);
  console.log("✅ Company created:", company);

  // ✅ רישום לוג
  addActivityLog('Admin', 'Create', 'Company', company.code);
};

// ✅ עדכן חברה קיימת עם אפשרות לעדכן קוד חדש
export const updateCompany = (
  code: string,
  updates: Partial<Company>,
  newCode?: string
): void => {
  const index = companies.findIndex(c => c.code === code);
  if (index === -1) {
    console.error(`❌ Company with code ${code} not found.`);
    throw new Error("Company not found.");
  }

  // בדיקה אם הקוד החדש כבר קיים
  if (newCode && newCode !== code && companies.some(c => c.code === newCode)) {
    console.error(`❌ Company code ${newCode} already exists.`);
    throw new Error("Company code already exists.");
  }

  const updatedCompany = {
    ...companies[index],
    ...updates,
    code: newCode ?? companies[index].code,
    updatedAt: new Date(),
  };

  // אם הקוד משתנה, מחק את החברה הישנה והוסף את החדשה
  if (newCode && newCode !== code) {
    companies = companies.filter(c => c.code !== code);
    companies.push(updatedCompany);
  } else {
    companies[index] = updatedCompany;
  }

  console.log("🔄 Company updated:", updatedCompany);

  // ✅ רישום לוג
  addActivityLog('Admin', 'Update', 'Company', code);
};

// ✅ מחק חברה לפי הקוד עם לוג לבדיקה
export const deleteCompany = (code: string): void => {
  const index = companies.findIndex(c => c.code === code);
  if (index === -1) {
    console.error(`❌ Company with code ${code} not found.`);
    throw new Error("Company not found.");
  }

  const deleted = companies.splice(index, 1)[0];
  console.log("🗑️ Company deleted:", deleted);

  // ✅ רישום לוג
  addActivityLog('Admin', 'Delete', 'Company', code);
};
