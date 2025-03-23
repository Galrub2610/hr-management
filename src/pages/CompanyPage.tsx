// src/pages/CompanyPage.tsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';
import styles from './CompanyPage.module.css';

interface Company {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  // הוסף שדות נוספים לפי הצורך
}

export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCompanies = async () => {
    try {
      const companiesRef = collection(db, 'companies');
      const snapshot = await getDocs(companiesRef);
      
      if (snapshot.empty) {
        setCompanies([]);
        return;
      }

      const companiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Company[];

      setCompanies(companiesData);
      
    } catch (error) {
      console.error('❌ Failed to fetch companies:', error);
      toast.error('שגיאה בטעינת החברות');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCompanies();
  }, []);

  const generateUniqueCompanyCode = (): string => {
    const existingCodes = companies.map(c => parseInt(c.id));
    let newCode = 10; // Starting from 10 to ensure 2 digits
    
    while (existingCodes.includes(newCode) && newCode < 100) {
      newCode++;
    }
    
    if (newCode >= 100) {
      throw new Error("לא ניתן ליצור קוד חברה חדש - כל הקודים תפוסים");
    }
    
    return newCode.toString();
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("נא להזין שם חברה");
      return;
    }

    try {
      const newCompanyCode = generateUniqueCompanyCode();
      const companiesRef = collection(db, 'companies');
      
      // שמירה ב-Firestore
      const docRef = await addDoc(companiesRef, {
        id: newCompanyCode,
        name: formData.name,
        createdAt: new Date().toISOString()
      });

      // עדכון ה-state המקומי
      setCompanies(prevCompanies => [...prevCompanies, {
        id: newCompanyCode,
        name: formData.name
      }]);

      toast.success("החברה נוספה בהצלחה!");
      handleFormClose();
    } catch (error) {
      console.error("❌ Create company failed:", error);
      toast.error("שגיאה ביצירת החברה");
    }
  };

  const handleUpdate = async (company: Company) => {
    const newName = prompt("הכנס שם חברה חדש:", company.name)?.trim();

    if (newName) {
      try {
        // עדכון ב-Firestore
        const companyRef = doc(db, 'companies', company.id);
        await updateDoc(companyRef, {
          name: newName,
          updatedAt: new Date().toISOString()
        });

        // עדכון ה-state המקומי
        const updatedCompanies = companies.map(c =>
          c.id === company.id ? { ...c, name: newName } : c
        );
        setCompanies(updatedCompanies);
        
        toast.success("החברה עודכנה בהצלחה!");
      } catch (error) {
        console.error("❌ Update company failed:", error);
        toast.error("שגיאה בעדכון החברה");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("האם אתה בטוח שברצונך למחוק את החברה?")) {
      try {
        // מחיקה מ-Firestore
        const companyRef = doc(db, 'companies', id);
        await deleteDoc(companyRef);

        // עדכון ה-state המקומי
        const updatedCompanies = companies.filter(c => c.id !== id);
        setCompanies(updatedCompanies);
        
        toast.success("החברה נמחקה בהצלחה");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading-spinner">טוען חברות...</div>
      </div>
    );
  }

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
          <h2>טבלת ניהול חברות (companiesManagementTableTitle)</h2>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>קוד חברה (companyCode)</th>
                <th>שם החברה (companyName)</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>{company.id}</td>
                  <td>{company.name}</td>
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
                        onClick={() => handleDelete(company.id)}
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
