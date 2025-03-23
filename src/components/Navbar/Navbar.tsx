import React from 'react';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        HR Management
      </div>
      <div className={styles.userSection}>
        {/* Add user-related content here */}
      </div>
    </nav>
  );
};

export default Navbar; 