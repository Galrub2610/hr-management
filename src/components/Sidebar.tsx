import { Link, useLocation } from "react-router-dom";
import { Home, Building, MapPin, Users, FileText, BarChart, X as CloseIcon, Database, Calendar } from "lucide-react";
import { useState } from "react";
import { ROUTES } from '../App';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>("database");

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: ROUTES.HOME, icon: Home, label: "לוח בקרה" },
    { path: ROUTES.LOCATIONS, icon: MapPin, label: "מקומות" },
    { path: ROUTES.EMPLOYEES, icon: Users, label: "עובדים" },
    { path: ROUTES.ACTIVITY_LOG, icon: FileText, label: "לוג פעילות" },
    { path: ROUTES.REPORTS, icon: BarChart, label: "דוחות" },
  ];

  const databaseSection = {
    id: "database",
    label: "ניהול מסד נתונים",
    icon: Database,
    subItems: [
      {
        path: ROUTES.CITIES,
        icon: Building,
        label: "ערים"
      },
      {
        path: ROUTES.COMPANIES,
        icon: Building,
        label: "חברות"
      },
      {
        path: ROUTES.LOCATIONS,
        icon: MapPin,
        label: "מיקומים"
      },
      {
        path: ROUTES.EMPLOYEES,
        icon: Users,
        label: "עובדים"
      },
      {
        path: ROUTES.MONTHS,
        icon: Calendar,
        label: "חודשי השנה"
      }
    ]
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 right-4 z-50 p-2 bg-white rounded-md shadow-lg hover:bg-gray-50"
        >
          <span className="sr-only">פתח תפריט</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      <nav className={`sidebar transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="sidebar-header">
          <h2>ניהול מערכת</h2>
          <button 
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
            aria-label="סגור תפריט"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="menu-item-icon">
                  <item.icon className="w-5 h-5" />
                </span>
                <span className="menu-item-text">{item.label}</span>
              </Link>
            ))}

            {/* Database Management Section */}
            <div className="menu-section">
              <button
                onClick={() => toggleSection(databaseSection.id)}
                className={`menu-item ${expandedSection === databaseSection.id ? 'active' : ''}`}
              >
                <span className="menu-item-icon">
                  <Database className="w-5 h-5" />
                </span>
                <span className="menu-item-text">{databaseSection.label}</span>
              </button>
              
              {expandedSection === databaseSection.id && (
                <div className="submenu">
                  {databaseSection.subItems.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`submenu-item ${isActive(subItem.path) ? 'active' : ''}`}
                    >
                      <span className="menu-item-icon">
                        <subItem.icon className="w-5 h-5" />
                      </span>
                      <span className="menu-item-text">{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
