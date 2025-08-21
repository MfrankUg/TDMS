
"use server";

import { querySensorData, QuerySensorDataInput, QuerySensorDataOutput } from "@/ai/flows/query-sensor-data";
import { predictOutOfRange, PredictOutOfRangeInput, PredictOutOfRangeOutput } from "@/ai/flows/predict-out-of-range";
import { translateText, TranslateTextInput, TranslateTextOutput } from "@/ai/flows/translate-text";

// Simple in-memory cache for predictions
let cachedPrediction: { timestamp: number; data: PredictOutOfRangeOutput } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function handleQuery(input: QuerySensorDataInput): Promise<QuerySensorDataOutput> {
  try {
    const result: QuerySensorDataOutput = await querySensorData(input);
    return result;
  } catch (error) {
    console.error("Error in handleQuery:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
        answer: `Sorry, I encountered an error while processing your request: ${errorMessage} Please try again.`
    };
  }
}

export async function handlePrediction(input: PredictOutOfRangeInput): Promise<PredictOutOfRangeOutput> {
  const now = Date.now();

  // Check if a valid cache exists
  if (cachedPrediction && (now - cachedPrediction.timestamp < CACHE_DURATION)) {
    console.log("Returning cached prediction.");
    return cachedPrediction.data;
  }

  console.log("Fetching new prediction from AI.");
  try {
    const result = await predictOutOfRange(input);
    // Store the new prediction in the cache
    cachedPrediction = {
      timestamp: now,
      data: result,
    };
    return result;
  } catch (error) {
    console.error("Error in handlePrediction:", error);
    // Return a default error state if the prediction fails
    return {
      temperatureAlert: "Failed to get temperature prediction.",
      humidityAlert: "Failed to get humidity prediction.",
      dustParticleAlert: "Failed to get dust particle prediction.",
    };
  }
}

export async function handleTranslation(input: TranslateTextInput): Promise<TranslateTextOutput> {
  try {
    const result = await translateText(input);
    return result;
  } catch (error) {
    console.error("Error in handleTranslation:", error);
    return {
      translatedText: "Sorry, I could not translate the text.",
    };
  }
}
