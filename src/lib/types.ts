
export interface SensorDataPoint {
  time: string;
  value: number;
}

export interface Sensor {
  id: 'temp' | 'humidity' | 'small_dust' | 'large_dust';
  name: string;
  unit: string;
  currentValue: number;
  status: 'normal' | 'warning' | 'danger';
  historicalData?: SensorDataPoint[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioData?: string;
}
