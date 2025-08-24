'use server';

/**
 * @fileOverview Predicts the next cleaning schedule based on dust accumulation.
 *
 * - predictCleaningSchedule - A function that predicts the cleaning schedule.
 * - PredictCleaningScheduleInput - The input type for the predictCleaningSchedule function.
 * - PredictCleaningScheduleOutput - The return type for the predictCleaningSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { subDays, formatDistanceToNow } from 'date-fns';

const PredictCleaningScheduleInputSchema = z.object({
    dustReadings: z.array(z.number()).describe('Historical dust particle readings (PM2.5) in µg/m³. The readings are sequential and chronological.'),
    lastCleanedDaysAgo: z.number().describe('The number of days since the warehouse was last cleaned.'),
});
export type PredictCleaningScheduleInput = z.infer<typeof PredictCleaningScheduleInputSchema>;

const PredictCleaningScheduleOutputSchema = z.object({
  remainingDays: z.number().describe('The predicted number of days remaining until the next cleaning is required.'),
  airQuality: z.string().describe('The current air quality status (e.g., Excellent, Good, Moderate, Poor).'),
  dustAccumulationPercent: z.number().describe('The current dust level as a percentage of the cleaning threshold.'),
  recommendation: z.string().describe('A text recommendation for the user based on the prediction.'),
  lastCleaned: z.string().describe('A human-readable string indicating when the warehouse was last cleaned (e.g., "4 days ago").'),
  accumulationRate: z.number().describe('The calculated daily dust accumulation rate in µg/m³/day.'),
});
export type PredictCleaningScheduleOutput = z.infer<typeof PredictCleaningScheduleOutputSchema>;


// Helper function to perform simple linear regression
function linearRegression(readings: number[]): { slope: number; intercept: number } {
    const n = readings.length;
    if (n < 2) return { slope: 0, intercept: readings[0] || 0 };

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += readings[i];
        sumXY += i * readings[i];
        sumXX += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope: isNaN(slope) ? 0 : slope, intercept: isNaN(intercept) ? 0 : intercept };
}


export async function predictCleaningSchedule(input: PredictCleaningScheduleInput): Promise<PredictCleaningScheduleOutput> {
    const BASELINE_CLEANING_DAYS = 14;
    const DUST_THRESHOLD = 45; // µg/m³

    const { dustReadings, lastCleanedDaysAgo } = input;

    // 1. Calculate Accumulation Rate using Linear Regression
    const { slope: accumulationRate } = linearRegression(dustReadings);
    const dailyAccumulationRate = Math.max(0, accumulationRate * 24); // Assuming readings are hourly

    const currentDustLevel = dustReadings[dustReadings.length - 1] || 0;

    // 2. Predict Remaining Days
    let remainingDays;
    if (dailyAccumulationRate <= 0) {
        remainingDays = BASELINE_CLEANING_DAYS - lastCleanedDaysAgo;
    } else {
        const daysToReachThreshold = (DUST_THRESHOLD - currentDustLevel) / dailyAccumulationRate;
        remainingDays = Math.min(BASELINE_CLEANING_DAYS - lastCleanedDaysAgo, Math.floor(daysToReachThreshold));
    }
    remainingDays = Math.max(0, remainingDays);


    // 3. Determine Air Quality
    const dustAccumulationPercent = Math.min(100, (currentDustLevel / DUST_THRESHOLD) * 100);
    let airQuality;
    if (dustAccumulationPercent < 25) airQuality = "Excellent";
    else if (dustAccumulationPercent < 50) airQuality = "Good";
    else if (dustAccumulationPercent < 75) airQuality = "Moderate";
    else airQuality = "Poor";

    // 4. Generate Recommendation
    let recommendation;
    if (remainingDays <= 3) {
        recommendation = `Immediate cleaning recommended. High dust levels predicted within ${remainingDays} days.`;
    } else if (remainingDays <= 7) {
        recommendation = `Schedule cleaning soon. Next routine cleaning recommended in ${remainingDays} days.`;
    } else {
        recommendation = `Continue monitoring. Next routine cleaning in ${remainingDays} days.`;
    }

    // 5. Format Last Cleaned Date
    const lastCleanedDate = subDays(new Date(), lastCleanedDaysAgo);
    const lastCleaned = formatDistanceToNow(lastCleanedDate, { addSuffix: true });

    return {
        remainingDays,
        airQuality,
        dustAccumulationPercent: parseFloat(dustAccumulationPercent.toFixed(1)),
        recommendation,
        lastCleaned,
        accumulationRate: parseFloat(dailyAccumulationRate.toFixed(1)),
    };
}
