import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
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
   * Height of the separator. Defaults to StyleSheet.hairlineWidth
   */
  height?: number;
  /**
   * Additional style overrides
   */
  style?: ViewStyle;
}

export function Separator({ color, height = StyleSheet.hairlineWidth, style }: SeparatorProps) {
  const backgroundColor = useThemeColor('separator', color);

  return (
    <ThemedView
      style={[
        styles.separator,
        {
          backgroundColor,
          height,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    width: '100%',
  },
});
