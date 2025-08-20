
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Sensor, SensorDataPoint } from '@/lib/types';

const API_URL = "https://api.thingspeak.com/channels/2890593/feeds.json?api_key=CJDLIMXOTJ3RVEPF&results=30";

function getStatus(type: 'temp' | 'humidity' | 'dust', value: number): 'normal' | 'warning' | 'danger' {
  const thresholds = {
    temp: { warning: 25, danger: 30 },
    humidity: { warning: 65, danger: 70 },
    dust: { warning: 180, danger: 250 },
  };
  if (value >= thresholds[type].danger) return 'danger';
  if (value >= thresholds[type].warning) return 'warning';
  return 'normal';
}

export function useSensorData() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
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

      const temperature: Sensor = {
        id: 'temp',
        name: channel.field1 || 'Temperature',
        unit: '°C',
        currentValue: parseFloat(latestFeed.field1),
        status: getStatus('temp', parseFloat(latestFeed.field1)),
        historicalData: feeds.map((feed: any) => ({
          time: new Date(feed.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          value: parseFloat(feed.field1)
        })).filter((d: SensorDataPoint) => !isNaN(d.value)),
      };

      const humidity: Sensor = {
        id: 'humidity',
        name: channel.field2 || 'Humidity',
        unit: '%',
        currentValue: parseFloat(latestFeed.field2),
        status: getStatus('humidity', parseFloat(latestFeed.field2)),
        historicalData: feeds.map((feed: any) => ({
          time: new Date(feed.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          value: parseFloat(feed.field2)
        })).filter((d: SensorDataPoint) => !isNaN(d.value)),
      };
      
      const dust: Sensor = {
        id: 'dust',
        name: channel.field3 || 'Dust Particles',
        unit: 'PPM',
        currentValue: parseFloat(latestFeed.field3),
        status: getStatus('dust', parseFloat(latestFeed.field3)),
        historicalData: feeds.map((feed: any) => ({
          time: new Date(feed.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          value: parseFloat(feed.field3)
        })).filter((d: SensorDataPoint) => !isNaN(d.value)),
      };

      setSensors([temperature, humidity, dust]);

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  return { sensors, loading, error, refetch: fetchData };
}
