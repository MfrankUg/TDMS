'use server';

/**
 * @fileOverview Predicts out-of-range sensor values and generates alerts.
 *
 * - predictOutOfRange - A function that predicts out-of-range sensor values and generates alerts.
 * - PredictOutOfRangeInput - The input type for the predictOutOfRange function.
 * - PredictOutOfRangeOutput - The return type for the predictOutOfRange function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictOutOfRangeInputSchema = z.object({
  temperatureReadings: z.array(z.number()).describe('Historical temperature readings in Celsius.'),
  humidityReadings: z.array(z.number()).describe('Historical humidity readings as a percentage.'),
  dustParticleReadings: z.array(z.number()).describe('Historical dust particle readings in PPM.'),
  thresholdTemperature: z.number().describe('Temperature threshold in Celsius beyond which an alert should be triggered.'),
  thresholdHumidity: z.number().describe('Humidity threshold as a percentage beyond which an alert should be triggered.'),
  thresholdDustParticles: z.number().describe('Dust particle threshold in PPM beyond which an alert should be triggered.'),
});
export type PredictOutOfRangeInput = z.infer<typeof PredictOutOfRangeInputSchema>;

const PredictOutOfRangeOutputSchema = z.object({
  temperatureAlert: z
    .string()
    .describe('An alert message if the predicted temperature exceeds the threshold, otherwise null.'),
  humidityAlert: z
    .string()
    .describe('An alert message if the predicted humidity exceeds the threshold, otherwise null.'),
  dustParticleAlert: z
    .string()
    .describe('An alert message if the predicted dust particle level exceeds the threshold, otherwise null.'),
});
export type PredictOutOfRangeOutput = z.infer<typeof PredictOutOfRangeOutputSchema>;

export async function predictOutOfRange(input: PredictOutOfRangeInput): Promise<PredictOutOfRangeOutput> {
  return predictOutOfRangeFlow(input);
}

const predictOutOfRangePrompt = ai.definePrompt({
  name: 'predictOutOfRangePrompt',
  input: {schema: PredictOutOfRangeInputSchema},
  output: {schema: PredictOutOfRangeOutputSchema},
  prompt: `You are an AI assistant specializing in predicting out-of-range sensor values in a warehouse environment.

  Given the historical sensor readings and defined thresholds, predict whether the temperature, humidity, and dust particle levels will exceed their respective thresholds in the near future.

  Provide a concise alert message if a threshold is predicted to be exceeded. If everything is within range, the corresponding alert should be null.

  Here's the historical sensor data and thresholds:

  Temperature Readings (Celsius): {{temperatureReadings}}
  Threshold Temperature (Celsius): {{thresholdTemperature}}

  Humidity Readings (percentage): {{humidityReadings}}
  Threshold Humidity (percentage): {{thresholdHumidity}}

  Dust Particle Readings (PPM): {{dustParticleReadings}}
  Threshold Dust Particles (PPM): {{thresholdDustParticles}}`,
});

const predictOutOfRangeFlow = ai.defineFlow(
  {
    name: 'predictOutOfRangeFlow',
    inputSchema: PredictOutOfRangeInputSchema,
    outputSchema: PredictOutOfRangeOutputSchema,
  },
  async input => {
    const {output} = await predictOutOfRangePrompt(input);
    return output!;
  }
);
