import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white text-black p-4 shadow-md flex justify-between items-center">
      {/* לוגו */}
      <div className="text-xl font-bold">
        <Link to="/dashboard">ניהול כוח אדם</Link>
      </div>

      {/* ניווט */}
      <div className="space-x-4 rtl:space-x-reverse">
        <Link className="hover:text-gray-600" to="/dashboard">דאשבורד</Link>
        <Link className="hover:text-gray-600" to="/companies">חברות</Link>
        <Link className="hover:text-gray-600" to="/locations">מיקומים</Link>
        <Link className="hover:text-gray-600" to="/employees">עובדים</Link>
      </div>
    </nav>
  );
}
