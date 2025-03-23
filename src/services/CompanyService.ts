import { addActivityLog } from "./ActivityLogService"; // ✅ שמירת לוג פעילות
import { validateCompany } from "../utils/validation"; // ✅ ולידציה
import { Company } from "../types/company.types"; // ✅ שימוש במבנה נתונים אחיד
import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';

// זיכרון מקומי (מדמה API - ניתן להחליף בהמשך)
let companies: Company[] = [
  { code: "01", name: "Alpha Corp", createdAt: new Date(), updatedAt: new Date() },
  { code: "02", name: "Beta Ltd", createdAt: new Date(), updatedAt: new Date() },
];

// ✅ שליפת כל החברות
export const getAllCompanies = async (): Promise<Company[]> => {
  try {
    const companiesRef = collection(db, 'companies');
    const snapshot = await getDocs(companiesRef);
    
    const companies = snapshot.docs.map(doc => {
      const data = doc.data();
      
      // בדיקה שיש את כל השדות הנדרשים
      if (!data.code || !data.name) {
        console.warn(`חברה חסרה שדות חובה (id: ${doc.id}):`, data);
        
        // יצירת קוד אוטומטי אם חסר
        if (!data.code) {
          data.code = doc.id.slice(0, 4).padStart(4, '0');
        }
      }

      // טיפול בתאריכים
      let createdAt = new Date();
      let updatedAt = new Date();

      if (data.createdAt instanceof Timestamp) {
        createdAt = data.createdAt.toDate();
      } else if (data.createdAt) {
        console.warn('createdAt אינו מסוג Timestamp:', data.createdAt);
      }

      if (data.updatedAt instanceof Timestamp) {
        updatedAt = data.updatedAt.toDate();
      } else if (data.updatedAt) {
        console.warn('updatedAt אינו מסוג Timestamp:', data.updatedAt);
      }

      const company: Company = {
        id: doc.id,
        code: data.code || doc.id.slice(0, 4).padStart(4, '0'),
        name: data.name || 'חברה ללא שם',
        createdAt,
        updatedAt
      };

      return company;
    });

    console.log('Loaded companies:', companies);
    return companies;
  } catch (error) {
    console.error('Error loading companies:', error);
    throw new Error('שגיאה בטעינת חברות');
  }
};

// ✅ יצירת חברה חדשה עם בדיקות
export const createCompany = async (companyData: Partial<Company>): Promise<Company> => {
  try {
    if (!companyData.name || !companyData.code) {
      throw new Error('שם וקוד חברה הם שדות חובה');
    }

    const newCompanyData = {
      code: companyData.code,
      name: companyData.name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const companiesRef = collection(db, 'companies');
    const docRef = await addDoc(companiesRef, newCompanyData);
    
    const createdCompany: Company = {
      id: docRef.id,
      code: companyData.code,
      name: companyData.name,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return createdCompany;
  } catch (error) {
    console.error('Error in createCompany:', error);
    throw new Error('שגיאה ביצירת חברה חדשה');
  }
};

// ✅ עדכון חברה עם בדיקות לקוד חדש
export const updateCompany = async (id: string, companyData: Partial<Company>): Promise<void> => {
  try {
    if (!id) {
      throw new Error('מזהה חברה הוא שדה חובה');
    }

    const companyRef = doc(db, 'companies', id);
    const updateData = {
      ...(companyData.code && { code: companyData.code }),
      ...(companyData.name && { name: companyData.name }),
      updatedAt: serverTimestamp()
    };

    await updateDoc(companyRef, updateData);
    console.log('Company updated successfully');
  } catch (error) {
    console.error('Error in updateCompany:', error);
    throw new Error('שגיאה בעדכון החברה');
  }
};

// ✅ מחיקת חברה
export const deleteCompany = async (id: string): Promise<void> => {
  try {
    if (!id) {
      throw new Error('מזהה חברה הוא שדה חובה');
    }

    const companyRef = doc(db, 'companies', id);
    await deleteDoc(companyRef);
    console.log('Company deleted successfully');
  } catch (error) {
    console.error('Error in deleteCompany:', error);
    throw new Error('שגיאה במחיקת החברה');
  }
};
