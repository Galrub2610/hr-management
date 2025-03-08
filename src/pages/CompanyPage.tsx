// src/pages/CompanyPage.tsx
import { useState, useEffect } from "react";
import {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../services/CompanyService";
import { toast } from "react-toastify";
import styles from './CompanyPage.module.css';

interface Company {
  code: string;
  name: string;
  createdAt: Date;
}

export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  useEffect(() => {
    refreshCompanies();
  }, []);

  const refreshCompanies = () => {
    try {
      const data = getAllCompanies();
      console.log("🔄 Refreshed companies:", data);
      setCompanies([...data]);
    } catch (error) {
      console.error("❌ Failed to fetch companies:", error);
      toast.error("שגיאה בטעינת החברות");
    }
  };

  const generateUniqueCompanyCode = (): string => {
    const existingCodes = companies.map(c => parseInt(c.code));
    let newCode = 10; // Starting from 10 to ensure 2 digits
    
    while (existingCodes.includes(newCode) && newCode < 100) {
      newCode++;
    }
    
    if (newCode >= 100) {
      throw new Error("לא ניתן ליצור קוד חברה חדש - כל הקודים תפוסים");
    }
    
    return newCode.toString();
  };

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error("נא להזין שם חברה");
      return;
    }

    try {
      const newCompanyCode = generateUniqueCompanyCode();
      createCompany({
        code: newCompanyCode,
        name: formData.name,
        createdAt: new Date(),
      });
      toast.success("החברה נוספה בהצלחה!");
      refreshCompanies();
      handleFormClose();
    } catch (error) {
      console.error("❌ Create company failed:", error);
      toast.error("שגיאה ביצירת החברה");
    }
  };

  const handleUpdate = (company: Company) => {
    const newName = prompt("הכנס שם חברה חדש:", company.name)?.trim();

    if (newName) {
      try {
        updateCompany(company.code, { name: newName });
        toast.success("החברה עודכנה בהצלחה!");
        refreshCompanies();
      } catch (error) {
        console.error("❌ Update company failed:", error);
        toast.error("שגיאה בעדכון החברה");
      }
    }
  };

  const handleDelete = (code: string) => {
    if (confirm("האם אתה בטוח שברצונך למחוק את החברה?")) {
      try {
        deleteCompany(code);
        toast.success("החברה נמחקה בהצלחה");
        refreshCompanies();
      } catch (error) {
        console.error("❌ Delete company failed:", error);
        toast.error("שגיאה במחיקת החברה");
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setFormData({ name: "" });
    setEditingCompany(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>ניהול חברות (companiesManagement)</h1>
        <button 
          onClick={() => setIsFormOpen(true)} 
          className={styles.addButton}
        >
          הוסף חברה חדשה
        </button>
      </header>

      {isFormOpen && (
        <div className={styles.formOverlay} onClick={(e) => {
          if (e.target === e.currentTarget) handleFormClose();
        }}>
          <div className={styles.formContainer}>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }} className={styles.form}>
              <h2>הוסף חברה חדשה</h2>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  שם החברה:
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    className={styles.input}
                    placeholder="הכנס שם חברה"
                    data-variable-name="companyNameInput"
                  />
                </label>
              </div>

              <div className={styles.formButtons}>
                <button 
                  type="button" 
                  onClick={handleFormClose}
                  className={styles.cancelButton}
                >
                  ביטול
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                >
                  {editingCompany ? 'עדכן חברה' : 'צור חברה'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2>טבלת ניהול חברות (companiesManagementTable)</h2>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>קוד חברה (companyCode)</th>
                <th>שם החברה (companyName)</th>
                <th>תאריך יצירה</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.code}>
                  <td>{company.code}</td>
                  <td>{company.name}</td>
                  <td>{new Date(company.createdAt).toLocaleDateString('he-IL')}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleUpdate(company)}
                      >
                        ערוך
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(company.code)}
                      >
                        מחק
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.emptyState}>
                    לא נמצאו חברות במערכת
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
