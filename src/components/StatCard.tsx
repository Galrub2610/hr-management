import { Card, CardContent } from "@/components/ui/card";
export function StatCard({ title, value, icon: Icon }) {
  return (
    <Card className="p-4 shadow-lg rounded-2xl">
      <CardContent className="flex items-center gap-4">
        <Icon className="w-10 h-10 text-blue-500" />
        <div>
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}