// src/tests/employeeTest.ts
import { createEmployee, getAllEmployees, updateEmployee, deleteEmployee } from '../services/EmployeeService';

// בדיקה: יצירת עובד
const employee = createEmployee({
  code: '001',
  name: 'John Doe',
  locationId: '00001',
  createdAt: new Date(),
  updatedAt: new Date(),
});
console.log('Employee Created:', employee);

// בדיקה: קריאת כל העובדים
console.log('All Employees:', getAllEmployees());

// בדיקה: עדכון עובד
const updatedEmployee = updateEmployee('001', { name: 'John Smith' });
console.log('Employee Updated:', updatedEmployee);

// בדיקה: מחיקת עובד
const deleted = deleteEmployee('001');
console.log('Employee Deleted:', deleted);

// בדיקה: קריאה אחרי מחיקה
console.log('All Employees After Deletion:', getAllEmployees());
