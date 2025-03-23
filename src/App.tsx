import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
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
import { ROUTES } from './constants/routes';
import './styles/global.css';

const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner">טוען...</div>
  </div>
);

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    errorElement: <Navigate to={ROUTES.HOME} replace />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        errorElement: <div>שגיאה בטעינת דף הבית</div>
      },
      {
        path: 'database',
        element: <DatabaseManagementPage />,
        errorElement: <div>שגיאה בטעינת ניהול מסד נתונים</div>,
        children: [
          {
            path: 'cities',
            element: <CitiesManagement />,
            errorElement: <div>שגיאה בטעינת ניהול ערים</div>
          },
          {
            path: 'companies',
            element: <CompanyPage />
          },
          {
            path: 'locations',
            element: <LocationsPage />
          },
          {
            path: 'employees',
            element: <EmployeeManagement />
          }
        ]
      },
      {
        path: 'months',
        element: <MonthsPage />
      },
      {
        path: 'reports',
        element: <ReportsPage />
      },
      {
        path: 'activity-log',
        element: <ActivityLogPage />
      },
      {
        path: 'income-report',
        element: <IncomeReportPage />
      },
      {
        path: '*',
        element: <DashboardPage />
      }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider 
          router={router} 
          fallbackElement={<LoadingFallback />}
        />
        <ToastContainer 
          position="top-right" 
          rtl 
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          limit={3}
          icon={true}
          closeButton={true}
          toastClassName="toast-custom"
        />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
