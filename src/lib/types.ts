export type Sensor = {
  id: string;
  name: string;
  type: 'Air Quality' | 'Traffic' | 'Noise Level' | 'Public Transport';
  location: {
    lat: number;
    lng: number;
  };
  status: 'online' | 'offline' | 'alert';
};

export type SensorReading = {
  timestamp: string; // ISO string
  value: number;
  unit: string;
};

export type Alert = {
  id: string;
  sensorId: string;
  sensorType: Sensor['type'];
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string; // ISO string
  description: string;
  status: 'new' | 'acknowledged' | 'resolved';
};
