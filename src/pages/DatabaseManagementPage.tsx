import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import styles from './DatabaseManagementPage.module.css';

const DatabaseManagementPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>ניהול מסד נתונים</h1>
      <div className={styles.navigation}>
        <NavLink 
          to={ROUTES.CITIES}
          className={({ isActive }) => 
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          ניהול ערים
        </NavLink>
        <NavLink 
          to={ROUTES.COMPANIES}
          className={({ isActive }) => 
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          ניהול חברות
        </NavLink>
        <NavLink 
          to={ROUTES.LOCATIONS}
          className={({ isActive }) => 
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          ניהול מיקומים
        </NavLink>
        <NavLink 
          to={ROUTES.EMPLOYEES}
          className={({ isActive }) => 
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          ניהול עובדים
        </NavLink>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default DatabaseManagementPage; 