import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView, ThemedViewProps } from '@/components/themed/themed-view';

/**
 * Props for the CardContent component
 * @extends ThemedViewProps
 */
export interface CardContentProps extends ThemedViewProps {
  /** Child components to render in the content area */
  children: React.ReactNode;
  /** Vertical spacing around the content */
  spacing?: 'none' | 'small' | 'medium' | 'large';
}

/**
 * CardContent component for the main content area of cards
 *
 * Provides a flexible container with configurable spacing for card body content
 *
 * @component
 * @example
 * ```tsx
 * // Basic content
 * <CardContent>
 *   <Text>This is the main content</Text>
 * </CardContent>
 *
 * // Content with spacing
 * <CardContent spacing="medium">
 *   <Image source={imageSource} />
 *   <Text>Description text</Text>
 * </CardContent>
 * ```
 *
 * @param props - The props for the CardContent component
 */
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

/**
 * Returns the appropriate spacing style based on the spacing prop
 * @param spacing - The spacing size option
 * @returns Style object with vertical margin
 */
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
