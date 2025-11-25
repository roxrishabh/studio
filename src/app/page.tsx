'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getSensors } from "@/lib/data";
import { Cpu, Bell, ShieldCheck } from "lucide-react";
import DashboardClient from "./dashboard-client";
import { useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import type { Alert } from "@/lib/types";
import { SeedDataButton } from "@/components/seed-data-button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const sensors = getSensors();
  const firestore = useFirestore();

  const alertsCollection = firestore ? collection(firestore, 'alerts') : null;
  const alertsQuery = alertsCollection ? query(alertsCollection, orderBy('timestamp', 'desc'), limit(5)) : null;

  const { data: alerts, loading } = useCollection<Alert>(alertsQuery);

  const activeAlerts = alerts ? alerts.filter(a => a.status === 'new').length : 0;

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
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Alerts</CardTitle>
            <SeedDataButton />
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
              {loading && Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                </TableRow>
              ))}
              {!loading && alerts?.map((alert) => (
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
               {!loading && (!alerts || alerts.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No recent alerts. Click "Seed Data" to add some to Firestore.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
