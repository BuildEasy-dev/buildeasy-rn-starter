/**
 * ThemedButton - Tamagui Implementation
 *
 * High-performance button component built on Tamagui with full API compatibility
 * Maintains 100% compatibility with existing ThemedButton API while leveraging
 * Tamagui's compile-time optimizations and enhanced theming system.
 */

import { Stack, styled } from '@tamagui/core';
import type { StackProps } from '@tamagui/core';
import { forwardRef, useMemo, memo } from 'react';
import { ActivityIndicator } from 'react-native';
import type { ViewStyle } from 'react-native';

import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { ThemedText } from './themed-text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonRadius = 'small' | 'medium' | 'large' | number;
export type IconPosition = 'left' | 'right';

export type ThemedButtonProps = {
  // Styling props
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  radius?: ButtonRadius;

  // Content props
  label?: string;
  isLoading?: boolean;

  // Icon props
  iconName?: IconSymbolName;
  iconPosition?: IconPosition;
  iconSize?: number;
  iconColor?: string;

  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;

  // Standard props
  children?: React.ReactNode;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

// Enhanced props that combine Tamagui props with legacy API
export interface TamaguiThemedButtonProps extends Omit<StackProps, 'size' | 'variant'> {
  // Legacy API compatibility
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  radius?: ButtonRadius;

  // Content props
  label?: string;
  isLoading?: boolean;

  // Icon props
  iconName?: IconSymbolName;
  iconPosition?: IconPosition;
  iconSize?: number;
  iconColor?: string;

  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Color constants - adapted to buildeasy project
const COLORS = {
  primary: {
    DEFAULT: '#007AFF',
    50: '#E6F2FF',
    100: '#CCE6FF',
    600: '#0056CC',
    700: '#003F99',
  },
  secondary: {
    DEFAULT: '#5856D6',
    600: '#4540B3',
    700: '#332B90',
  },
  error: {
    DEFAULT: '#FF3B30',
    600: '#CC2F26',
    700: '#99241D',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
  },
};

// Variant styling mapping
const variantMapping = {
  primary: {
    backgroundColor: COLORS.primary.DEFAULT,
    color: '#FFFFFF',
    borderColor: COLORS.primary.DEFAULT,
    hoverStyle: { backgroundColor: COLORS.primary[600] },
    pressStyle: { backgroundColor: COLORS.primary[700] },
  },
  secondary: {
    backgroundColor: COLORS.secondary.DEFAULT,
    color: '#FFFFFF',
    borderColor: COLORS.secondary.DEFAULT,
    hoverStyle: { backgroundColor: COLORS.secondary[600] },
    pressStyle: { backgroundColor: COLORS.secondary[700] },
  },
  outline: {
    backgroundColor: 'transparent',
    color: COLORS.primary.DEFAULT,
    borderColor: COLORS.primary.DEFAULT,
    borderWidth: 1,
    hoverStyle: { backgroundColor: COLORS.primary[50] },
    pressStyle: { backgroundColor: COLORS.primary[100] },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: COLORS.primary.DEFAULT,
    borderColor: 'transparent',
    hoverStyle: { backgroundColor: COLORS.neutral[100] },
    pressStyle: { backgroundColor: COLORS.neutral[200] },
  },
  danger: {
    backgroundColor: COLORS.error.DEFAULT,
    color: '#FFFFFF',
    borderColor: COLORS.error.DEFAULT,
    hoverStyle: { backgroundColor: COLORS.error[600] },
    pressStyle: { backgroundColor: COLORS.error[700] },
  },
};

// Size mapping
const sizeMapping = {
  small: {
    height: 36,
    paddingHorizontal: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  medium: {
    height: 44,
    paddingHorizontal: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  large: {
    height: 52,
    paddingHorizontal: 24,
    fontSize: 18,
    lineHeight: 26,
  },
};

// Radius mapping
const radiusMapping = {
  small: 4,
  medium: 8,
  large: 16,
};

// Create styled button component using @tamagui/core
const StyledButton = styled(Stack, {
  name: 'ThemedButton',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  cursor: 'pointer',
  userSelect: 'none',

  // Default button styles
  variants: {
    size: {
      small: {
        height: 36,
        paddingHorizontal: 16,
        minHeight: 36,
      },
      medium: {
        height: 44,
        paddingHorizontal: 20,
        minHeight: 44,
      },
      large: {
        height: 52,
        paddingHorizontal: 24,
        minHeight: 52,
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
  },

  // Web-specific styles
  ...(process.env.TAMAGUI_TARGET === 'web' && {
    ':focus': {
      outlineColor: '$primary',
      outlineWidth: 2,
      outlineStyle: 'solid',
      outlineOffset: 2,
    },
  }),
});

/**
 * ThemedButton component with Tamagui implementation
 *
 * Features:
 * - 100% API compatibility with legacy ThemedButton
 * - Compile-time style optimization via Tamagui
 * - Enhanced theming with consistent color system
 * - Performance improvements through styled components
 * - Full TypeScript support with proper inference
 * - Support for icons, loading states, and accessibility
 */
export const TamaguiThemedButton = memo(
  forwardRef<React.ElementRef<typeof StyledButton>, TamaguiThemedButtonProps>(
    (
      {
        variant = 'primary',
        size = 'medium',
        fullWidth = false,
        radius = 'medium',
        label,
        isLoading = false,
        iconName,
        iconPosition = 'left',
        iconSize,
        iconColor,
        children,
        disabled,
        style,
        accessibilityLabel,
        accessibilityHint,
        ...props
      },
      ref
    ) => {
      const isDisabled = disabled || isLoading;

      // Memoized border radius calculation
      const borderRadiusValue = useMemo(() => {
        if (typeof radius === 'number') return radius;
        return radiusMapping[radius as keyof typeof radiusMapping] || 8;
      }, [radius]);

      // Memoized icon size calculation
      const finalIconSize = useMemo(() => {
        if (iconSize) return iconSize;

        switch (size) {
          case 'small':
            return 16;
          case 'large':
            return 24;
          case 'medium':
          default:
            return 20;
        }
      }, [iconSize, size]);

      // Get variant and size configurations
      const variantConfig = variantMapping[variant as keyof typeof variantMapping];
      const sizeConfig = sizeMapping[size as keyof typeof sizeMapping];

      // Memoized icon color calculation
      const iconColorValue = useMemo(() => {
        if (iconColor) return iconColor;

        // Use button text color as default icon color
        if (variant === 'outline' || variant === 'ghost') {
          return COLORS.primary.DEFAULT;
        }
        return '#FFFFFF';
      }, [iconColor, variant]);

      // Memoized loading indicator color
      const loadingColor = useMemo(() => {
        if (variant === 'outline' || variant === 'ghost') {
          return COLORS.primary.DEFAULT;
        }
        return '#FFFFFF';
      }, [variant]);

      return (
        <StyledButton
          ref={ref}
          // @ts-expect-error - Tamagui variants
          size={size}
          fullWidth={fullWidth}
          disabled={isDisabled}
          borderRadius={borderRadiusValue}
          backgroundColor={variantConfig.backgroundColor}
          color={variantConfig.color}
          borderColor={variantConfig.borderColor}
          borderWidth={(variantConfig as any).borderWidth || 0}
          hoverStyle={variantConfig.hoverStyle}
          pressStyle={variantConfig.pressStyle}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled: isDisabled,
            busy: isLoading,
          }}
          style={style}
          {...props}
        >
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={loadingColor}
              accessibilityElementsHidden={true}
              importantForAccessibility="no"
            />
          ) : (
            <Stack
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              gap={6}
              flexWrap="nowrap"
            >
              {iconName && iconPosition === 'left' && (
                <IconSymbol name={iconName} size={finalIconSize} color={iconColorValue} />
              )}

              {label && (
                <ThemedText
                  style={{
                    color: variantConfig.color,
                    fontSize: sizeConfig.fontSize,
                    lineHeight: sizeConfig.lineHeight,
                    textAlign: 'center' as const,
                    flexWrap: 'wrap' as const,
                    flexShrink: 1,
                  }}
                  weight="semibold"
                >
                  {label}
                </ThemedText>
              )}

              {iconName && iconPosition === 'right' && (
                <IconSymbol name={iconName} size={finalIconSize} color={iconColorValue} />
              )}

              {children}
            </Stack>
          )}
        </StyledButton>
      );
    }
  )
);

TamaguiThemedButton.displayName = 'TamaguiThemedButton';

/**
 * ThemedButton Component
 *
 * A themeable button component that follows the project's design system.
 * Supports light/dark themes, multiple variants, sizes, and states.
 *
 * Usage examples:
 *   <ThemedButton label="Primary Button" />
 *   <ThemedButton variant="outline" size="small" label="Small Outline" />
 *   <ThemedButton variant="danger" label="Delete" isLoading={isDeleting} />
 *   <ThemedButton label="Settings" iconName="gear" />
 */

// Export the Tamagui implementation as ThemedButton
export const ThemedButton = forwardRef<
  React.ComponentRef<typeof TamaguiThemedButton>,
  ThemedButtonProps
>((props, ref) => {
  return <TamaguiThemedButton ref={ref} {...props} />;
});

ThemedButton.displayName = 'ThemedButton';
