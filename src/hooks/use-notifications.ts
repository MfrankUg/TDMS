
"use client";

import { useSensorData } from "./use-sensor-data";
import { useTranslation } from "./use-translation";

export interface Notification {
  title: string;
  description: string;
}

export function useNotifications() {
  const { sensors, loading } = useSensorData();
  const { t } = useTranslation();

  const notifications: Notification[] = [];

  if (!loading && sensors.length > 0) {
    const tempSensor = sensors.find(s => s.id === 'temp');
    if (tempSensor && (tempSensor.status === 'danger' || tempSensor.status === 'warning')) {
      notifications.push({
        title: t('highTemp'),
        description: t('highTempDesc'),
      });
    }

    const humiditySensor = sensors.find(s => s.id === 'humidity');
    if (humiditySensor && (humiditySensor.status === 'danger' || humiditySensor.status === 'warning')) {
      notifications.push({
        title: t('highHumidity'),
        description: t('highHumidityDesc'),
      });
    }

    const smallDustSensor = sensors.find(s => s.id === 'small_dust');
    if (smallDustSensor && (smallDustSensor.status === 'danger' || smallDustSensor.status === 'warning')) {
      notifications.push({
        title: t('highDust'),
        description: t('highDustDesc'),
      });
    }
    
    const largeDustSensor = sensors.find(s => s.id === 'large_dust');
    if (largeDustSensor && (largeDustSensor.status === 'danger' || largeDustSensor.status === 'warning')) {
      if(!notifications.find(n => n.title === t('highDust'))) {
        notifications.push({
          title: t('highDust'),
          description: t('highDustDesc'),
        });
      }
    }
  }

  return { notifications, isLoading: loading };
}
