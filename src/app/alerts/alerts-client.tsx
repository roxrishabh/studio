"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Alert, Sensor } from "@/lib/types";
import { PlusCircle, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AlertsClient({
  alerts,
  sensors,
  loading,
}: {
  alerts: Alert[] | null;
  sensors: Sensor[];
  loading: boolean;
}) {
  const [filterType, setFilterType] = useState<string>("all");

  const filteredAlerts = useMemo(() => {
    if (!alerts) return [];
    if (filterType === "all") {
      return alerts;
    }
    return alerts.filter((alert) => alert.sensorType === filterType);
  }, [alerts, filterType]);

  const sensorTypes = useMemo(() => {
    return [...new Set(sensors.map((s) => s.type))];
  }, [sensors]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline">Manage Alerts</h1>
        <div className="flex items-center gap-2">
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
                <DialogDescription>
                  Configure a new alert based on sensor data thresholds.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sensor" className="text-right">
                    Sensor
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a sensor" />
                    </SelectTrigger>
                    <SelectContent>
                      {sensors.map((sensor) => (
                        <SelectItem key={sensor.id} value={sensor.id}>
                          {sensor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="threshold" className="text-right">
                    Threshold
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    placeholder="e.g., 100"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="severity" className="text-right">
                    Severity
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Alert</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sensor ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                </TableRow>
              ))}
            {!loading && filteredAlerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-medium">{alert.sensorId}</TableCell>
                <TableCell>{alert.sensorType}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      alert.severity === "critical" || alert.severity === "high"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {alert.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(alert.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={alert.status === "new" ? "outline" : "secondary"}
                  >
                    {alert.status}
                  </Badge>
                </TableCell>
                <TableCell>{alert.description}</TableCell>
              </TableRow>
            ))}
            {!loading && filteredAlerts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  {filterType === 'all' 
                    ? "No alerts found in Firestore. You can add some from the Dashboard page."
                    : `No alerts found for sensor type: ${filterType}.`
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}