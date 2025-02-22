import { Employee } from "../types/models"; // ✅ שימוש במבנה נתונים תקין
import { addActivityLog } from "./ActivityLogService"; // ✅ שמירת לוג פעילות
import { validateEmployee } from "../utils/validation"; // ✅ ולידציה

let employees: Employee[] = [];

// ✅ יצירת עובד חדש עם ולידציה ורישום לוג
export const createEmployee = (employee: Employee): Employee => {
  // ✅ בדיקת ולידציה
  const error = validateEmployee(employee);
  if (error) {
    console.error("❌ שגיאה באימות הנתונים:", error);
    throw new Error(error);
  }

  // ✅ בדיקת קוד עובד ייחודי
  if (employees.some((emp) => emp.code === employee.code)) {
    console.error(`❌ קוד העובד ${employee.code} כבר קיים.`);
    throw new Error("קוד העובד כבר קיים.");
  }

  employee.createdAt = new Date();
  employee.updatedAt = new Date();
  employees.push(employee);
  console.log("✅ עובד נוצר בהצלחה:", employee);

  // ✅ רישום לוג
  addActivityLog("Admin", "Create", "Employee", employee.code);

  return employee;
};

// ✅ שליפת כל העובדים עם לוג לבדיקה
export const getAllEmployees = (): Employee[] => {
  console.log("📊 כל העובדים:", employees);
  return employees;
};

// ✅ עדכון עובד עם ולידציה ובדיקות תקינות
export const updateEmployee = (
  code: string,
  updates: Partial<Employee>
): Employee | null => {
  const index = employees.findIndex((emp) => emp.code === code);
  if (index === -1) {
    console.warn(`⚠️ עובד עם הקוד ${code} לא נמצא.`);
    return null;
  }

  // ✅ יצירת אובייקט מעודכן
  const updatedEmployee: Employee = {
    ...employees[index],
    ...updates,
    updatedAt: new Date(),
  };

  // ✅ ולידציה על הנתונים המעודכנים
  const error = validateEmployee(updatedEmployee);
  if (error) {
    console.error("❌ שגיאה באימות הנתונים:", error);
    throw new Error(error);
  }

  employees[index] = updatedEmployee;
  console.log("🔄 עובד עודכן בהצלחה:", updatedEmployee);

  // ✅ רישום לוג
  addActivityLog("Admin", "Update", "Employee", code);

  return updatedEmployee;
};

// ✅ מחיקת עובד עם לוג לבדיקה
export const deleteEmployee = (code: string): boolean => {
  const index = employees.findIndex((emp) => emp.code === code);
  if (index === -1) {
    console.warn(`⚠️ עובד עם הקוד ${code} לא נמצא.`);
    return false;
  }

  const deletedEmployee = employees[index];
  employees.splice(index, 1);

  console.log("🗑️ עובד נמחק בהצלחה:", deletedEmployee);

  // ✅ רישום לוג
  addActivityLog("Admin", "Delete", "Employee", code);

  return true;
};
