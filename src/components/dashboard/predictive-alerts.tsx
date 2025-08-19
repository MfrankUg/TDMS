import { handlePrediction } from "@/lib/actions";
import { mockSensors } from "@/lib/mock-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export async function PredictiveAlerts() {
  const input = {
    temperatureReadings: mockSensors.find(s => s.id === 'temp')?.historicalData.map(d => d.value) || [],
    humidityReadings: mockSensors.find(s => s.id === 'humidity')?.historicalData.map(d => d.value) || [],
    dustParticleReadings: mockSensors.find(s => s.id === 'dust')?.historicalData.map(d => d.value) || [],
    thresholdTemperature: 25,
    thresholdHumidity: 70,
    thresholdDustParticles: 200
  };

  const predictions = await handlePrediction(input);

  const alerts = [
    predictions.temperatureAlert,
    predictions.humidityAlert,
    predictions.dustParticleAlert,
  ].filter((alert): alert is string => !!alert);

  if (alerts.length === 0) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-300">All Systems Normal</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-400">
          No predicted out-of-range values. The environment is stable.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <Alert key={index} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Predictive Alert!</AlertTitle>
          <AlertDescription>{alert}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
