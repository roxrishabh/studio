'use server';
/**
 * @fileOverview Summarizes sensor data for a given area and time period.
 *
 * - summarizeSensorData - A function that summarizes sensor data.
 * - SummarizeSensorDataInput - The input type for the summarizeSensorData function.
 * - SummarizeSensorDataOutput - The return type for the summarizeSensorData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSensorDataInputSchema = z.object({
  area: z.string().describe('The area for which to summarize sensor data.'),
  startTime: z.string().describe('The start time for the data summary.'),
  endTime: z.string().describe('The end time for the data summary.'),
  sensorType: z.string().describe('The type of sensor data to summarize.'),
});
export type SummarizeSensorDataInput = z.infer<typeof SummarizeSensorDataInputSchema>;

const SummarizeSensorDataOutputSchema = z.object({
  summary: z.string().describe('A summary of the sensor data for the given area and time period.'),
});
export type SummarizeSensorDataOutput = z.infer<typeof SummarizeSensorDataOutputSchema>;

export async function summarizeSensorData(input: SummarizeSensorDataInput): Promise<SummarizeSensorDataOutput> {
  return summarizeSensorDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSensorDataPrompt',
  input: {schema: SummarizeSensorDataInputSchema},
  output: {schema: SummarizeSensorDataOutputSchema},
  prompt: `You are a city planner summarizing sensor data for a specific area and time period.

  Summarize the sensor data for the following parameters:
  Area: {{{area}}}
  Start Time: {{{startTime}}}
  End Time: {{{endTime}}}
  Sensor Type: {{{sensorType}}}

  Provide a concise summary of the trends and patterns observed in the sensor data.
  `,
});

const summarizeSensorDataFlow = ai.defineFlow(
  {
    name: 'summarizeSensorDataFlow',
    inputSchema: SummarizeSensorDataInputSchema,
    outputSchema: SummarizeSensorDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
