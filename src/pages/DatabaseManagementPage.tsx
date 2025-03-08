import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../App';

const DatabaseManagementPage: React.FC = () => {
  const sections = [
    { path: 'cities', label: 'ניהול ערים' },
    { path: 'companies', label: 'ניהול חברות' },
    { path: 'locations', label: 'ניהול מיקומים' },
    { path: 'employees', label: 'ניהול עובדים' }
  ];

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold">ניהול מסד נתונים</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <Link
            key={section.path}
            to={`${ROUTES.DATABASE}/${section.path}`}
            className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105"
          >
            <h2 className="text-xl font-semibold">{section.label}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DatabaseManagementPage; 