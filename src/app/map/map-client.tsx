
"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { Map as GoogleMap, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useTheme } from "next-themes";

type AnomalyPoint = {
  timestamp: string;
  isAnomalous: boolean;
};

const SENSOR_TYPE_COLORS: Record<Sensor["type"], string> = {
  "Air Quality": "hsl(var(--chart-1))",
  "Traffic": "hsl(var(--chart-2))",
  "Noise Level": "hsl(var(--chart-4))",
  "Public Transport": "hsl(var(--chart-5))",
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
  const [hoveredSensorId, setHoveredSensorId] = useState<string | null>(null);
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>(initialReadings);
  const [mapCenter, setMapCenter] = useState({ lat: 26.9124, lng: 75.7873 }); // Default to Jaipur
  const [filter, setFilter] = useState<Record<Sensor["type"], boolean>>({
    "Air Quality": true,
    "Traffic": true,
    "Noise Level": true,
    "Public Transport": true,
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const [anomalyData, setAnomalyData] = useState<AnomalyPoint[]>([]);
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // This will try to use Geolocation but will fall back to Jaipur if permission is denied.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Handle error or permission denial, keep default center
          console.log("Geolocation permission denied. Using default location.");
        }
      );
    }
  }, []);

  const filteredSensors = useMemo(() => {
    return sensors.filter((sensor) => filter[sensor.type]);
  }, [sensors, filter]);

  const handleMarkerClick = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setSensorReadings(getRecentReadings(sensor.id, 50));
    setAnomalyData([]); // Reset anomaly data on new sensor selection
    setHoveredSensorId(null);
  };

  const handleFilterChange = (type: Sensor["type"], checked: boolean | "indeterminate") => {
    setFilter((prev) => ({ ...prev, [type]: !!checked }));
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
      time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }),
      isAnomalous: anomalyMap.get(reading.timestamp)
    }));
  }, [sensorReadings, anomalyData]);

  const mapStyles = resolvedTheme === "dark" ? [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ] : [];

  const getPinColor = (sensor: Sensor) => {
    if (sensor.status === 'alert') return 'hsl(var(--destructive))';
    if (selectedSensor?.id === sensor.id) return 'hsl(var(--primary))';
    return SENSOR_TYPE_COLORS[sensor.type] || 'hsl(var(--accent))';
  }

  return (
    <div className="relative h-[calc(100vh-120px)] w-full">
      <div className="absolute top-0 left-0 z-10 p-4">
        <Card className="w-64">
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
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: SENSOR_TYPE_COLORS[type as Sensor["type"]] }}
                  />
                  <Label htmlFor={type}>{type}</Label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="h-full w-full rounded-lg overflow-hidden">
        <Suspense fallback={<div className="bg-muted h-full w-full flex items-center justify-center">Loading Map...</div>}>
            <GoogleMap
              center={mapCenter}
              defaultZoom={12}
              mapId="twinview_map"
              gestureHandling={'greedy'}
              disableDefaultUI={true}
              styles={mapStyles}
              className="h-full w-full"
            >
              {filteredSensors.map((sensor) => (
                <AdvancedMarker
                  key={sensor.id}
                  position={sensor.location}
                  onClick={() => handleMarkerClick(sensor)}
                >
                  <Popover open={hoveredSensorId === sensor.id}>
                    <PopoverTrigger asChild>
                      <div
                        onMouseEnter={() => setHoveredSensorId(sensor.id)}
                        onMouseLeave={() => setHoveredSensorId(null)}
                      >
                        <Pin 
                          background={getPinColor(sensor)}
                          glyphColor="hsl(var(--primary-foreground))"
                          borderColor={getPinColor(sensor)}
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      side="top"
                      align="center"
                      className="w-auto p-2"
                      onMouseEnter={() => setHoveredSensorId(sensor.id)}
                      onMouseLeave={() => setHoveredSensorId(null)}
                    >
                      <div className="p-2">
                        <h4 className="font-bold">{sensor.name}</h4>
                        <p className="text-sm text-muted-foreground">{sensor.type}</p>
                        <Badge variant={sensor.status === 'online' ? 'default' : sensor.status === 'offline' ? 'secondary' : 'destructive'} className="mt-2">
                          {sensor.status}
                        </Badge>
                      </div>
                    </PopoverContent>
                  </Popover>
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
                  <Badge variant={selectedSensor.status === 'online' ? 'default' : selectedSensor.status === 'offline' ? 'secondary' : 'destructive'}>{selectedSensor.status}</Badge>
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
