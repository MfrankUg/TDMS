
"use client";

import { useSensorData } from "@/hooks/use-sensor-data";
import { SensorCard } from "@/components/dashboard/sensor-card";
import { SensorChart } from "@/components/dashboard/sensor-chart";
import { PredictiveAlerts } from "@/components/dashboard/predictive-alerts";
import { ChatAssistant } from "@/components/dashboard/chat-assistant";
import { Thermometer, Droplets, Wind, RefreshCw, Atom, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const { sensors, loading, error, refetch } = useSensorData();

  const icons: { [key: string]: React.ReactNode } = {
    temp: <Thermometer className="h-6 w-6 text-muted-foreground" />,
    humidity: <Droplets className="h-6 w-6 text-muted-foreground" />,
    small_dust: <Atom className="h-6 w-6 text-muted-foreground" />,
    large_dust: <Sparkles className="h-6 w-6 text-muted-foreground" />,
  };

  if (error) {
     return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Data</AlertTitle>
          <AlertDescription>
            There was a problem fetching sensor data from the ThingSpeak API. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3 xl:grid-cols-4">
      <div className="lg:col-span-2 xl:col-span-3 space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[125px] w-full" />)
          ) : (
            sensors.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                icon={icons[sensor.id]}
              />
            ))
          )}
        </div>

        <PredictiveAlerts sensorData={sensors} />

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
           {loading ? (
             Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[300px] w-full" />)
           ) : (
            sensors.map((sensor) => (
              <SensorChart key={sensor.id} sensor={sensor} />
            ))
           )}
        </div>
      </div>
      <aside className="lg:col-span-1 xl:col-span-1">
        <ChatAssistant />
      </aside>
    </div>
  );
}
