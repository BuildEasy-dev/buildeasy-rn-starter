import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ThemedView } from '@/components/themed/themed-view';

export interface CardFooterProps {
  children: React.ReactNode;
  alignment?: 'left' | 'center' | 'right' | 'space-between' | 'space-around';
  spacing?: 'none' | 'small' | 'medium' | 'large';
}

export function CardFooter({ children, alignment = 'right', spacing = 'medium' }: CardFooterProps) {
  const alignmentStyle = getAlignmentStyle(alignment);
  const spacingStyle = getSpacingStyle(spacing);

  return (
    <ThemedView style={[styles.container, alignmentStyle, spacingStyle]}>{children}</ThemedView>
  );
}

function getAlignmentStyle(alignment: CardFooterProps['alignment']): ViewStyle {
  switch (alignment) {
    case 'left':
      return { justifyContent: 'flex-start' as const };
    case 'center':
      return { justifyContent: 'center' as const };
    case 'right':
      return { justifyContent: 'flex-end' as const };
    case 'space-between':
      return { justifyContent: 'space-between' as const };
    case 'space-around':
      return { justifyContent: 'space-around' as const };
    default:
      return { justifyContent: 'flex-end' as const };
  }
}

function getSpacingStyle(spacing: CardFooterProps['spacing']) {
  switch (spacing) {
    case 'none':
      return {};
    case 'small':
      return { marginTop: 8, gap: 8 };
    case 'medium':
      return { marginTop: 12, gap: 12 };
    case 'large':
      return { marginTop: 16, gap: 16 };
    default:
      return { marginTop: 12, gap: 12 };
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
