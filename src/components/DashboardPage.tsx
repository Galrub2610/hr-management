import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { StatCard } from "../components/StatCard";
import { Users, Building, MapPin } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 grid grid-cols-3 gap-4">
          <StatCard title="חברות" value={15} icon={Building} />
          <StatCard title="עובדים" value={120} icon={Users} />
          <StatCard title="מקומות" value={8} icon={MapPin} />
        </main>
      </div>
    </div>
  );
}