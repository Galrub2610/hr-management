export interface BaseCompany {
  code: string;
  name: string;
}

export interface ManagementCompany extends BaseCompany {
  // שדות נוספים ספציפיים לחברת ניהול אם יש
}

export interface Company {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
} 