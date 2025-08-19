// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview An AI agent that answers questions about sensor data for coffee storage.
 *
 * - querySensorData - A function that handles querying sensor data and providing answers.
 * - QuerySensorDataInput - The input type for the querySensorData function.
 * - QuerySensorDataOutput - The return type for the querySensorData function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import wav from 'wav';

const QuerySensorDataInputSchema = z.object({
  query: z.string().describe('The question about the sensor data for coffee storage.'),
  generateAudio: z.boolean().optional().describe('Whether to generate audio for the response.'),
  userName: z.string().optional().describe('The name of the user to greet.'),
});
export type QuerySensorDataInput = z.infer<typeof QuerySensorDataInputSchema>;

const QuerySensorDataOutputSchema = z.object({
  answer: z
    .string()
    .describe('The answer to the question about the coffee storage sensor data.'),
  answerAudio: z
    .string()
    .optional()
    .describe(
      'The answer converted to audio as a data URI. Expected format: \'data:audio/wav;base64,<encoded_data>\'.'
    ),
});
export type QuerySensorDataOutput = z.infer<typeof QuerySensorDataOutputSchema>;

export async function querySensorData(input: QuerySensorDataInput): Promise<QuerySensorDataOutput> {
  return querySensorDataFlow(input);
}

const getSensorData = ai.defineTool(
  {
    name: 'getSensorData',
    description: 'Retrieves sensor data for coffee storage from the data store.',
    inputSchema: z.object({
      dataType: z
        .string()
        .describe(
          'The type of sensor data to retrieve (e.g., temperature, humidity, dust particles).'
        ),
      timeRange: z
        .string()
        .describe(
          'The time range for which to retrieve the data (e.g., last hour, last day, last week).'
        ),
    }),
    outputSchema: z.string().describe('The sensor data in JSON format.'),
  },
  async input => {
    // TODO: Implement the actual data retrieval logic here
    // This is a placeholder. Replace with actual data retrieval from Firestore.
    console.log('Getting sensor data: ' + JSON.stringify(input));
    return `{\"temperature\": 25, \"humidity\": 60, \"dustParticles\": 100}`;
  }
);

const prompt = ai.definePrompt({
  name: 'querySensorDataPrompt',
  tools: [getSensorData],
  input: {schema: QuerySensorDataInputSchema},
  output: {schema: z.object({answer: z.string()})},
  prompt: `You are an AI assistant expert in coffee storage, helping users understand their sensor data in a coffee warehouse.
  Ideal conditions for green coffee bean storage are:
  - Temperature: 15-25°C (60-77°F)
  - Humidity: 55-65%
  - Low dust/contaminants.

  {{#if userName}}
  Start your response with a friendly greeting to the user, "{{userName}}".
  {{/if}}
  
  Use the available tools to answer questions about sensor data trends and anomalies related to coffee storage.
  If the user asks about a specific sensor data type or time range, use the getSensorData tool to retrieve the data.
  Provide friendly, conversational, and helpful answers.

  User question: {{{query}}}`,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const querySensorDataFlow = ai.defineFlow(
  {
    name: 'querySensorDataFlow',
    inputSchema: QuerySensorDataInputSchema,
    outputSchema: QuerySensorDataOutputSchema,
  },
  async input => {
    const {output: textOutput} = await prompt(input);
    const answer = textOutput!.answer;

    if (!input.generateAudio) {
      return { answer };
    }

    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: answer,
    });

    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    return {
      answer: answer,
      answerAudio: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);
