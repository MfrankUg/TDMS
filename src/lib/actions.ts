"use server";

import { querySensorData, QuerySensorDataInput, QuerySensorDataOutput } from "@/ai/flows/query-sensor-data";
import { predictOutOfRange, PredictOutOfRangeInput, PredictOutOfRangeOutput } from "@/ai/flows/predict-out-of-range";
import { translateText, TranslateTextInput, TranslateTextOutput } from "@/ai/flows/translate-text";

export async function handleQuery(input: QuerySensorDataInput): Promise<QuerySensorDataOutput> {
  try {
    const result: QuerySensorDataOutput = await querySensorData(input);
    return result;
  } catch (error) {
    console.error("Error in handleQuery:", error);
    return {
        answer: "Sorry, I encountered an error while processing your request. Please try again."
    };
  }
}

export async function handlePrediction(input: PredictOutOfRangeInput): Promise<PredictOutOfRangeOutput> {
  try {
    const result = await predictOutOfRange(input);
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
