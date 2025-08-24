
"use client";

import { useState, useEffect, useCallback } from "react";
import { handleCleaningPrediction } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Clock, Edit, Check, RefreshCw } from "lucide-react";
import { PredictCleaningScheduleOutput } from "@/ai/flows/predict-cleaning-schedule";
import { useTranslation } from "@/hooks/use-translation";
import type { Sensor } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CleaningScheduleProps {
  sensorData: Sensor[];
}

export function CleaningSchedule({ sensorData }: CleaningScheduleProps) {
  const [prediction, setPrediction] = useState<PredictCleaningScheduleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCleanedDaysAgo, setLastCleanedDaysAgo] = useState(4);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

  const fetchPrediction = useCallback(async () => {
    const dustSensor = sensorData.find(s => s.id === 'small_dust');
    if (!dustSensor?.historicalData) return;

    setIsLoading(true);
    setError(null);

    try {
      const input = {
        dustReadings: dustSensor.historicalData.map(d => d.value),
        lastCleanedDaysAgo: lastCleanedDaysAgo
      };
      const result = await handleCleaningPrediction(input);
      setPrediction(result);
    } catch (e) {
      setError(t('errorFetchingPredictions'));
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [sensorData, lastCleanedDaysAgo, t]);

  useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);

  const getAirQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "moderate":
        return "text-yellow-600";
      case "poor":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  const handleLastCleanedChange = () => {
       fetchPrediction();
       setIsEditing(false);
  };

  if (isLoading) {
    return <Skeleton className="h-60 w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t('error')}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!prediction) return null;

  const currentDustValue = sensorData.find(s => s.id === 'small_dust')?.currentValue || 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('cleaningSchedule')}</CardTitle>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => fetchPrediction()} disabled={isLoading}>
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => isEditing ? handleLastCleanedChange() : setIsEditing(true)}>
                {isEditing ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-6 w-6 text-foreground/80" />
                        <span className="text-3xl font-bold">{prediction.remainingDays} {t('days')}</span>
                    </div>
                    <p className={cn("text-lg font-semibold", getAirQualityColor(prediction.airQuality))}>
                       {t('airQuality')} {prediction.airQuality}
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-lg">{t('dustParticles')} (PM2.5)</p>
                    <p className={cn("text-2xl font-bold", currentDustValue > 0 ? "text-red-600" : "text-green-600")}>
                        {currentDustValue.toFixed(1)} µg/m³
                    </p>
                    <p className="text-sm text-muted-foreground">{prediction.dustAccumulationPercent.toFixed(0)}% {t('ofThreshold')}</p>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-sm font-medium">{t('dustAccumulation')}</p>
                <Progress value={prediction.dustAccumulationPercent} className="mt-1 h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{t('clean')} (0)</span>
                    <span>{t('threshold')} (45 µg/m³)</span>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <p className="font-semibold">{t('recommendation')}:</p>
            <p className="text-muted-foreground">{prediction.recommendation}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
            <div>
                <p className="text-sm font-semibold text-muted-foreground">{t('lastCleaned')}</p>
                 {isEditing ? (
                    <input 
                        type="number"
                        value={lastCleanedDaysAgo}
                        onChange={(e) => setLastCleanedDaysAgo(parseInt(e.target.value))}
                        className="text-lg font-bold bg-transparent border-b w-16"
                    /> 
                 ) : (
                    <p className="text-lg font-bold">{prediction.lastCleaned}</p>
                 )}
            </div>
            <div className="text-right">
                <p className="text-sm font-semibold text-muted-foreground">{t('accumulationRate')}</p>
                <p className="text-lg font-bold">{prediction.accumulationRate} µg/m³/day</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
