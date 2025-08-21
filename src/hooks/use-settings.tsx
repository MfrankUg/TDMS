
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Thresholds {
  warning: number;
  danger: number;
}

export interface Settings {
  temp: Thresholds;
  humidity: Thresholds;
  small_dust: Thresholds;
  large_dust: Thresholds;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const defaultSettings: Settings = {
  temp: { warning: 25, danger: 30 },
  humidity: { warning: 75, danger: 80 },
  small_dust: { warning: 30, danger: 50 },
  large_dust: { warning: 30, danger: 50 },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettingsState] = useState<Settings>(() => {
    if (typeof window === 'undefined') {
        return defaultSettings;
    }
    try {
      const item = window.localStorage.getItem('alertSettings');
      return item ? JSON.parse(item) : defaultSettings;
    } catch (error) {
      console.error(error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('alertSettings', JSON.stringify(settings));
    } catch (error) {
      console.error(error);
    }
  }, [settings]);

  const setSettings = (newSettings: Settings) => {
    setSettingsState(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
