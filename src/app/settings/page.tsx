import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage your account, notification preferences, and API keys.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-96">
        <SettingsIcon className="h-16 w-16 mb-4" />
        <p className="text-lg font-semibold">Coming Soon</p>
        <p>This feature is under development.</p>
      </CardContent>
    </Card>
  );
}
