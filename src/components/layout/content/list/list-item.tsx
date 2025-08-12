import React from 'react';
import { ViewStyle } from 'react-native';
import { ThemedView } from '@/components/themed';

export interface ListItemProps {
  // Content
  children: React.ReactNode;

  // Styling
  containerStyle?: ViewStyle;

  // Layout configuration
  minHeight?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

export function ListItem({
  children,
  containerStyle,
  minHeight = 60,
  paddingHorizontal = 16,
  paddingVertical = 12,
}: ListItemProps) {
  return (
    <ThemedView
      style={[
        {
          minHeight,
          paddingHorizontal,
          paddingVertical,
        },
        containerStyle,
      ]}
    >
      {children}
    </ThemedView>
  );
}
