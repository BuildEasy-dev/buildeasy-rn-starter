import { Stack, styled } from '@tamagui/core';
import React, { forwardRef, useState, memo } from 'react';
import { Pressable, type ViewStyle, type PressableProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

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
  padding: '$2',
});

const StyledCheckbox = styled(Stack, {
  name: 'StyledCheckbox',
  borderWidth: 2,
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

// Helper function to get icon size based on checkbox size
const getIconSize = (size: 'small' | 'medium' | 'large'): number => {
  switch (size) {
    case 'small':
      return 10;
    case 'medium':
      return 14;
    case 'large':
      return 16;
    default:
      return 14;
  }
};

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
      const [pressed, setPressed] = useState(false);

      // Apply theme colors with fallback to Tamagui tokens
      // Note: backgroundColor is not used in the new checkmark design

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

      const handlePressIn = () => {
        setPressed(true);
      };

      const handlePressOut = () => {
        setPressed(false);
      };

      // Determine checkbox border color based on state
      const checkboxBorderColor = disabled ? disabledColor : focused ? checkColor : borderColor;

      const checkboxOpacity = disabled ? 0.6 : pressed ? 0.8 : 1;

      // Determine checkbox background color based on state
      const checkboxBackgroundColor = isChecked ? checkColor : 'transparent';

      return (
        <Pressable
          ref={ref}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
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
                <IconSymbol
                  name="checkmark"
                  size={getIconSize(size)}
                  color={isChecked ? 'white' : checkColor}
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
