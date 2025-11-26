'use client';

import { useMemo, useState } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Alert, SensorReading } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Filter } from 'lucide-react';
import { getSensorById, getHistoricalData, getSensors } from '@/lib/data';
import { useMemoFirebase } from '@/firebase';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

export default function ReportsClient() {
  const firestore = useFirestore();
  const [filterType, setFilterType] = useState<string>("all");

  const alertsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const alertsCollection = collection(firestore, 'alerts');
    return query(alertsCollection, orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: alerts, loading } = useCollection<Alert>(alertsQuery);

  const sensors = getSensors();
  const sensorTypes = useMemo(() => {
    return [...new Set(sensors.map((s) => s.type))];
  }, [sensors]);

  const alertsBySensor = useMemo(() => {
    if (!alerts) return {};
    return alerts.reduce((acc, alert) => {
      if (!acc[alert.sensorId]) {
        acc[alert.sensorId] = [];
      }
      acc[alert.sensorId].push(alert);
      return acc;
    }, {} as Record<string, Alert[]>);
  }, [alerts]);

  const sensorIdsWithAlerts = useMemo(() => {
    const allSensorIds = Object.keys(alertsBySensor);
    if (filterType === 'all') {
      return allSensorIds;
    }
    return allSensorIds.filter(sensorId => {
      const sensor = getSensorById(sensorId);
      return sensor?.type === filterType;
    });
  }, [alertsBySensor, filterType]);

  // Function to get sensor name, falling back to ID
  const getSensorName = (sensorId: string) => {
    const sensor = getSensorById(sensorId);
    return sensor ? sensor.name : sensorId;
  }
  
  const getChartDataForSensor = (sensorId: string): SensorReading[] => {
    // Get the last 100 historical readings for the sensor to display in the chart
    const historicalReadings = getHistoricalData(sensorId, 100);
    return historicalReadings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const istFormatter = (date: string | Date) => {
    return format(new Date(date), 'PPP p', { timeZone: 'Asia/Kolkata' } as any);
  };
  
  const istTickFormatter = (str: string) => {
    return format(new Date(str), 'MMM d', { timeZone: 'Asia/Kolkata' } as any);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Sensor Alert History</CardTitle>
                <CardDescription>
                A historical log of all alerts triggered by each sensor, fetched from
                Firestore.
                </CardDescription>
            </div>
            <div className="w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {sensorTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
        {!loading && sensorIdsWithAlerts.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            {sensorIdsWithAlerts.map((sensorId) => (
              <AccordionItem value={sensorId} key={sensorId}>
                <AccordionTrigger>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      {getSensorName(sensorId)}
                    </span>
                    <Badge>{alertsBySensor[sensorId].length} alerts</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-4 text-center">Historical Sensor Values</h4>
                      <div className="h-64 w-full">
                          <ResponsiveContainer>
                              <LineChart data={getChartDataForSensor(sensorId)}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis 
                                      dataKey="timestamp" 
                                      tickFormatter={istTickFormatter}
                                  />
                                  <YAxis allowDecimals={false} />
                                  <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                    }}
                                    labelFormatter={istFormatter}
                                  />
                                  <Line type="monotone" dataKey="value" name={getSensorById(sensorId)?.type} stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                              </LineChart>
                          </ResponsiveContainer>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {alertsBySensor[sensorId].map((alert) => (
                          <TableRow key={alert.id}>
                            <TableCell>{alert.description}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  alert.severity === 'critical' ||
                                  alert.severity === 'high'
                                    ? 'destructive'
                                    : 'default'
                                }
                              >
                                {alert.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  alert.status === 'new'
                                    ? 'outline'
                                    : 'secondary'
                                }
                              >
                                {alert.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(alert.timestamp).toLocaleString("en-GB", { timeZone: 'Asia/Kolkata' })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {!loading && sensorIdsWithAlerts.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-60">
                <AlertTriangle className="h-12 w-12 mb-4" />
                <p className="text-lg font-semibold">No Alert Data Found</p>
                <p>
                  {filterType === 'all' 
                    ? "There are no alert records in your Firestore database. You can add some on the Dashboard page."
                    : `No alerts found for sensor type: ${filterType}.`
                  }
                </p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
