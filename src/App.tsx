import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CompanyPage from "./pages/CompanyPage";
import LocationsPage from "./pages/LocationsPage";
import EmployeesPage from "./pages/EmployeesPage";
import ActivityLogPage from "./pages/ActivityLogPage";
import ReportsPage from "./pages/ReportsPage";
import IncomeReportPage from "./pages/IncomeReportPage";
import LoginPage from "./pages/LoginPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import LocationManagement from './components/LocationManagement';
import './App.css';

function MainNavigation() {
  return (
    <nav className="main-nav glass">
      <Link to="/dashboard" className="nav-link hover-lift">לוח בקרה</Link>
      <Link to="/companies" className="nav-link hover-lift">חברות</Link>
      <Link to="/locations" className="nav-link hover-lift">מיקומים</Link>
      <Link to="/employees" className="nav-link hover-lift">עובדים</Link>
      <Link to="/activity-log" className="nav-link hover-lift">יומן פעילות</Link>
      <Link to="/reports" className="nav-link hover-lift">דוחות</Link>
      <Link to="/income-report" className="nav-link hover-lift">דוח הכנסות</Link>
    </nav>
  );
}

function HomePage() {
  return (
    <div className="home-container card">
      <h1>מערכת ניהול משאבי אנוש</h1>
      <p className="subtitle">ברוכים הבאים למערכת הניהול המתקדמת</p>
      
      <div className="features-grid">
        <div className="feature-card glass hover-scale">
          <h3>ניהול עובדים</h3>
          <p>ניהול מידע, משכורות ונוכחות של עובדים</p>
        </div>
        
        <div className="feature-card glass hover-scale">
          <h3>ניהול חברות</h3>
          <p>ניהול מידע ופרטי החברות במערכת</p>
        </div>
        
        <div className="feature-card glass hover-scale">
          <h3>ניהול מיקומים</h3>
          <p>ניהול מיקומי העבודה והסניפים</p>
        </div>
        
        <div className="feature-card glass hover-scale">
          <h3>דוחות ואנליטיקה</h3>
          <p>צפייה והפקת דוחות מתקדמים</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container fade-in">
          <MainNavigation />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verify-otp" element={<VerifyOtpPage />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/companies" element={
                <ProtectedRoute>
                  <CompanyPage />
                </ProtectedRoute>
              } />
              
              <Route path="/locations/*" element={
                <ProtectedRoute>
                  <LocationManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/employees" element={
                <ProtectedRoute>
                  <EmployeesPage />
                </ProtectedRoute>
              } />
              
              <Route path="/activity-log" element={
                <ProtectedRoute>
                  <ActivityLogPage />
                </ProtectedRoute>
              } />
              
              <Route path="/reports" element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/income-report" element={
                <ProtectedRoute>
                  <IncomeReportPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>

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
            theme="light"
            className="toast-container"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
