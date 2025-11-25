import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
        <CardDescription>
          Detailed analysis and historical reports will be available here.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-96">
        <BarChart2 className="h-16 w-16 mb-4" />
        <p className="text-lg font-semibold">Coming Soon</p>
        <p>This feature is under development.</p>
      </CardContent>
    </Card>
  );
}
