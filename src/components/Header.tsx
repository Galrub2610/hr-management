import { useNavigate } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* ✅ כותרת ממורכזת */}
      <h1 className="text-xl font-bold text-gray-700 w-full text-center">
        📊 ניהול כוח אדם
      </h1>
    </header>
  );
}
