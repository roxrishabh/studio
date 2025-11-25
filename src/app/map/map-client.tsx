"use client";

import { useState, useMemo, Suspense } from "react";
import { Map as GoogleMap, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { Sensor, SensorReading } from "@/lib/types";
import { getRecentReadings } from "@/lib/data";
import { detectAnomalies } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

type AnomalyPoint = {
  timestamp: string;
  isAnomalous: boolean;
};

export default function MapClient({ 
  sensors,
  initialSensor,
  initialReadings,
}: { 
  sensors: Sensor[],
  initialSensor?: Sensor,
  initialReadings: SensorReading[],
}) {
  const [selectedSensor, setSelectedSensor] = useState<Sensor | undefined>(initialSensor);
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>(initialReadings);
  const [filter, setFilter] = useState<Record<Sensor["type"], boolean>>({
    "Air Quality": true,
    "Traffic": true,
    "Noise Level": true,
    "Public Transport": true,
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const [anomalyData, setAnomalyData] = useState<AnomalyPoint[]>([]);
  const { toast } = useToast();

  const filteredSensors = useMemo(() => {
    return sensors.filter((sensor) => filter[sensor.type]);
  }, [sensors, filter]);

  const handleMarkerClick = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setSensorReadings(getRecentReadings(sensor.id, 50));
    setAnomalyData([]); // Reset anomaly data on new sensor selection
  };

  const handleFilterChange = (type: Sensor["type"], checked: boolean | "indeterminate") => {
    setFilter((prev) => ({ ...prev, [type]: checked }));
  };
  
  const handleDetectAnomalies = async () => {
    if (!selectedSensor) return;
    setIsDetecting(true);
    setAnomalyData([]);
    const result = await detectAnomalies(selectedSensor);
    setIsDetecting(false);
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Anomaly Detection Failed",
        description: result.error,
      });
    } else if (result.data) {
      const anomalousTimestamps = new Set(result.data.filter(d => d.isAnomalous).map(d => d.timestamp));
      setAnomalyData(
        result.data.map(d => ({ timestamp: d.timestamp, isAnomalous: d.isAnomalous }))
      );
      toast({
        title: "Analysis Complete",
        description: `Found ${anomalousTimestamps.size} anomalies.`,
      });
    }
  };

  const chartData = useMemo(() => {
    const anomalyMap = new Map(anomalyData.map(d => [d.timestamp, d.isAnomalous]));
    return sensorReadings.map(reading => ({
      ...reading,
      time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAnomalous: anomalyMap.get(reading.timestamp)
    }));
  }, [sensorReadings, anomalyData]);

  return (
    <div className="h-[calc(100vh-120px)] w-full flex">
      <Card className="w-64 mr-4">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-semibold">Sensor Type</h3>
          {Object.keys(filter).map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={filter[type as Sensor["type"]]}
                onCheckedChange={(checked) => handleFilterChange(type as Sensor["type"], checked)}
              />
              <Label htmlFor={type}>{type}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex-1 h-full rounded-lg overflow-hidden">
        <Suspense fallback={<div className="bg-muted h-full w-full flex items-center justify-center">Loading Map...</div>}>
            <GoogleMap
              defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
              defaultZoom={12}
              mapId="twinview_map"
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            >
              {filteredSensors.map((sensor) => (
                <AdvancedMarker
                  key={sensor.id}
                  position={sensor.location}
                  onClick={() => handleMarkerClick(sensor)}
                >
                    <Pin 
                        background={sensor.status === 'alert' ? 'hsl(var(--destructive))' : (selectedSensor?.id === sensor.id ? 'hsl(var(--primary))' : 'hsl(var(--secondary-foreground))')}
                        glyphColor={sensor.status === 'alert' ? 'hsl(var(--destructive-foreground))' : (selectedSensor?.id === sensor.id ? 'hsl(var(--primary-foreground))' : 'hsl(var(--secondary))')}
                        borderColor={sensor.status === 'alert' ? 'hsl(var(--destructive))' : (selectedSensor?.id === sensor.id ? 'hsl(var(--primary))' : 'hsl(var(--secondary-foreground))')}
                    />
                </AdvancedMarker>
              ))}
            </GoogleMap>
        </Suspense>
      </div>

      <Sheet open={!!selectedSensor} onOpenChange={(open) => !open && setSelectedSensor(undefined)}>
        <SheetContent className="sm:max-w-xl w-full">
          {selectedSensor && (
            <>
              <SheetHeader>
                <SheetTitle className="font-headline">{selectedSensor.name}</SheetTitle>
                <SheetDescription>
                  ID: {selectedSensor.id}
                </SheetDescription>
                <div className="flex gap-2 pt-2">
                  <Badge>{selectedSensor.type}</Badge>
                  <Badge variant={selectedSensor.status === 'online' ? 'default' : 'destructive'}>{selectedSensor.status}</Badge>
                </div>
              </SheetHeader>
              <div className="py-6">
                <h3 className="text-lg font-semibold mb-2">Real-time Data</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                        }}
                      />
                      <Line type="monotone" dataKey="value" name={sensorReadings[0]?.unit} stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                      {chartData.filter(d => d.isAnomalous).map(d => (
                         <Line key={d.timestamp} dataKey="value" data={[d]} stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ r: 5 }} activeDot={false} legendType="none" />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <Button onClick={handleDetectAnomalies} disabled={isDetecting} className="mt-4 w-full">
                    {isDetecting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Detect Anomalies
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
