import { useState, useEffect } from 'react';
import { Company } from '../types/company.types';
import { getAllCompanies, createCompany, updateCompany, deleteCompany } from '../services/CompanyService';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import styles from './CompaniesPage.module.css';

const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Partial<Company> | null>(null);
  const [formData, setFormData] = useState({ code: '', name: '' });

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedCompanies = await getAllCompanies();
      console.log('Fetched companies:', fetchedCompanies);
      setCompanies(fetchedCompanies || []);
    } catch (error) {
      console.error('Error loading companies:', error);
      setError('שגיאה בטעינת החברות');
      showErrorToast('שגיאה בטעינת החברות');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({ code: company.code, name: company.name });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.code || !formData.name) {
        showErrorToast('נא למלא את כל השדות');
        return;
      }

      if (editingCompany?.id) {
        await updateCompany(editingCompany.id, formData);
        showSuccessToast('החברה עודכנה בהצלחה');
      } else {
        await createCompany(formData);
        showSuccessToast('החברה נוצרה בהצלחה');
      }

      handleCloseModal();
      await loadCompanies();
    } catch (error) {
      console.error('Error submitting company:', error);
      showErrorToast('שגיאה בשמירת החברה');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק חברה זו?')) {
      try {
        await deleteCompany(id);
        showSuccessToast('החברה נמחקה בהצלחה');
        await loadCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
        showErrorToast('שגיאה במחיקת החברה');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
    setFormData({ code: '', name: '' });
  };

  if (isLoading) {
    return <div className={styles.loading}>טוען...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={loadCompanies}>נסה שוב</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>ניהול חברות</h1>
        <button 
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          הוסף חברה חדשה
        </button>
      </div>

      {companies.length === 0 ? (
        <div className={styles.emptyState}>
          <p>אין חברות להצגה</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>קוד</th>
                <th>שם</th>
                <th>תאריך יצירה</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>{company.code}</td>
                  <td>{company.name}</td>
                  <td>{new Date(company.createdAt).toLocaleDateString('he-IL')}</td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(company)}
                    >
                      ערוך
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => company.id && handleDelete(company.id)}
                    >
                      מחק
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{editingCompany ? 'עריכת חברה' : 'הוספת חברה חדשה'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="code">קוד חברה:</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="name">שם חברה:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingCompany ? 'עדכן' : 'הוסף'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={handleCloseModal}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage; 