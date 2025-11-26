"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import type { Sensor, Alert } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = {
  online: 'hsl(var(--chart-2))',
  offline: 'hsl(var(--muted-foreground))',
  alert: 'hsl(var(--chart-5))',
};

export default function DashboardClient({ sensors, alerts, loadingAlerts }: { sensors: Sensor[], alerts: Alert[] | null, loadingAlerts: boolean }) {
  const statusData = useMemo(() => {
    const counts = sensors.reduce((acc, sensor) => {
      acc[sensor.status] = (acc[sensor.status] || 0) + 1;
      return acc;
    }, {} as Record<Sensor['status'], number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sensors]);

  const alertHistogramData = useMemo(() => {
    if (!alerts) return [];
    
    const alertCounts = alerts.reduce((acc, alert) => {
      const sensorName = sensors.find(s => s.id === alert.sensorId)?.name || alert.sensorId;
      acc[sensorName] = (acc[sensorName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(alertCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count); // Sort descending

  }, [alerts, sensors]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Sensor Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-5">
        <CardHeader>
          <CardTitle>Alerts per Sensor</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAlerts && <Skeleton className="w-full h-[250px]" />}
          {!loadingAlerts && (
            <ResponsiveContainer width="100%" height={250}>
              {alertHistogramData.length > 0 ? (
                <BarChart data={alertHistogramData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Bar dataKey="count" name="Alerts" fill="hsl(var(--primary))" />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No alert data to display.
                </div>
              )}
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
