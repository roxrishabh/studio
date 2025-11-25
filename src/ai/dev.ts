import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-sensor-data.ts';
import '@/ai/flows/detect-anomalous-data.ts';