import { Employee } from "../types/models"; // ✅ שימוש במבנה נתונים תקין
import { addActivityLog } from "./ActivityLogService"; // ✅ שמירת לוג פעילות
import { validateEmployee } from "../utils/validation"; // ✅ ולידציה

export interface CreateEmployeeDto {
  fullName: string;
  phone?: string;
  workPermit: boolean;
  city?: string;
}

let employees: Employee[] = [];

// ✅ פונקציה ליצירת קוד עובד ייחודי בן 4 ספרות
const generateUniqueEmployeeCode = (): string => {
  let code: string;
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (employees.some(emp => emp.code === code));
  return code;
};

// ✅ קבלת כל העובדים
export const getAllEmployees = (): Employee[] => {
  return employees;
};

// ✅ יצירת עובד חדש
export const createEmployee = (employeeData: CreateEmployeeDto): Employee => {
  // ולידציה לשדה חובה
  if (!employeeData.fullName || employeeData.fullName.trim() === "") {
    throw new Error("שם העובד הוא שדה חובה");
  }

  // ולידציה למספר טלפון (אם הוזן)
  if (employeeData.phone && !/^\d+$/.test(employeeData.phone)) {
    throw new Error("מספר טלפון חייב להכיל ספרות בלבד");
  }

  const newEmployee: Employee = {
    code: generateUniqueEmployeeCode(),
    fullName: employeeData.fullName.trim(),
    phone: employeeData.phone,
    workPermit: employeeData.workPermit,
    city: employeeData.city?.trim(),
    locationId: "temp", // ערך זמני - נעדכן בהמשך כשנחבר למיקומים
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  employees.push(newEmployee);
  console.log("עובד חדש נוסף:", newEmployee);
  
  addActivityLog("default-user", "Create", "Employee", newEmployee.code);
  return newEmployee;
};

// ✅ מחיקת עובד
export const deleteEmployee = (code: string): boolean => {
  const index = employees.findIndex(emp => emp.code === code);
  if (index === -1) return false;
  
  employees.splice(index, 1);
  return true;
};

// ✅ עדכון עובד
export const updateEmployee = (code: string, employeeData: CreateEmployeeDto): Employee | null => {
  const index = employees.findIndex(emp => emp.code === code);
  if (index === -1) return null;

  const updatedEmployee: Employee = {
    ...employees[index],
    ...employeeData,
    updatedAt: new Date()
  };

  employees[index] = updatedEmployee;
  return updatedEmployee;
};

// כאן יבואו הפונקציות החדשות
