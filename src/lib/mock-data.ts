import { Sensor, SensorDataPoint } from './types';

function generateHistoricalData(baseValue: number, fluctuation: number, points: number = 30): SensorDataPoint[] {
  const data: SensorDataPoint[] = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    // one point per hour for last 30 hours
    const time = new Date(now.getTime() - i * 60 * 60 * 1000); 
    const value = baseValue + (Math.random() - 0.5) * fluctuation;
    data.push({ time: time.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' }), value: parseFloat(value.toFixed(1)) });
  }
  return data;
}

export const mockSensors: Sensor[] = [
  {
    id: 'temp',
    name: 'Temperature',
    unit: '°C',
    currentValue: 22.5,
    status: 'normal',
    historicalData: generateHistoricalData(22, 5),
  },
  {
    id: 'humidity',
    name: 'Humidity',
    unit: '%',
    currentValue: 58.2,
    status: 'normal',
    historicalData: generateHistoricalData(60, 10),
  },
  {
    id: 'dust',
    name: 'Dust Particles',
    unit: 'PPM',
    currentValue: 150.7,
    status: 'warning',
    historicalData: generateHistoricalData(140, 50),
  },
];
