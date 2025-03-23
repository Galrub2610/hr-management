import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { Sidebar } from '../components/Sidebar/Sidebar';
import styles from './MainLayout.module.css';

export function MainLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
} 