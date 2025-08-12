import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ThemedView } from '@/components/themed/themed-view';

/**
 * Props for the CardFooter component
 */
export interface CardFooterProps {
  /** Child components to render (typically buttons or actions) */
  children: React.ReactNode;
  /** Horizontal alignment of footer content */
  alignment?: 'left' | 'center' | 'right' | 'space-between' | 'space-around';
  /** Spacing above footer and between child elements */
  spacing?: 'none' | 'small' | 'medium' | 'large';
}

/**
 * CardFooter component for action buttons and footer content in cards
 *
 * Provides flexible alignment options and spacing for footer elements
 *
 * @component
 * @example
 * ```tsx
 * // Right-aligned buttons (default)
 * <CardFooter>
 *   <Button>Cancel</Button>
 *   <Button>Save</Button>
 * </CardFooter>
 *
 * // Space-between layout for actions
 * <CardFooter alignment="space-between">
 *   <Button>Delete</Button>
 *   <View>
 *     <Button>Cancel</Button>
 *     <Button>Save</Button>
 *   </View>
 * </CardFooter>
 * ```
 *
 * @param props - The props for the CardFooter component
 */
export function CardFooter({ children, alignment = 'right', spacing = 'medium' }: CardFooterProps) {
  const alignmentStyle = getAlignmentStyle(alignment);
  const spacingStyle = getSpacingStyle(spacing);

  return (
    <ThemedView style={[styles.container, alignmentStyle, spacingStyle]}>{children}</ThemedView>
  );
}

/**
 * Returns the appropriate alignment style based on the alignment prop
 * @param alignment - The alignment option for footer content
 * @returns ViewStyle object with justifyContent property
 */
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

/**
 * Returns the appropriate spacing style based on the spacing prop
 * @param spacing - The spacing size option
 * @returns Style object with marginTop and gap properties
 */
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
