import { Stack, styled } from '@tamagui/core';
import { forwardRef, useState, memo } from 'react';
import {
  TextInput,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { ThemedText } from './themed-text';

/**
 * ThemedTextInput Type Definitions
 */
export type InputSize = 'small' | 'medium' | 'large';
export type InputVariant = 'default' | 'outline' | 'filled';
export type InputStatus = 'default' | 'error' | 'success';

export type ThemedTextInputProps = TextInputProps & {
  // Theme customization
  lightColor?: string;
  darkColor?: string;
  lightPlaceholder?: string;
  darkPlaceholder?: string;
  lightBorder?: string;
  darkBorder?: string;

  // Input variations
  label?: string;
  helperText?: string;
  iconName?: IconSymbolName;
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  status?: InputStatus;
  size?: InputSize;
  variant?: InputVariant;
  rounded?: boolean;

  // Password input
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;

  // Styling
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  helperTextStyle?: StyleProp<TextStyle>;

  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;

  // Keyboard navigation props
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
};

// Create styled TextInput component with variants
const StyledInput = styled(TextInput, {
  name: 'ThemedTextInput',
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '$borderColor',
  outlineStyle: 'none',

  variants: {
    size: {
      small: {
        height: 36,
        fontSize: 14,
        lineHeight: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
      },
      medium: {
        height: 44,
        fontSize: 16,
        lineHeight: 22,
        paddingHorizontal: 12,
        paddingVertical: 8,
      },
      large: {
        height: 52,
        fontSize: 18,
        lineHeight: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
    },

    variant: {
      default: {
        backgroundColor: '$backgroundSecondary',
        borderWidth: 0,
      },
      outline: {
        backgroundColor: '$backgroundSecondary',
        borderWidth: 0.5,
      },
      filled: {
        backgroundColor: '$backgroundTertiary',
        borderWidth: 0,
      },
    },

    status: {
      default: {},
      error: {
        borderColor: '$error',
      },
      success: {
        borderColor: '$success',
      },
    },

    focused: {
      true: {
        borderColor: '$primary',
      },
    },

    rounded: {
      true: {},
    },
  },

  defaultVariants: {
    size: 'medium',
    variant: 'default',
    status: 'default',
    focused: false,
    rounded: false,
  },
});

// Helper functions
const getIconSize = (size: 'small' | 'medium' | 'large', customSize?: number) => {
  if (customSize) return customSize;
  switch (size) {
    case 'small':
      return 16;
    case 'large':
      return 24;
    default:
      return 20;
  }
};

const getBorderRadius = (size: 'small' | 'medium' | 'large', rounded: boolean) => {
  if (rounded) {
    switch (size) {
      case 'small':
        return 8;
      case 'large':
        return 12;
      default:
        return 10;
    }
  }
  switch (size) {
    case 'small':
      return 8;
    case 'large':
      return 12;
    default:
      return 10;
  }
};

/**
 * ThemedTextInput - A comprehensive themed text input component
 *
 * Features:
 * - Multiple variants: default, outline, filled
 * - Size options: small, medium, large
 * - Status states: default, error, success
 * - Icon support with configurable positioning
 * - Password input with visibility toggle
 * - Label and helper text support
 * - Comprehensive accessibility features
 * - Theme-aware styling
 */
export const ThemedTextInput = memo(
  forwardRef<TextInput, ThemedTextInputProps>(
    (
      {
        style,
        lightColor: _lightColor,
        darkColor: _darkColor,
        lightPlaceholder: _lightPlaceholder,
        darkPlaceholder: _darkPlaceholder,
        lightBorder: _lightBorder,
        darkBorder: _darkBorder,
        label,
        helperText,
        iconName,
        iconPosition = 'left',
        iconSize,
        status = 'default',
        size = 'medium',
        variant = 'default',
        rounded = false,
        secureTextEntry = false,
        showPasswordToggle = false,
        containerStyle,
        labelStyle,
        inputContainerStyle,
        helperTextStyle,
        ...rest
      },
      ref
    ) => {
      const [focused, setFocused] = useState(false);
      const [passwordVisible, setPasswordVisible] = useState(!secureTextEntry);

      // const tokens = getTokens(); // Removed as not currently used

      // Calculate colors with theme awareness
      const textColor = useThemeColor('text', {
        light: _lightColor || '#000000',
        dark: _darkColor || '#FFFFFF',
      });
      const placeholderTextColor = useThemeColor('placeholder', {
        light: _lightPlaceholder || '#8E8E93',
        dark: _darkPlaceholder || '#ABABAB',
      });

      const computedIconSize = getIconSize(size, iconSize);
      const iconColor = focused ? '#007AFF' : '#8E8E93';

      const outlineBorderColor = useThemeColor('border', {
        light: 'rgba(0,0,0,0.1)',
        dark: 'rgba(255,255,255,0.1)',
      });

      const iosBackgroundColor = useThemeColor('backgroundSecondary', {
        light: '#F8F8F8',
        dark: '#2C2C2E',
      });

      const iosFilledBackgroundColor = useThemeColor('backgroundTertiary', {
        light: '#F0F0F0',
        dark: '#3A3A3C',
      });

      const helperTextVariant =
        status === 'error' ? 'error' : status === 'success' ? 'success' : 'default';

      const passwordToggleLabel = passwordVisible ? 'Hide password' : 'Show password';

      const visibilityIcon = passwordVisible ? 'lock.open.fill' : 'lock.fill';
      const borderRadius = getBorderRadius(size, rounded);

      const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(true);
        rest.onFocus?.(e);
      };

      const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(false);
        rest.onBlur?.(e);
      };

      const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
      };

      return (
        <Stack width="100%" marginBottom={16} style={containerStyle}>
          {label && (
            <ThemedText type="body2" weight="medium" style={[styles.labelSpacing, labelStyle]}>
              {label}
            </ThemedText>
          )}

          <Stack
            position="relative"
            width="100%"
            flexDirection="row"
            alignItems="center"
            style={inputContainerStyle}
          >
            {iconName && iconPosition === 'left' && (
              <Stack position="absolute" left={12} zIndex={1} style={styles.iconContainer}>
                <IconSymbol name={iconName} size={computedIconSize} color={iconColor} />
              </Stack>
            )}

            <StyledInput
              ref={ref}
              size={size}
              variant={variant}
              status={status}
              focused={focused}
              rounded={rounded}
              borderRadius={borderRadius}
              backgroundColor={variant === 'filled' ? iosFilledBackgroundColor : iosBackgroundColor}
              borderColor={variant === 'outline' && !focused ? outlineBorderColor : undefined}
              // color={textColor} // Commented out due to Tamagui type issues
              placeholderTextColor={placeholderTextColor}
              cursorColor={'#007AFF'}
              selectionColor={'#007AFF'}
              onFocus={handleFocus}
              onBlur={handleBlur}
              secureTextEntry={secureTextEntry && !passwordVisible}
              accessibilityLabel={rest.accessibilityLabel || label || rest.placeholder}
              accessibilityHint={rest.accessibilityHint}
              accessibilityState={{
                disabled: rest.editable === false,
              }}
              returnKeyType={rest.returnKeyType}
              onSubmitEditing={rest.onSubmitEditing}
              blurOnSubmit={rest.blurOnSubmit}
              paddingLeft={iconName && iconPosition === 'left' ? computedIconSize + 20 : undefined}
              paddingRight={
                (iconName && iconPosition === 'right') || (secureTextEntry && showPasswordToggle)
                  ? computedIconSize + 20
                  : undefined
              }
              flex={1}
              style={[{ color: textColor }, style]}
              {...rest}
            />

            {iconName && iconPosition === 'right' && !showPasswordToggle && (
              <Stack position="absolute" right={12} zIndex={1} style={styles.iconContainer}>
                <IconSymbol name={iconName} size={computedIconSize} color={iconColor} />
              </Stack>
            )}

            {secureTextEntry && showPasswordToggle && (
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={togglePasswordVisibility}
                accessibilityRole="button"
                accessibilityLabel={passwordToggleLabel}
              >
                <IconSymbol name={visibilityIcon} size={computedIconSize} color={iconColor} />
              </TouchableOpacity>
            )}
          </Stack>

          {helperText && (
            <ThemedText
              type="caption"
              variant={helperTextVariant}
              style={[styles.helperTextSpacing, helperTextStyle]}
            >
              {helperText}
            </ThemedText>
          )}
        </Stack>
      );
    }
  )
);

ThemedTextInput.displayName = 'ThemedTextInput';

const styles = StyleSheet.create({
  labelSpacing: {
    marginBottom: 4,
  },
  helperTextSpacing: {
    marginTop: 4,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
