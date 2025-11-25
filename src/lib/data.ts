import type { Sensor, SensorReading, Alert } from './types';

const SENSOR_LOCATIONS = [
  // Downtown
  { lat: 37.7749, lng: -122.4194 },
  { lat: 37.7755, lng: -122.4180 },
  { lat: 37.7730, lng: -122.4210 },
  // Golden Gate Park
  { lat: 37.7694, lng: -122.4862 },
  { lat: 37.7715, lng: -122.4537 },
  // Mission District
  { lat: 37.7599, lng: -122.4148 },
  { lat: 37.7610, lng: -122.4190 },
  // Fisherman's Wharf
  { lat: 37.8080, lng: -122.4177 },
];

const SENSOR_TYPES: Sensor['type'][] = ['Air Quality', 'Traffic', 'Noise Level', 'Public Transport'];
const SENSOR_STATUS: Sensor['status'][] = ['online', 'offline', 'alert'];

const generateSensors = (): Sensor[] => {
  return SENSOR_LOCATIONS.map((loc, i) => {
    const type = SENSOR_TYPES[i % SENSOR_TYPES.length];
    return {
      id: `sensor-00${i + 1}`,
      name: `${type} Sensor #${i + 1}`,
      type,
      location: loc,
      status: SENSOR_STATUS[Math.floor(Math.random() * SENSOR_STATUS.length)],
    };
  });
};

const sensors: Sensor[] = generateSensors();

const getUnitAndRange = (type: Sensor['type']): { unit: string, min: number, max: number, alertThreshold: number } => {
  switch (type) {
    case 'Air Quality': return { unit: 'AQI', min: 10, max: 150, alertThreshold: 100 };
    case 'Traffic': return { unit: 'veh/h', min: 50, max: 2000, alertThreshold: 1800 };
    case 'Noise Level': return { unit: 'dB', min: 40, max: 110, alertThreshold: 90 };
    case 'Public Transport': return { unit: 'passengers', min: 5, max: 150, alertThreshold: 120 };
    default: return { unit: '', min: 0, max: 100, alertThreshold: 80 };
  }
};

const generateReadings = (sensorId: string, sensorType: Sensor['type'], count: number, timeOffsetMs: number): SensorReading[] => {
  const { unit, min, max } = getUnitAndRange(sensorType);
  const now = new Date();
  const readings: SensorReading[] = [];
  for (let i = 0; i < count; i++) {
    // Add occasional spikes
    const isSpike = Math.random() < 0.05;
    const value = isSpike
      ? min + (max - min) * (0.8 + Math.random() * 0.2)
      : min + Math.random() * (max - min) * 0.7;

    readings.push({
      timestamp: new Date(now.getTime() - timeOffsetMs * (count - i)).toISOString(),
      value: parseFloat(value.toFixed(2)),
      unit,
    });
  }
  return readings;
};

const generateAlerts = (): Alert[] => {
  return sensors
    .filter(s => s.status === 'alert' || Math.random() < 0.1)
    .map(sensor => {
      const { alertThreshold } = getUnitAndRange(sensor.type);
      return {
        id: `alert-${sensor.id}-${Date.now()}`,
        sensorId: sensor.id,
        sensorType: sensor.type,
        severity: (['high', 'critical'] as const)[Math.floor(Math.random() * 2)],
        timestamp: new Date(Date.now() - Math.random() * 1000 * 3600 * 24).toISOString(),
        description: `Sensor value exceeded threshold of ${alertThreshold}.`,
        status: (['new', 'acknowledged'] as const)[Math.floor(Math.random() * 2)],
      };
    }).slice(0, 15);
};

const alerts: Alert[] = generateAlerts();

export const getSensors = () => sensors;
export const getSensorById = (id: string) => sensors.find(s => s.id === id);
export const getAlerts = () => alerts;

export const getRecentReadings = (sensorId: string, count: number): SensorReading[] => {
  const sensor = getSensorById(sensorId);
  if (!sensor) return [];
  return generateReadings(sensorId, sensor.type, count, 60 * 1000); // 1 minute interval
};

export const getHistoricalData = (sensorId: string, count: number): SensorReading[] => {
  const sensor = getSensorById(sensorId);
  if (!sensor) return [];
  return generateReadings(sensorId, sensor.type, count, 60 * 60 * 1000); // 1 hour interval
};
