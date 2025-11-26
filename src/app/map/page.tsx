import { getSensors, getSensorById, getRecentReadings } from "@/lib/data";
import MapClient from "./map-client";

export default function MapPage() {
  const sensors = getSensors();
  // We'll pre-select the first sensor to have a side panel open on load.
  const initialSensor = getSensorById('sensor-001');
  const initialReadings = initialSensor ? getRecentReadings(initialSensor.id, 50) : [];
  
  return (
    <MapClient 
      sensors={sensors}
      initialSensor={initialSensor}
      initialReadings={initialReadings}
    />
  );
}
