'use client';

import { useMemo } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Alert, Sensor } from '@/lib/types';
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

export default function ReportsClient({ sensors }: { sensors: Sensor[] }) {
  const firestore = useFirestore();
  const alertsCollection = firestore ? collection(firestore, 'alerts') : null;
  const alertsQuery = alertsCollection
    ? query(alertsCollection, orderBy('timestamp', 'desc'))
    : null;

  const { data: alerts, loading } = useCollection<Alert>(alertsQuery);

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

  const sensorMap = useMemo(() => {
    return sensors.reduce((acc, sensor) => {
      acc[sensor.id] = sensor;
      return acc;
    }, {} as Record<string, Sensor>);
  }, [sensors]);

  const sensorIdsWithAlerts = Object.keys(alertsBySensor);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Alert History</CardTitle>
        <CardDescription>
          A historical log of all alerts triggered by each sensor, fetched from
          Firestore.
        </CardDescription>
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
                      {sensorMap[sensorId]?.name || sensorId}
                    </span>
                    <Badge>{alertsBySensor[sensorId].length} alerts</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
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
                            {new Date(alert.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {!loading && sensorIdsWithAlerts.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-60">
                <AlertTriangle className="h-12 w-12 mb-4" />
                <p className="text-lg font-semibold">No Alert Data Found</p>
                <p>There are no alert records in your Firestore database. You can add some on the Dashboard page.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
