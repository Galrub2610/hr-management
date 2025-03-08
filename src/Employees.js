import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './config/firebase';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        console.log('מתחיל לטעון נתוני עובדים...');
        const employeesRef = collection(db, 'employees');
        const q = query(employeesRef, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log('אין עובדים בדאטהבייס');
          setEmployees([]);
        } else {
          const employeesList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log('נטענו ${employeesList.length} עובדים:', employeesList);
          setEmployees(employeesList);
        }
      } catch (err) {
        console.error('שגיאה בטעינת נתוני עובדים:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">טוען נתונים...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">
          שגיאה בטעינת נתונים: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 rtl">
      <h1 className="text-3xl font-bold mb-6 text-right">ניהול עובדים</h1>
      
      {employees.length === 0 ? (
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <p className="text-xl">לא נמצאו עובדים במערכת</p>
          <button 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => console.log('להוסיף עובד חדש')}
          >
            הוסף עובד חדש
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((employee) => (
            <div key={employee.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold mb-2">{employee.name}</h2>
              {employee.email && (
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">אימייל:</span> {employee.email}
                </p>
              )}
              {employee.phone && (
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">טלפון:</span> {employee.phone}
                </p>
              )}
              {employee.position && (
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">תפקיד:</span> {employee.position}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Employees; 