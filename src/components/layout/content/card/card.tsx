import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { ThemedView, ThemedViewProps } from '@/components/themed/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Props for the Card component
 * @extends Omit<ThemedViewProps, 'style'>
 */
export interface CardProps extends Omit<ThemedViewProps, 'style'> {
  /** Visual style variant of the card */
  variant?: 'elevated' | 'outlined' | 'filled';
  /** Internal padding size of the card */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Optional callback function when card is pressed */
  onPress?: () => void;
  /** Child components to render inside the card */
  children: React.ReactNode;
  /** Custom style object to apply to the card */
  style?: ViewStyle;
}

/**
 * A reusable Card component that provides a consistent container with theming support
 *
 * @component
 * @example
 * ```tsx
 * // Basic card with content
 * <Card variant="elevated" padding="medium">
 *   <Text>Card content</Text>
 * </Card>
 *
 * // Clickable card
 * <Card variant="outlined" onPress={() => console.log('Card pressed')}>
 *   <Text>Clickable card</Text>
 * </Card>
 * ```
 *
 * @param props - The props for the Card component
 * @param props.variant - Visual style variant ('elevated' | 'outlined' | 'filled')
 * @param props.padding - Internal padding size ('none' | 'small' | 'medium' | 'large')
 * @param props.onPress - Optional callback when card is pressed
 * @param props.children - Child components to render
 * @param props.style - Custom style object
 * @param props.lightColor - Custom light theme background color
 * @param props.darkColor - Custom dark theme background color
 * @returns JSX.Element
 */
export function Card({
  variant = 'elevated',
  padding = 'medium',
  onPress,
  children,
  style,
  lightColor,
  darkColor,
  ...otherProps
}: CardProps) {
  const borderColor = useThemeColor('border');
  const shadowColor = useThemeColor('text');

  const paddingStyle = getPaddingStyle(padding);
  const variantStyle = getVariantStyle(variant, borderColor, shadowColor);

  const cardStyle = [styles.card, variantStyle, paddingStyle, style];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
        {...otherProps}
      >
        <ThemedView lightColor={lightColor} darkColor={darkColor} style={styles.cardContent}>
          {children}
        </ThemedView>
      </Pressable>
    );
  }

  return (
    <ThemedView lightColor={lightColor} darkColor={darkColor} style={cardStyle} {...otherProps}>
      {children}
    </ThemedView>
  );
}

/**
 * Returns the appropriate padding style based on the padding prop
 * @param padding - The padding size option
 * @returns ViewStyle object with padding properties
 */
function getPaddingStyle(padding: CardProps['padding']): ViewStyle {
  switch (padding) {
    case 'none':
      return {};
    case 'small':
      return { padding: 8 };
    case 'medium':
      return { padding: 16 };
    case 'large':
      return { padding: 24 };
    default:
      return { padding: 16 };
  }
}

/**
 * Returns the appropriate style based on the card variant
 * @param variant - The visual variant of the card
 * @param borderColor - The border color from theme
 * @param shadowColor - The shadow color from theme
 * @returns ViewStyle object with variant-specific styling
 */
function getVariantStyle(
  variant: CardProps['variant'],
  borderColor: string,
  shadowColor: string
): ViewStyle {
  const baseStyle: ViewStyle = {
    borderRadius: 12,
  };

  switch (variant) {
    case 'elevated':
      return {
        ...baseStyle,
        shadowColor,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Android shadow
      };
    case 'outlined':
      return {
        ...baseStyle,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor,
      };
    case 'filled':
      return {
        ...baseStyle,
        backgroundColor: borderColor + '10', // 10% opacity overlay
      };
    default:
      return baseStyle;
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
