
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CompanyPage from './pages/CompanyPage';
import LocationsPage from './pages/LocationsPage';
import EmployeesPage from './pages/EmployeesPage';
import ActivityLogPage from './pages/ActivityLogPage';
import LoginPage from './pages/LoginPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';

// ✅ ניווט עליון נוסף:
function Navbar() {
  return (
    <nav className="mb-6 space-x-4">
      <Link className="text-blue-500" to="/dashboard">Dashboard</Link>
      <Link className="text-blue-500" to="/companies">Companies</Link>
      <Link className="text-green-500" to="/locations">Locations</Link>
      <Link className="text-purple-500" to="/employees">Employees</Link>
      <Link className="text-gray-500" to="/activity-log">Activity Log</Link>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <ToastContainer />
      <div className="p-4">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/activity-log" element={<ProtectedRoute><ActivityLogPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/2fa" element={<VerifyOtpPage />} />
          <Route path="/companies" element={<ProtectedRoute><CompanyPage /></ProtectedRoute>} />
          <Route path="/locations" element={<ProtectedRoute><LocationsPage /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}