
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
      "The answer converted to audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."
    ),
});
export type QuerySensorDataOutput = z.infer<typeof QuerySensorDataOutputSchema>;

export async function querySensorData(input: QuerySensorDataInput): Promise<QuerySensorDataOutput> {
  return querySensorDataFlow(input);
}

const getSensorData = ai.defineTool(
  {
    name: 'getSensorData',
    description: 'Retrieves current or historical sensor data for coffee storage from the data store, such as temperature, humidity, or dust levels.',
    inputSchema: z.object({
      dataType: z
        .string()
        .describe(
          'The type of sensor data to retrieve (e.g., temperature, humidity, dust particles).'
        ),
      timeRange: z
        .string()
        .optional()
        .describe(
          'The time range for which to retrieve the data (e.g., last hour, last day, last week, today vs yesterday). If not specified, returns current data.'
        ),
    }),
    outputSchema: z.string().describe('The sensor data in JSON format.'),
  },
  async input => {
    // This is a placeholder. In a real application, you would fetch this data from your database (e.g., Firestore).
    console.log('Tool: Getting sensor data for ' + JSON.stringify(input));
    // For demonstration, we'll return mock data based on the query.
    if (input.dataType.includes('temp')) {
      return JSON.stringify({ temperature: 24.6, unit: "°C", status: "within the safe storage range" });
    }
    if (input.dataType.includes('humid')) {
       return JSON.stringify({ humidity: 63, unit: "%", status: "within the recommended range" });
    }
    if (input.dataType.includes('dust')) {
       return JSON.stringify({ dust: 38, unit: "µg/m³", status: "acceptable" });
    }
    return JSON.stringify({ temperature: 25.2, humidity: 62, dust: 40 });
  }
);

const prompt = ai.definePrompt({
  name: 'querySensorDataPrompt',
  tools: [getSensorData],
  input: {schema: QuerySensorDataInputSchema},
  output: {schema: z.object({answer: z.string()})},
  prompt: `You are an AI assistant expert in coffee storage, helping users understand their sensor data in a coffee warehouse.

  **Your Knowledge Base:**

  *   **Ideal Conditions for Green Coffee Beans:**
      *   Temperature: 20-25°C (68-77°F).
      *   Humidity: 60-65%.
      *   Low dust/contaminants.
  
  *   **Question Categories You Can Handle:**
      *   **Current Readings:** "What is the temperature?" - Use the getSensorData tool.
      *   **Alerts & Warnings:** "Are there any high temperature alerts?" - Answer based on ideal conditions.
      *   **Predictions & Trends:** "What will the humidity be like in the next few hours?" - Note: Your current capability is to report on past trends, not predict the future. You can state what the trend has been.
      *   **Storage & Coffee Quality Advice:** "What happens if humidity is too high?" - Use your expert knowledge.
      *   **System Status:** "Are the sensors working?" - You can confirm you are receiving data.

  **How to Answer:**

  1.  **Greet the User:** If a \`userName\` is provided, start your response with a friendly greeting (e.g., "Hello {{userName}},").
  2.  **Understand the Question:** Analyze the user's query to determine the category.
  3.  **Use Tools When Necessary:** If the user asks for specific, real-time data (like "what is the temperature now?" or "show me the humidity trend for the last day"), you MUST use the \`getSensorData\` tool.
  4.  **Use Your Knowledge:** For general questions about coffee storage best practices, advice, or what-if scenarios (e.g., "How can I reduce dust?"), answer directly from your knowledge base. You do not need a tool for this.
  5.  **Be Conversational:** Provide friendly, clear, and helpful answers.

  **Example Interactions:**
  *   **User:** "What is the current dust level?"
  *   **You (Action):** Call \`getSensorData\` with \`dataType: 'dust'\`.
  *   **You (Response):** "The current dust concentration is 38 µg/m³, which is acceptable."

  *   **User:** "What is the best temperature for my coffee?"
  *   **You (Action):** Do not use a tool.
  *   **You (Response):** "The ideal temperature for storing green coffee beans is between 20°C and 25°C to maintain maximum freshness."

  *   **User:** "Is the humidity okay?"
  *   **You (Action):** Call \`getSensorData\` with \`dataType: 'humidity'\`.
  *   **You (Response):** "Yes, the humidity is currently at 63%, which is perfectly within the recommended range of 60-65%."

  ---

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
