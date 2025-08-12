import React from 'react';
import { ViewStyle } from 'react-native';
import { ThemedView } from '@/components/themed/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ThemedColor } from '@/components/types';

interface SeparatorProps {
  /**
   * Custom color for the separator supporting light/dark themes.
   * If not provided, uses theme 'separator' color
   */
  color?: ThemedColor;
  /**
   * Height of the separator. Defaults to 1
   */
  height?: number;
  /**
   * Additional style overrides
   */
  style?: ViewStyle;
}

export function Separator({ color, height = 1, style }: SeparatorProps) {
  const backgroundColor = useThemeColor('separator', color);

  return (
    <ThemedView
      style={[
        {
          backgroundColor,
          height,
        },
        style,
      ]}
    />
  );
}
