// src/models/Location.ts
export interface Location {
    code: string;      // 5 ספרות
    address: string;
    notes?: string;
    price: number;
    companyId: string; // קישור לחברה
    createdAt: Date;
    updatedAt: Date;
}
  