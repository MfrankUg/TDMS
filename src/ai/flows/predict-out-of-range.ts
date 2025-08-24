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

const AlertObjectSchema = z.object({
    isAlert: z.boolean().describe('Whether an alert should be triggered.'),
    messageKey: z.string().describe("A key to be used for translation, e.g., 'temp_high_alert_message' or null."),
    predictedValue: z.number().describe('The predicted sensor value.'),
    thresholdValue: z.number().describe('The threshold value for this sensor.'),
}).nullable();


const PredictOutOfRangeOutputSchema = z.object({
  temperatureAlert: AlertObjectSchema,
  humidityAlert: AlertObjectSchema,
  dustParticleAlert: AlertObjectSchema,
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

  Given the historical sensor readings and defined thresholds, analyze the trend and predict the sensor value for the next hour.

  For each sensor type (temperature, humidity, dust), determine if the predicted value will exceed the threshold.

  - If a threshold is predicted to be exceeded:
    - Set 'isAlert' to true.
    - Set 'messageKey' to the appropriate key (e.g., 'temp_high_alert_message', 'humidity_high_alert_message', 'dust_high_alert_message').
    - Include the 'predictedValue' and 'thresholdValue'.
  - If everything is predicted to be within the normal range for a sensor:
    - Return null for that sensor's alert object.

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
