import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { ThemedView, ThemedViewProps } from '@/components/themed/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface CardProps extends Omit<ThemedViewProps, 'style'> {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

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
        elevation: 3,
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
        backgroundColor: borderColor + '10', // 10% opacity
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
