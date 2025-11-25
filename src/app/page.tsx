import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getSensors, getAlerts } from "@/lib/data";
import { Cpu, Bell, ShieldCheck, MapPin } from "lucide-react";
import DashboardClient from "./dashboard-client";

export default function DashboardPage() {
  const sensors = getSensors();
  const alerts = getAlerts();
  const activeAlerts = alerts.filter(a => a.status === 'new').length;

  const kpiData = [
    { title: "Total Sensors", value: sensors.length, icon: Cpu, color: "text-primary" },
    { title: "Active Alerts", value: activeAlerts, icon: Bell, color: "text-destructive" },
    { title: "System Health", value: "99.8%", icon: ShieldCheck, color: "text-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 text-muted-foreground ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DashboardClient sensors={sensors} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sensor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.slice(0, 5).map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.sensorId}</TableCell>
                  <TableCell>{alert.sensorType}</TableCell>
                  <TableCell>
                    <Badge variant={alert.severity === 'critical' || alert.severity === 'high' ? 'destructive' : 'default'}>
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
