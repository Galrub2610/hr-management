import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MainLayout } from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import DatabaseManagementPage from './pages/DatabaseManagementPage';
import CitiesManagement from './pages/CitiesManagement';
import CompanyPage from './pages/CompanyPage';
import LocationsPage from './pages/LocationsPage';
import EmployeeManagement from './components/EmployeeManagement/EmployeeManagement';
import ActivityLogPage from './pages/ActivityLogPage';
import ReportsPage from './pages/ReportsPage';
import IncomeReportPage from './pages/IncomeReportPage';
import ErrorBoundary from './components/ErrorBoundary';
import MonthsPage from './pages/MonthsPage';
import './styles/global.css';

// קבועים של נתיבים
export const ROUTES = {
  HOME: '/',
  DATABASE: '/database',
  CITIES: '/database/cities',
  COMPANIES: '/database/companies',
  LOCATIONS: '/database/locations',
  EMPLOYEES: '/database/employees',
  MONTHS: '/database/months',
  REPORTS: '/reports',
  ACTIVITY_LOG: '/activity-log'
} as const;

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>טוען...</div>}>
        <div className="app">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path={ROUTES.DATABASE}>
                <Route index element={<DatabaseManagementPage />} />
                <Route path="cities" element={<CitiesManagement />} />
                <Route path="companies" element={<CompanyPage />} />
                <Route path="locations" element={<LocationsPage />} />
                <Route path="employees" element={<EmployeeManagement />} />
                <Route path="months" element={<MonthsPage />} />
              </Route>
              <Route path={ROUTES.ACTIVITY_LOG} element={<ActivityLogPage />} />
              <Route path={ROUTES.REPORTS}>
                <Route index element={<ReportsPage />} />
                <Route path="income" element={<IncomeReportPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
