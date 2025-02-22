import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CompanyPage from './pages/CompanyPage';
import LocationsPage from './pages/LocationsPage';
import EmployeesPage from './pages/EmployeesPage';
import ActivityLogPage from './pages/ActivityLogPage';
import ReportsPage from './pages/ReportsPage'; // ✅ נוסף - דף דוחות
import LoginPage from './pages/LoginPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext'; // ✅ שימוש באותנטיקציה

// ✅ ניווט עליון נוסף:
function Navbar() {
  return (
    <nav className="mb-6 space-x-4 flex justify-end"> {/* יישור לימין */}
      <Link className="text-blue-500 ml-4" to="/dashboard">דאשבורד</Link>
      <Link className="text-blue-500 ml-4" to="/companies">חברות</Link>
      <Link className="text-green-500 ml-4" to="/locations">מיקומים</Link>
      <Link className="text-purple-500 ml-4" to="/employees">עובדים</Link>
      <Link className="text-gray-500 ml-4" to="/activity-log">יומן פעילות</Link>
      <Link className="text-orange-500" to="/reports">דוחות</Link> {/* ✅ נוסף */}
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider> {/* ✅ עטיפת כל האפליקציה עם ניהול המשתמשים */}
      <Router>
        <ToastContainer position="top-center" autoClose={3000} rtl /> {/* ✅ תמיכה ב-RTL */}
        <div dir="rtl" className="p-4 bg-gray-100 min-h-screen"> {/* ✅ הוספת RTL לכל הדף */}
          <Navbar />
          <Routes>
            {/* ✅ נתיב ברירת מחדל לדף Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* ✅ מסכים מוגנים */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/activity-log" element={<ProtectedRoute><ActivityLogPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} /> {/* ✅ נוסף */}
            <Route path="/companies" element={<ProtectedRoute><CompanyPage /></ProtectedRoute>} />
            <Route path="/locations" element={<ProtectedRoute><LocationsPage /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />

            {/* ✅ מסכי התחברות ואימות */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/2fa" element={<VerifyOtpPage />} />

            {/* 🛑 דף ברירת מחדל למקרים של נתיב לא קיים */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
