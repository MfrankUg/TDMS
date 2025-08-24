import { config } from 'dotenv';
config();

import '@/ai/flows/predict-out-of-range.ts';
import '@/ai/flows/query-sensor-data.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/predict-cleaning-schedule.ts';
