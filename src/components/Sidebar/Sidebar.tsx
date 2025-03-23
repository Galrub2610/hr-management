// במקום לייבא מ-App.tsx
// import { ROUTES } from '../../App';

// נייבא מהקובץ החדש
import { ROUTES } from '../../constants/routes'; 

import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <NavLink 
          to={ROUTES.HOME}
          className={({ isActive }) => 
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
          end
        >
          דף הבית
        </NavLink>
        <NavLink 
          to={ROUTES.DATABASE}
          className={({ isActive }) => 
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          ניהול מסד נתונים
        </NavLink>
        <NavLink 
          to={ROUTES.MONTHS}
          className={({ isActive }) => 
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          חודשים
        </NavLink>
        <NavLink 
          to={ROUTES.REPORTS}
          className={({ isActive }) => 
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          דוחות
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar; 