"use server";

import { querySensorData, QuerySensorDataInput, QuerySensorDataOutput } from "@/ai/flows/query-sensor-data";
import { predictOutOfRange, PredictOutOfRangeInput, PredictOutOfRangeOutput } from "@/ai/flows/predict-out-of-range";

export async function handleQuery(input: QuerySensorDataInput): Promise<string> {
  try {
    const result: QuerySensorDataOutput = await querySensorData(input);
    return result.answer;
  } catch (error) {
    console.error("Error in handleQuery:", error);
    return "Sorry, I encountered an error while processing your request. Please try again.";
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
