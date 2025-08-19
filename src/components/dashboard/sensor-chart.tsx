"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Sensor } from "@/lib/types";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { useTranslation } from "@/hooks/use-translation";

interface SensorChartProps {
  sensor: Sensor;
}

export function SensorChart({ sensor }: SensorChartProps) {
  const { t } = useTranslation();
  const chartConfig = {
    value: {
      label: sensor.unit,
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(sensor.id as any)} {t('trend')}</CardTitle>
        <CardDescription>{t('last30Hours')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart accessibilityLayer data={sensor.historicalData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.split(", ")[1] || value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Line
              dataKey="value"
              type="monotone"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
