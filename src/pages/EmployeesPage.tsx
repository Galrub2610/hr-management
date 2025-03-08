// src/pages/EmployeesPage.tsx
import { useState, useEffect } from 'react';
import {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} from '../services/EmployeeService';
import { getAllLocations } from '../services/LocationService'; // ✅ הוספנו רשימת מקומות
import { toast } from 'react-toastify';
import { Employee } from '../types/models';
import styles from './EmployeesPage.module.css';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locations, setLocations] = useState<{ code: string; address: string }[]>([]);
  const [form, setForm] = useState({ 
    fullName: '', 
    phone: '',
    workPermit: true,
    city: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ טעינת עובדים ומקומות
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const emps = getAllEmployees();
        const locs = getAllLocations();
        console.log("📊 Loaded employees:", emps);
        console.log("📍 Loaded locations:", locs);
        setEmployees(emps);
        setLocations(locs.map(loc => ({
          code: loc.code,
          address: `${loc.street} ${loc.streetNumber}, ${loc.city}`
        })));
      } catch (error) {
        console.error("❌ Failed to load employees or locations:", error);
        toast.error("❌ Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // ✅ רענון הטבלה
  const refreshEmployees = () => {
    const data = getAllEmployees();
    console.log("🔄 Refreshed employees:", data);
    setEmployees(data);
  };

  // ✅ בדיקות תקינות קלט
  const validateForm = () => {
    if (form.fullName.trim() === '') {
      toast.error("❌ Name cannot be empty.");
      return false;
    }
    if (form.phone && !/^\d+$/.test(form.phone)) {
      toast.error("❌ Phone number must contain only digits.");
      return false;
    }
    return true;
  };

  // ✅ צור עובד חדש
  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const newEmployee = createEmployee(form);
      console.log("✅ Created employee:", newEmployee);
      toast.success("✅ Employee created successfully!");
      refreshEmployees();
      setForm({ 
        fullName: '', 
        phone: '',
        workPermit: true,
        city: ''
      });
    } catch (error) {
      console.error("❌ Create employee failed:", error);
      toast.error("❌ Failed to create employee.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ עדכן עובד
  const handleUpdate = async (code: string) => {
    const current = employees.find(emp => emp.code === code);
    if (!current) {
      toast.error("❌ Employee not found.");
      return;
    }

    const newName = prompt("Enter new name:", current.fullName);
    const newPhone = prompt("Enter new phone:", current.phone || '');
    const newCity = prompt("Enter new city:", current.city || '');

    if (newName && newPhone && newCity) {
      setIsLoading(true);
      try {
        const updatedEmployee = updateEmployee(code, {
          fullName: newName,
          phone: newPhone,
          city: newCity,
          workPermit: current.workPermit
        });
        if (updatedEmployee) {
          console.log("🔄 Updated employee:", updatedEmployee);
          toast.success("✅ Employee updated!");
          refreshEmployees();
        }
      } catch (error) {
        console.error("❌ Update employee failed:", error);
        toast.error("❌ Failed to update employee.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ✅ מחק עובד
  const handleDelete = async (code: string) => {
    if (confirm(`Are you sure you want to delete employee with code ${code}?`)) {
      setIsLoading(true);
      try {
        const success = deleteEmployee(code);
        if (success) {
          console.log(`🗑️ Deleted employee with code ${code}`);
          toast.info("✅ Employee deleted.");
          refreshEmployees();
        } else {
          toast.error("❌ Employee not found.");
        }
      } catch (error) {
        console.error("❌ Delete employee failed:", error);
        toast.error("❌ Failed to delete employee.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate();
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerTitle}>
        <h1>ניהול עובדים</h1>
      </div>

      <div className={styles.addButtonWrapper}>
        <button 
          type="button"
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
        >
          הוסף עובד חדש
        </button>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <form onSubmit={handleFormSubmit} className={styles.form}>
              <h2>הוספת עובד חדש</h2>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  שם מלא
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="הכנס שם מלא"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  מספר טלפון
                  <input
                    type="tel"
                    className={styles.input}
                    placeholder="הכנס מספר טלפון"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  אישור עבודה
                  <select
                    className={styles.input}
                    value={form.workPermit ? "true" : "false"}
                    onChange={(e) => setForm({ ...form, workPermit: e.target.value === "true" })}
                  >
                    <option value="true">כן</option>
                    <option value="false">לא</option>
                  </select>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  עיר מגורים
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="הכנס עיר מגורים"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </label>
              </div>

              <div className={styles.formButtons}>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  צור עובד
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* טבלת עובדים */}
      <section className={styles.tableSection}>
        <div className={styles.tableContainer}>
          <div className={styles.tableTitleWrapper}>
            <h2>טבלת ניהול עובדים (employeesDataTable)</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
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
                {employees.map((emp) => (
                  <tr key={emp.code}>
                    <td className={styles.tableCell}>{emp.code}</td>
                    <td className={styles.tableCell}>{emp.fullName}</td>
                    <td className={styles.tableCell}>{emp.phone || '-'}</td>
                    <td className={styles.tableCell}>{emp.workPermit ? 'כן' : 'לא'}</td>
                    <td className={styles.tableCell}>{emp.city || '-'}</td>
                    <td className={styles.actionCell}>
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => handleUpdate(emp.code)}
                        disabled={isLoading}
                      >
                        ערוך
                      </button>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => handleDelete(emp.code)}
                        disabled={isLoading}
                      >
                        מחק
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
