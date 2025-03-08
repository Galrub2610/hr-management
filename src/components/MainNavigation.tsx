import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { ROUTES } from '../config/constants';

const navigationItems = [
  { name: 'לוח בקרה', href: ROUTES.DASHBOARD },
  { name: 'מאגרי נתונים', href: ROUTES.DATABASE },
  { name: 'עובדים', href: ROUTES.EMPLOYEES },
  { name: 'יומן פעילות', href: ROUTES.ACTIVITY_LOG },
  { name: 'דוחות', href: ROUTES.REPORTS },
  { name: 'דוח הכנסות', href: ROUTES.INCOME_REPORT },
];

export const MainNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="HR Management"
              />
            </div>
            <div className="hidden sm:flex sm:gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'menu-item',
                    location.pathname === item.href && 'active'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* תפריט ניווט */}
          </div>
        </div>
      </div>
    </nav>
  );
}; 