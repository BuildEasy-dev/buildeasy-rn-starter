import { forwardRef, useState, memo } from 'react';
import {
  View,
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
export type InputVariant = 'default' | 'subtle' | 'outline' | 'filled';
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

// Size configurations
const sizeConfigs = {
  small: {
    height: 40,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  medium: {
    height: 48,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  large: {
    height: 56,
    fontSize: 18,
    lineHeight: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
};

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

const getBorderRadius = (
  size: 'small' | 'medium' | 'large',
  rounded: boolean,
  variant: InputVariant
) => {
  // Subtle variant always has no border radius
  if (variant === 'subtle') {
    return 0;
  }

  if (rounded) {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 16;
      default:
        return 14;
    }
  }

  // Default border radius for modern look
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
 * - Multiple variants: default, subtle, outline, filled
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

      const borderColor = useThemeColor('border', {
        light: 'rgba(0,0,0,0.15)', // Stronger border for better visibility
        dark: 'rgba(255,255,255,0.25)',
      });

      // 2025 Design: Balance between minimal and recognizable
      const defaultBackgroundColor = useThemeColor('backgroundSecondary', {
        light: '#F2F2F7', // iOS standard light gray with better contrast
        dark: '#1C1C1E',
      });

      const filledBackgroundColor = useThemeColor('backgroundTertiary', {
        light: '#E5E5EA', // More visible contrast
        dark: '#2C2C2E',
      });

      // Get appropriate background based on variant - 2025 UX balance
      const getBackgroundColor = () => {
        // No background change on focus - only border color changes
        switch (variant) {
          case 'filled':
            return filledBackgroundColor;
          case 'subtle':
            return 'transparent'; // Always transparent for subtle
          case 'outline':
            return 'transparent'; // Always transparent for outline
          default:
            return defaultBackgroundColor;
        }
      };

      // Focus state only changes border color, no background change

      const helperTextVariant =
        status === 'error' ? 'error' : status === 'success' ? 'success' : 'default';

      const passwordToggleLabel = passwordVisible ? 'Hide password' : 'Show password';

      const visibilityIcon = passwordVisible ? 'lock.open.fill' : 'lock.fill';
      const borderRadius = getBorderRadius(size, rounded, variant);

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

      // Create input styles
      const sizeConfig = sizeConfigs[size];
      const inputStyles = [
        styles.baseInput,
        sizeConfig,
        {
          backgroundColor: getBackgroundColor(),
          color: textColor,
          borderRadius,
        },
        iconName && iconPosition === 'left' && { paddingLeft: computedIconSize + 20 },
        ((iconName && iconPosition === 'right') || (secureTextEntry && showPasswordToggle)) && {
          paddingRight: computedIconSize + 20,
        },
        variant === 'subtle' && {
          borderBottomWidth: 1,
          borderBottomColor:
            status === 'error'
              ? '#FF3B30'
              : status === 'success'
                ? '#34C759'
                : focused
                  ? '#007AFF'
                  : borderColor,
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderRadius: 0,
        },
        variant === 'outline' && {
          borderWidth: 1,
          borderColor:
            status === 'error'
              ? '#FF3B30'
              : status === 'success'
                ? '#34C759'
                : focused
                  ? '#007AFF'
                  : '#D1D1D6',
          backgroundColor: 'transparent',
        },
        style,
      ];

      return (
        <View style={[styles.container, containerStyle]}>
          {label && (
            <ThemedText type="body2" weight="medium" style={[styles.labelSpacing, labelStyle]}>
              {label}
            </ThemedText>
          )}

          <View style={[styles.inputContainer, inputContainerStyle]}>
            {iconName && iconPosition === 'left' && (
              <View style={[styles.iconContainer, styles.leftIcon]}>
                <IconSymbol name={iconName} size={computedIconSize} color={iconColor} />
              </View>
            )}

            <TextInput
              ref={ref}
              style={inputStyles}
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
              {...rest}
            />

            {iconName && iconPosition === 'right' && !showPasswordToggle && (
              <View style={[styles.iconContainer, styles.rightIcon]}>
                <IconSymbol name={iconName} size={computedIconSize} color={iconColor} />
              </View>
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
          </View>

          {helperText && (
            <ThemedText
              type="caption"
              variant={helperTextVariant}
              style={[styles.helperTextSpacing, helperTextStyle]}
            >
              {helperText}
            </ThemedText>
          )}
        </View>
      );
    }
  )
);

ThemedTextInput.displayName = 'ThemedTextInput';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  baseInput: {
    flex: 1,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  labelSpacing: {
    marginBottom: 4,
  },
  helperTextSpacing: {
    marginTop: 4,
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIcon: {
    left: 12,
  },
  rightIcon: {
    right: 12,
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
