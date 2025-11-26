"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import type { Sensor } from "@/lib/types";

const COLORS = {
  online: 'hsl(var(--chart-2))',
  offline: 'hsl(var(--muted-foreground))',
  alert: 'hsl(var(--chart-5))',
};

const getSensorDataForChart = (sensors: Sensor[]) => {
  const now = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const time = new Date(now.getTime() - (29 - i) * 60000); // last 30 minutes
    const activeSensors = sensors.filter(s => s.status === 'online').length;
    return {
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }),
      value: Math.floor(activeSensors * (0.9 + Math.random() * 0.15)), // simulate fluctuations
    };
  });
};

export default function DashboardClient({ sensors }: { sensors: Sensor[] }) {
  const statusData = useMemo(() => {
    const counts = sensors.reduce((acc, sensor) => {
      acc[sensor.status] = (acc[sensor.status] || 0) + 1;
      return acc;
    }, {} as Record<Sensor['status'], number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sensors]);

  const realTimeData = useMemo(() => getSensorDataForChart(sensors), [sensors]);

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
          <CardTitle>Real-time Active Sensors</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={realTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Line type="monotone" dataKey="value" name="Active Sensors" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
