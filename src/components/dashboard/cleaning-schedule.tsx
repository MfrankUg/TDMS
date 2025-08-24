
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

  const fetchPrediction = useCallback(async (daysAgo: number) => {
    const dustSensor = sensorData.find(s => s.id === 'small_dust');
    if (!dustSensor?.historicalData || dustSensor.historicalData.length === 0) {
        setError(t('noDustData'));
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const input = {
        dustReadings: dustSensor.historicalData.map(d => d.value),
        lastCleanedDaysAgo: daysAgo
      };
      const result = await handleCleaningPrediction(input);
      setPrediction(result);
    } catch (e) {
      setError(t('errorFetchingPredictions'));
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [sensorData, t]);

  useEffect(() => {
    if (sensorData.length > 0) {
      fetchPrediction(lastCleanedDaysAgo);
    }
  }, [sensorData, fetchPrediction]);

  const getAirQualityColor = (quality: string) => {
    switch (quality?.toLowerCase()) {
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
       fetchPrediction(lastCleanedDaysAgo);
       setIsEditing(false);
  };
  
  const handleEditClick = () => {
    if (isEditing) {
      handleLastCleanedChange();
    } else {
      setIsEditing(true);
    }
  }

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('cleaningSchedule')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (!prediction) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>{t('cleaningSchedule')}</CardTitle>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => fetchPrediction(lastCleanedDaysAgo)} disabled={isLoading || isEditing}>
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleEditClick} disabled={isLoading}>
                {isEditing ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('nextCleaningIn')}</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">{prediction.remainingDays}</span>
                        <span className="text-xl text-muted-foreground">{t('days')}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className={cn("text-lg font-semibold", getAirQualityColor(prediction.airQuality))}>
                       {t('airQuality')}: {t(prediction.airQuality.toLowerCase() as any)}
                    </p>
                    <p className="text-sm text-muted-foreground">{t('dustAccumulation')}</p>
                </div>
            </div>
            <div className="mt-4">
                <Progress value={prediction.dustAccumulationPercent} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{t('clean')} (0%)</span>
                    <span>{t('threshold')} (100%)</span>
                </div>
            </div>
        </div>

        <div>
            <p className="font-semibold text-sm">{t('recommendation')}:</p>
            <p className="text-sm text-muted-foreground mt-1">{prediction.recommendation}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
                <p className="text-sm font-semibold text-muted-foreground">{t('lastCleaned')}</p>
                 {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input 
                            type="number"
                            value={lastCleanedDaysAgo}
                            onChange={(e) => setLastCleanedDaysAgo(parseInt(e.target.value) || 0)}
                            className="text-lg font-bold bg-transparent border-b w-16 focus:outline-none"
                            autoFocus
                        />
                        <span className="text-lg font-bold">{t('daysAgo')}</span>
                    </div>
                 ) : (
                    <p className="text-lg font-bold">{prediction.lastCleaned}</p>
                 )}
            </div>
            <div className="text-right">
                <p className="text-sm font-semibold text-muted-foreground">{t('accumulationRate')}</p>
                <p className="text-lg font-bold">{prediction.accumulationRate} µg/m³/{t('day')}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
