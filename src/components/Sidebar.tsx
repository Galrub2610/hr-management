import { Link } from 'react-router-dom';
export function Sidebar() {
  return (
    <aside className="bg-gray-800 text-white w-64 h-screen p-4">
      <nav className="space-y-4">
        <Link to="/dashboard" className="block p-2 hover:bg-gray-700">דשבורד</Link>
        <Link to="/companies" className="block p-2 hover:bg-gray-700">חברות</Link>
        <Link to="/locations" className="block p-2 hover:bg-gray-700">מקומות</Link>
      </nav>
    </aside>
  );
}