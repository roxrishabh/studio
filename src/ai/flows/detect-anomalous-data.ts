'use server';

/**
 * @fileOverview Detects anomalous sensor data using historical data analysis.
 *
 * - detectAnomalousData - Function to detect anomalous data points.
 * - DetectAnomalousDataInput - Input type for detectAnomalousData.
 * - DetectAnomalousDataOutput - Output type for detectAnomalousData.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomalousDataInputSchema = z.object({
  sensorData: z.array(
    z.object({
      timestamp: z.string().describe('Timestamp of the sensor reading (ISO format).'),
      value: z.number().describe('The sensor reading value.'),
      sensorType: z.string().describe('The type of sensor (e.g., temperature, pressure).'),
      location: z.string().describe('The location of the sensor.'),
    })
  ).describe('An array of recent sensor data readings.'),
  historicalData: z.array(
    z.object({
      timestamp: z.string().describe('Timestamp of the historical sensor reading (ISO format).'),
      value: z.number().describe('The historical sensor reading value.'),
      sensorType: z.string().describe('The type of sensor (e.g., temperature, pressure).'),
      location: z.string().describe('The location of the sensor.'),
    })
  ).describe('An array of historical sensor data readings for the same sensor type and location.'),
  anomalyThreshold: z.number().describe('The threshold above which a data point is considered anomalous (e.g., 2.0 for 2 standard deviations).'),
});
export type DetectAnomalousDataInput = z.infer<typeof DetectAnomalousDataInputSchema>;

const DetectAnomalousDataOutputSchema = z.array(
  z.object({
    timestamp: z.string().describe('Timestamp of the anomalous sensor reading (ISO format).'),
    value: z.number().describe('The anomalous sensor reading value.'),
    sensorType: z.string().describe('The type of sensor (e.g., temperature, pressure).'),
    location: z.string().describe('The location of the sensor.'),
    isAnomalous: z.boolean().describe('Whether the data point is considered anomalous.'),
    anomalyScore: z.number().describe('A numerical score indicating the degree of anomaly.'),
    reason: z.string().describe('Reasoning for the anomaly detection.'),
  })
);
export type DetectAnomalousDataOutput = z.infer<typeof DetectAnomalousDataOutputSchema>;

export async function detectAnomalousData(input: DetectAnomalousDataInput): Promise<DetectAnomalousDataOutput> {
  return detectAnomalousDataFlow(input);
}

const detectAnomalousDataPrompt = ai.definePrompt({
  name: 'detectAnomalousDataPrompt',
  input: {schema: DetectAnomalousDataInputSchema},
  output: {schema: DetectAnomalousDataOutputSchema},
  prompt: `You are an expert in anomaly detection for sensor data.

  Analyze the provided recent sensor data in comparison to the historical data to identify any anomalies. An anomaly is defined as a data point that significantly deviates from the expected range based on the historical data.

  Consider the following factors when determining if a data point is anomalous:
  - The difference between the recent data point and the historical average.
  - The standard deviation of the historical data.
  - Any sudden changes or spikes in the recent data compared to the historical trends.

  For each recent data point, calculate an anomaly score based on how far it deviates from the historical average in terms of standard deviations. If the anomaly score exceeds the given anomalyThreshold, flag the data point as anomalous.

  Provide a clear and concise reason for each anomaly detection, explaining why the data point is considered anomalous based on the historical data.

  Recent Sensor Data:
  {{#each sensorData}}
  - Timestamp: {{timestamp}}, Value: {{value}}, Type: {{sensorType}}, Location: {{location}}
  {{/each}}

  Historical Data:
  {{#each historicalData}}
  - Timestamp: {{timestamp}}, Value: {{value}}, Type: {{sensorType}}, Location: {{location}}
  {{/each}}

  Anomaly Threshold: {{anomalyThreshold}}

  Output the results in JSON format, including the timestamp, value, sensor type, location, isAnomalous (true or false), anomalyScore, and a brief reason for each data point. Only output data points that were included in the recent sensor data. If an item is not anomalous, isAnomalous should be false.
  Make sure that if the isAnomalous value is true, the anomalyScore is above the threshold provided.
  `,
});

const detectAnomalousDataFlow = ai.defineFlow(
  {
    name: 'detectAnomalousDataFlow',
    inputSchema: DetectAnomalousDataInputSchema,
    outputSchema: DetectAnomalousDataOutputSchema,
  },
  async input => {
    const {output} = await detectAnomalousDataPrompt(input);
    return output!;
  }
);

