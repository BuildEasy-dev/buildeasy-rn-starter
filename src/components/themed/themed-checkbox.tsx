import { Stack, styled } from '@tamagui/core';
import React, { forwardRef, useState, memo } from 'react';
import { Pressable, type ViewStyle, type PressableProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

import { ThemedText } from './themed-text';

export type ThemedCheckboxProps = Omit<PressableProps, 'onPress' | 'style'> & {
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
  lightBorderColor?: string;
  darkBorderColor?: string;
  lightCheckColor?: string;
  darkCheckColor?: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  labelClassName?: string;
  style?: ViewStyle;
};

const StyledCheckboxContainer = styled(Stack, {
  name: 'StyledCheckboxContainer',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '$1',
});

const StyledCheckbox = styled(Stack, {
  name: 'StyledCheckbox',
  borderWidth: 1,
  borderRadius: '$1',
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: '$border',

  variants: {
    size: {
      small: {
        width: 16,
        height: 16,
      },
      medium: {
        width: 20,
        height: 20,
      },
      large: {
        width: 24,
        height: 24,
      },
    },
  },

  defaultVariants: {
    size: 'medium',
  },
});

const StyledCheckmark = styled(Stack, {
  name: 'StyledCheckmark',
  borderRadius: '$0.5',
  backgroundColor: '$primary',

  variants: {
    size: {
      small: {
        width: 10,
        height: 10,
      },
      medium: {
        width: 14,
        height: 14,
      },
      large: {
        width: 16,
        height: 16,
      },
    },
  },

  defaultVariants: {
    size: 'medium',
  },
});

const StyledLabel = styled(Stack, {
  name: 'StyledLabel',
  marginLeft: '$2',
});

export const ThemedCheckbox = memo(
  forwardRef<React.ElementRef<typeof Pressable>, ThemedCheckboxProps>(
    (
      {
        style,
        lightBackgroundColor,
        darkBackgroundColor,
        lightBorderColor,
        darkBorderColor,
        lightCheckColor,
        darkCheckColor,
        value = false,
        onValueChange,
        disabled = false,
        label,
        size = 'medium',
        ...rest
      },
      ref
    ) => {
      const [isChecked, setIsChecked] = useState(value);
      const [focused, setFocused] = useState(false);

      // Apply theme colors with fallback to Tamagui tokens
      const backgroundColor = useThemeColor('background', {
        light: lightBackgroundColor,
        dark: darkBackgroundColor,
      });

      const borderColor = useThemeColor('border', {
        light: lightBorderColor,
        dark: darkBorderColor,
      });

      const checkColor = useThemeColor('tint', { light: lightCheckColor, dark: darkCheckColor });

      const disabledColor = useThemeColor('textSecondary');

      // Handle checkbox press
      const handlePress = () => {
        if (disabled) return;

        const newValue = !isChecked;
        setIsChecked(newValue);

        if (onValueChange) {
          onValueChange(newValue);
        }
      };

      const handleFocus = () => {
        setFocused(true);
      };

      const handleBlur = () => {
        setFocused(false);
      };

      // Determine checkbox border color based on state
      const checkboxBorderColor = disabled ? disabledColor : focused ? checkColor : borderColor;

      const checkboxOpacity = disabled ? 0.6 : 1;

      // Determine checkbox background color based on state
      const checkboxBackgroundColor = isChecked ? backgroundColor : 'transparent';

      return (
        <Pressable
          ref={ref}
          onPress={handlePress}
          style={style}
          disabled={disabled}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isChecked, disabled }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        >
          <StyledCheckboxContainer>
            <StyledCheckbox
              size={size}
              style={{
                borderColor: checkboxBorderColor,
                backgroundColor: checkboxBackgroundColor,
                opacity: checkboxOpacity,
              }}
            >
              {isChecked && (
                <StyledCheckmark
                  size={size}
                  style={{
                    backgroundColor: checkColor,
                  }}
                />
              )}
            </StyledCheckbox>

            {label && (
              <StyledLabel style={{ opacity: disabled ? 0.6 : 1 }}>
                <ThemedText type="body2">{label}</ThemedText>
              </StyledLabel>
            )}
          </StyledCheckboxContainer>
        </Pressable>
      );
    }
  )
);

ThemedCheckbox.displayName = 'ThemedCheckbox';
