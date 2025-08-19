// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview An AI agent that answers questions about sensor data.
 *
 * - querySensorData - A function that handles querying sensor data and providing answers.
 * - QuerySensorDataInput - The input type for the querySensorData function.
 * - QuerySensorDataOutput - The return type for the querySensorData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuerySensorDataInputSchema = z.object({
  query: z.string().describe('The question about the sensor data.'),
});
export type QuerySensorDataInput = z.infer<typeof QuerySensorDataInputSchema>;

const QuerySensorDataOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the sensor data.'),
});
export type QuerySensorDataOutput = z.infer<typeof QuerySensorDataOutputSchema>;

export async function querySensorData(input: QuerySensorDataInput): Promise<QuerySensorDataOutput> {
  return querySensorDataFlow(input);
}

const getSensorData = ai.defineTool({
  name: 'getSensorData',
  description: 'Retrieves sensor data from the data store.',
  inputSchema: z.object({
    dataType: z.string().describe('The type of sensor data to retrieve (e.g., temperature, humidity, dust particles).'),
    timeRange: z.string().describe('The time range for which to retrieve the data (e.g., last hour, last day, last week).'),
  }),
  outputSchema: z.string().describe('The sensor data in JSON format.'),
}, async (input) => {
  // TODO: Implement the actual data retrieval logic here
  // This is a placeholder. Replace with actual data retrieval from Firestore.
  console.log("Getting sensor data: " + JSON.stringify(input));
  return `{\"temperature\": 25, \"humidity\": 60, \"dustParticles\": 100}`;
});

const prompt = ai.definePrompt({
  name: 'querySensorDataPrompt',
  tools: [getSensorData],
  input: {schema: QuerySensorDataInputSchema},
  output: {schema: QuerySensorDataOutputSchema},
  prompt: `You are an AI assistant helping users understand their sensor data.
  Use the available tools to answer questions about sensor data trends and anomalies.
  If the user asks about a specific sensor data type or time range, use the getSensorData tool to retrieve the data.

  User question: {{{query}}}`,
});

const querySensorDataFlow = ai.defineFlow(
  {
    name: 'querySensorDataFlow',
    inputSchema: QuerySensorDataInputSchema,
    outputSchema: QuerySensorDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
