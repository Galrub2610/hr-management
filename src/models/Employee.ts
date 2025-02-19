// src/models/Employee.ts
export interface Employee {
    code: string;      // 3 ספרות
    name: string;
    locationId: string; // קישור למקום עבודה
    createdAt: Date;
    updatedAt: Date;
}
  