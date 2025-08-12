import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView, ThemedViewProps } from '@/components/themed/themed-view';

export interface CardContentProps extends ThemedViewProps {
  children: React.ReactNode;
  spacing?: 'none' | 'small' | 'medium' | 'large';
}

export function CardContent({
  children,
  spacing = 'none',
  style,
  ...otherProps
}: CardContentProps) {
  const spacingStyle = getSpacingStyle(spacing);

  return (
    <ThemedView style={[styles.container, spacingStyle, style]} {...otherProps}>
      {children}
    </ThemedView>
  );
}

function getSpacingStyle(spacing: CardContentProps['spacing']) {
  switch (spacing) {
    case 'none':
      return {};
    case 'small':
      return { marginVertical: 4 };
    case 'medium':
      return { marginVertical: 8 };
    case 'large':
      return { marginVertical: 12 };
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
