'use server';

import { detectAnomalousData } from '@/ai/flows/detect-anomalous-data';
import { getHistoricalData, getRecentReadings } from './data';
import type { Sensor } from './types';

export async function detectAnomalies(sensor: Sensor) {
  try {
    const recentData = getRecentReadings(sensor.id, 20).map(r => ({
      timestamp: r.timestamp,
      value: r.value,
      sensorType: sensor.type,
      location: sensor.name,
    }));

    const historicalData = getHistoricalData(sensor.id, 200).map(r => ({
        timestamp: r.timestamp,
        value: r.value,
        sensorType: sensor.type,
        location: sensor.name,
    }));
    
    if (recentData.length === 0 || historicalData.length === 0) {
      return { error: 'Not enough data to perform anomaly detection.' };
    }

    const anomalies = await detectAnomalousData({
      sensorData: recentData,
      historicalData,
      anomalyThreshold: 2.5, // 2.5 standard deviations
    });
    
    return { data: anomalies };

  } catch (error) {
    console.error('Error detecting anomalies:', error);
    return { error: 'Failed to detect anomalies.' };
  }
}
