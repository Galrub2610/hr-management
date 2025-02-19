// src/services/EmployeeService.ts
import { Employee } from '../models/Employee';
import { addActivityLog } from './ActivityLogService'; // ✅ חדש

let employees: Employee[] = [];

// ✅ צור עובד חדש עם רישום לוג
export const createEmployee = (employee: Employee): Employee => {
  employee.createdAt = new Date();
  employee.updatedAt = new Date();
  employees.push(employee);
  console.log("✅ Employee created:", employee);

  // ✅ רישום לוג
  addActivityLog('Admin', 'Create', 'Employee', employee.code);

  return employee;
};

// ✅ קרא את כל העובדים עם לוג לבדיקה
export const getAllEmployees = (): Employee[] => {
  console.log("📊 getAllEmployees:", employees);
  return employees;
};

// ✅ עדכן עובד לפי קוד עם רישום לוג
export const updateEmployee = (
  code: string, 
  updates: Partial<Employee>
): Employee | null => {
  const employee = employees.find(emp => emp.code === code);
  if (!employee) {
    console.warn(`⚠️ Employee with code ${code} not found.`);
    return null;
  }

  Object.assign(employee, updates, { updatedAt: new Date() });
  console.log("🔄 Employee updated:", employee);

  // ✅ רישום לוג
  addActivityLog('Admin', 'Update', 'Employee', code);

  return employee;
};

// ✅ מחק עובד לפי קוד עם רישום לוג
export const deleteEmployee = (code: string): boolean => {
  const initialLength = employees.length;
  employees = employees.filter(emp => emp.code !== code);
  const deleted = employees.length < initialLength;

  if (deleted) {
    console.log(`🗑️ Employee with code ${code} deleted.`);
    // ✅ רישום לוג
    addActivityLog('Admin', 'Delete', 'Employee', code);
  } else {
    console.warn(`⚠️ Employee with code ${code} not found.`);
  }

  return deleted;
};
