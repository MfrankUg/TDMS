import { mockSensors } from "@/lib/mock-data";
import { SensorCard } from "@/components/dashboard/sensor-card";
import { SensorChart } from "@/components/dashboard/sensor-chart";
import { PredictiveAlerts } from "@/components/dashboard/predictive-alerts";
import { ChatAssistant } from "@/components/dashboard/chat-assistant";
import { Thermometer, Droplets, Wind } from "lucide-react";

export default function DashboardPage() {
  const icons: { [key: string]: React.ReactNode } = {
    temp: <Thermometer className="h-6 w-6 text-muted-foreground" />,
    humidity: <Droplets className="h-6 w-6 text-muted-foreground" />,
    dust: <Wind className="h-6 w-6 text-muted-foreground" />,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3 xl:grid-cols-4">
      <div className="lg:col-span-2 xl:col-span-3 space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockSensors.map((sensor) => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              icon={icons[sensor.id]}
            />
          ))}
        </div>

        <PredictiveAlerts />

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
           {mockSensors.map((sensor) => (
            <SensorChart key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </div>
      <aside className="lg:col-span-1 xl:col-span-1">
        <ChatAssistant />
      </aside>
    </div>
  );
}
