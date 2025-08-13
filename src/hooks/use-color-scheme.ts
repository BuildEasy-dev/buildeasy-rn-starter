import { useState, useEffect } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';

// Global state for controlled theme
let globalColorScheme: ColorScheme | null = null;
const listeners: Set<() => void> = new Set();

export function useColorScheme(): ColorScheme | null {
  const systemColorScheme = useRNColorScheme();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = () => {
      forceUpdate({});
    };
    listeners.add(unsubscribe);
    return () => {
      listeners.delete(unsubscribe);
    };
  }, []);

  // Return manual override if set, otherwise system theme
  return globalColorScheme ?? (systemColorScheme as ColorScheme | null);
}

export function setColorScheme(colorScheme: ColorScheme | null) {
  globalColorScheme = colorScheme;
  // Notify all listeners to re-render
  listeners.forEach((listener) => listener());
}

export function getColorScheme(): ColorScheme | null {
  return globalColorScheme;
}
