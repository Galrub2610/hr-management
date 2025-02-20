import { Card, CardContent } from "../components/ui/Card"; // ✅ תיקון הנתיב
import { LucideIcon } from "lucide-react";

// ✅ הגדרת טיפוסים לפרופס
interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string; // ✅ צבע מותאם לאייקון (ברירת מחדל: כחול)
}

export function StatCard({ title, value, icon: Icon, iconColor = "text-blue-500" }: StatCardProps) {
  console.log("📊 StatCard Rendered:", { title, value, iconColor });

  return (
    <Card className="p-6 shadow-lg rounded-2xl bg-white">
      <CardContent className="flex items-center gap-4">
        <Icon className={`w-12 h-12 ${iconColor}`} /> {/* ✅ שימוש בצבע דינמי */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
