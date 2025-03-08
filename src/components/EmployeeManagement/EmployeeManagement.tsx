import React, { useState, useEffect } from 'react';
import { Employee } from '../../types/models';
import { CreateEmployeeDto, getAllEmployees, createEmployee, deleteEmployee, updateEmployee } from '../../services/EmployeeService';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import styles from './EmployeeManagement.module.css';

// רשימת הערים המוגדרת מראש
const CITIES = [
  "תל אביב",
  "הרצליה",
  "רעננה",
  "כפר סבא",
  "נתניה",
  "חדרה",
  "ראש העין",
  "שוהם",
  "קריית אונו",
  "פתח תקווה",
  "גני תקווה",
  "אשדוד",
  "באר שבע",
  "רמת השרון",
  "הוד השרון",
  "לוד",
  "רמלה"
];

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<CreateEmployeeDto>({
    fullName: '',
    phone: '',
    workPermit: false,
    city: ''
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    try {
      const data = getAllEmployees();
      console.log("נטענו עובדים:", data);
      setEmployees(data);
    } catch (error) {
      showErrorToast('שגיאה בטעינת העובדים');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'select-one' && name === 'workPermit' ? value === 'true' : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        // עדכון עובד קיים
        const updatedEmployee = updateEmployee(editingEmployee.code, formData);
        if (updatedEmployee) {
          setEmployees(getAllEmployees());
          showSuccessToast('העובד עודכן בהצלחה');
        }
      } else {
        // יצירת עובד חדש
        const newEmployee = createEmployee(formData);
        setEmployees(getAllEmployees());
        showSuccessToast('העובד נוסף בהצלחה');
      }
      handleFormClose();
    } catch (error) {
      if (error instanceof Error) {
        showErrorToast(error.message);
      } else {
        showErrorToast('שגיאה בשמירת העובד');
      }
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      fullName: employee.fullName,
      phone: employee.phone || '',
      workPermit: employee.workPermit,
      city: employee.city || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = (code: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק עובד זה?')) {
      try {
        const success = deleteEmployee(code);
        if (success) {
          setEmployees(getAllEmployees());
          showSuccessToast('העובד נמחק בהצלחה');
        } else {
          showErrorToast('לא ניתן למחוק את העובד');
        }
      } catch (error) {
        showErrorToast('שגיאה במחיקת העובד');
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
    setFormData({
      fullName: '',
      phone: '',
      workPermit: false,
      city: ''
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>ניהול עובדים</h1>
        <button 
          className={styles.addButton}
          onClick={() => setIsFormOpen(true)}
          data-variable-name="addNewEmployeeButton"
        >
          הוספת עובד חדש
        </button>
      </header>

      {isFormOpen && (
        <div className={styles.formOverlay} onClick={(e) => {
          if (e.target === e.currentTarget) handleFormClose();
        }}>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h2>{editingEmployee ? 'עריכת עובד' : 'הוספת עובד חדש'}</h2>
              
              <div className="form-group">
                <label className="form-label">
                  שם מלא *
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="הכנס שם מלא"
                    data-variable-name="employeeNameInput"
                  />
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">
                  טלפון
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    pattern="[0-9]*"
                    className={styles.input}
                    placeholder="הכנס מספר טלפון"
                    data-variable-name="employeePhoneInput"
                  />
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">
                  אישור עבודה
                  <select
                    name="workPermit"
                    value={formData.workPermit.toString()}
                    onChange={handleInputChange}
                    className={styles.select}
                    data-variable-name="employeeWorkPermitInput"
                  >
                    <option value="false">לא</option>
                    <option value="true">כן</option>
                  </select>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">
                  עיר מגורים
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={styles.select}
                    data-variable-name="employeeCityInput"
                  >
                    <option value="">בחר עיר</option>
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className={styles.formButtons}>
                <button 
                  type="button" 
                  onClick={handleFormClose}
                  className={styles.cancelButton}
                  data-variable-name="cancelButton"
                >
                  ביטול
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  data-variable-name="saveEmployeeButton"
                >
                  {editingEmployee ? 'עדכן עובד' : 'צור עובד'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2>טבלת ניהול עובדים (employeesManagementTable)</h2>
        </div>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>קוד עובד (employeeCode)</th>
                <th>שם מלא (fullName)</th>
                <th>מספר טלפון (phoneNumber)</th>
                <th>אישור עבודה (workPermit)</th>
                <th>עיר מגורים (city)</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.code}>
                  <td>{employee.code}</td>
                  <td>{employee.fullName}</td>
                  <td>{employee.phone || '-'}</td>
                  <td>{employee.workPermit ? 'כן' : 'לא'}</td>
                  <td>{employee.city || '-'}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(employee)}
                        data-variable-name="editEmployeeButton"
                      >
                        ערוך
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(employee.code)}
                        data-variable-name="deleteEmployeeButton"
                      >
                        מחק
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    <span>לא נמצאו עובדים במערכת</span>
                    <span data-variable-name="noEmployeesMessage"></span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement; 