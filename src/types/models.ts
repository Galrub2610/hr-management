export interface Company {
    code: string;      // 2 ספרות
    name: string;
    locationIds?: string[]; // ✅ רשימת מזהי מיקומים (אופציונלי)
    employeeIds?: string[]; // ✅ רשימת מזהי עובדים (אופציונלי)
    createdAt: Date;
    updatedAt: Date;
}
  
export interface Location {
    code: string;      // 5 ספרות
    address: string;
    notes?: string;
    price: number;
    companyId: string; // מפתח זר לחברה
    employeeIds?: string[]; // ✅ רשימת מזהי עובדים (אופציונלי)
    createdAt: Date;
    updatedAt: Date;
}
  
export interface Employee {
    code: string;      // 3 ספרות
    name: string;
    locationId: string; // מפתח זר למיקום
    companyId?: string; // ✅ מפתח זר לחברה (אופציונלי אם תרצה להציג גישה ישירה)
    createdAt: Date;
    updatedAt: Date;
}
