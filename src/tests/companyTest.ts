// src/tests/companyTest.ts
import { createCompany, getAllCompanies, updateCompany, deleteCompany } from '../services/CompanyService';

// בדיקה: יצירת חברה
const company = createCompany({
  code: '01',
  name: 'Gal Enterprises',
  createdAt: new Date(),
  updatedAt: new Date(),
});
console.log('Company Created:', company);

// בדיקה: קריאת כל החברות
console.log('All Companies:', getAllCompanies());

// בדיקה: עדכון חברה
const updatedCompany = updateCompany('01', { name: 'Gal Corp' });
console.log('Company Updated:', updatedCompany);

// בדיקה: מחיקת חברה
const deleted = deleteCompany('01');
console.log('Company Deleted:', deleted);

// בדיקה: קריאה אחרי מחיקה
console.log('All Companies After Deletion:', getAllCompanies());
