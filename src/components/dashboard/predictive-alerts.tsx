"use client";

import { useState, useEffect, useCallback } from "react";
import { handlePrediction } from "@/lib/actions";
import { mockSensors } from "@/lib/mock-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { PredictOutOfRangeOutput } from "@/ai/flows/predict-out-of-range";
import { useTranslation } from "@/hooks/use-translation";

export function PredictiveAlerts() {
  const [predictions, setPredictions] = useState<PredictOutOfRangeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const fetchPredictions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const input = {
        temperatureReadings: mockSensors.find(s => s.id === 'temp')?.historicalData.map(d => d.value) || [],
        humidityReadings: mockSensors.find(s => s.id === 'humidity')?.historicalData.map(d => d.value) || [],
        dustParticleReadings: mockSensors.find(s => s.id === 'dust')?.historicalData.map(d => d.value) || [],
        thresholdTemperature: 25,
        thresholdHumidity: 70,
        thresholdDustParticles: 200
      };
      const result = await handlePrediction(input);
      setPredictions(result);
    } catch (e) {
      setError(t('errorFetchingPredictions'));
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  if (isLoading) {
    return (
      <div className="space-y-4">
         <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('predictiveAlerts')}</h3>
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{t('predictiveAlerts')}</h3>
            <Button variant="outline" size="sm" onClick={fetchPredictions} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="ml-2">{t('refresh')}</span>
            </Button>
        </div>
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const alerts = predictions ? [
    predictions.temperatureAlert,
    predictions.humidityAlert,
    predictions.dustParticleAlert,
  ].filter((alert): alert is string => !!alert) : [];

  const hasFailedPredictions = predictions 
    ? Object.values(predictions).some(p => p?.toLowerCase().includes('failed'))
    : false;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t('predictiveAlerts')}</h3>
        <Button variant="outline" size="sm" onClick={fetchPredictions} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="ml-2">{t('refresh')}</span>
        </Button>
      </div>

      {hasFailedPredictions ? (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('predictionFailed')}</AlertTitle>
            <AlertDescription>{t('couldNotRetrievePredictions')}</AlertDescription>
        </Alert>
      ) : alerts.length === 0 ? (
        <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">{t('allSystemsNormal')}</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            {t('noPredictedValues')}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('predictiveAlert')}</AlertTitle>
              <AlertDescription>{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
}
