
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Sensor, SensorDataPoint } from '@/lib/types';
import { useSettings } from '@/hooks/use-settings';

const API_URL = "https://api.thingspeak.com/channels/2890593/feeds.json?api_key=CJDLIMXOTJ3RVEPF&results=30";

export function useSensorData() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { settings } = useSettings();

  const getStatus = useCallback((type: keyof typeof settings, value: number): 'normal' | 'warning' | 'danger' => {
    const thresholds = settings[type];
    if (value >= thresholds.danger) return 'danger';
    if (value >= thresholds.warning) return 'warning';
    return 'normal';
  }, [settings]);


  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      const { feeds, channel } = data;

      if (!feeds || feeds.length === 0) {
        setSensors([]);
        setLoading(false);
        return;
      }
      
      const latestFeed = feeds[feeds.length - 1];

      const newSensors: Sensor[] = [
        {
          id: 'temp',
          name: channel.field5 || 'Temperature',
          unit: '°C',
          currentValue: parseFloat(latestFeed.field5),
          status: getStatus('temp', parseFloat(latestFeed.field5)),
          historicalData: feeds.map((feed: any) => ({
            time: new Date(feed.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            value: parseFloat(feed.field5)
          })).filter((d: SensorDataPoint) => !isNaN(d.value)),
        },
        {
          id: 'humidity',
          name: channel.field4 || 'Humidity',
          unit: '%',
          currentValue: parseFloat(latestFeed.field4),
          status: getStatus('humidity', parseFloat(latestFeed.field4)),
          historicalData: feeds.map((feed: any) => ({
            time: new Date(feed.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            value: parseFloat(feed.field4)
          })).filter((d: SensorDataPoint) => !isNaN(d.value)),
        },
        {
          id: 'small_dust',
          name: channel.field1 || 'Small Dust Particles',
          unit: 'µg/m³',
          currentValue: parseFloat(latestFeed.field1),
          status: getStatus('small_dust', parseFloat(latestFeed.field1)),
          historicalData: feeds.map((feed: any) => ({
            time: new Date(feed.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            value: parseFloat(feed.field1)
          })).filter((d: SensorDataPoint) => !isNaN(d.value)),
        },
        {
          id: 'large_dust',
          name: channel.field2 || 'Large Dust Particles',
          unit: 'µg/m³',
          currentValue: parseFloat(latestFeed.field2),
          status: getStatus('large_dust', parseFloat(latestFeed.field2)),
          historicalData: feeds.map((feed: any) => ({
            time: new Date(feed.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            value: parseFloat(feed.field2)
          })).filter((d: SensorDataPoint) => !isNaN(d.value)),
        }
      ];

      setSensors(newSensors);

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, [getStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { sensors, loading, error, refetch: fetchData };
}
