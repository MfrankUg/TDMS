import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sensor } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  sensor: Sensor;
  icon: React.ReactNode;
}

export function SensorCard({ sensor, icon }: SensorCardProps) {
  const statusConfig = {
    normal: {
      color: "bg-green-500",
      text: "text-green-700",
    },
    warning: {
      color: "bg-yellow-500",
      text: "text-yellow-700",
    },
    danger: {
      color: "bg-red-500",
      text: "text-red-700",
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{sensor.name}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {sensor.currentValue} {sensor.unit}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              statusConfig[sensor.status].color
            )}
          />
          <span className={cn(statusConfig[sensor.status].text, "dark:text-white/70")}>{sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
