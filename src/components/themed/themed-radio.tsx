import { Stack, styled } from '@tamagui/core';
import React, { forwardRef, useState, memo } from 'react';
import { Pressable, type ViewStyle, type PressableProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

import { ThemedText } from './themed-text';

export type ThemedRadioProps<T = string | number> = Omit<PressableProps, 'onPress' | 'style'> & {
  lightBorderColor?: string;
  darkBorderColor?: string;
  lightRadioColor?: string;
  darkRadioColor?: string;
  value?: T;
  selectedValue?: T;
  onValueChange?: (value: T) => void;
  disabled?: boolean;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  labelClassName?: string;
  style?: ViewStyle;
};

export type ThemedRadioGroupProps<T = string | number> = {
  children: React.ReactNode;
  selectedValue?: T;
  onValueChange?: (value: T) => void;
  style?: ViewStyle;
};

const StyledRadioContainer = styled(Stack, {
  name: 'StyledRadioContainer',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '$2',
});

const StyledRadio = styled(Stack, {
  name: 'StyledRadio',
  borderWidth: 2,
  borderRadius: 999,
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

const StyledRadioIndicator = styled(Stack, {
  name: 'StyledRadioIndicator',
  borderRadius: 999,
  backgroundColor: '$primary',

  variants: {
    size: {
      small: {
        width: 8,
        height: 8,
      },
      medium: {
        width: 10,
        height: 10,
      },
      large: {
        width: 12,
        height: 12,
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

export const ThemedRadio = memo(
  forwardRef<React.ElementRef<typeof Pressable>, ThemedRadioProps>(
    (
      {
        style,
        lightBorderColor,
        darkBorderColor,
        lightRadioColor,
        darkRadioColor,
        value,
        selectedValue,
        onValueChange,
        disabled = false,
        label,
        size = 'medium',
        ...rest
      },
      ref
    ) => {
      const [focused, setFocused] = useState(false);
      const [pressed, setPressed] = useState(false);
      const isSelected = selectedValue !== undefined ? selectedValue === value : false;

      // Apply theme colors with fallback to Tamagui tokens
      const borderColor = useThemeColor('border', {
        light: lightBorderColor,
        dark: darkBorderColor,
      });

      const radioColor = useThemeColor('tint', { light: lightRadioColor, dark: darkRadioColor });

      const disabledColor = useThemeColor('textSecondary');

      // Handle radio press
      const handlePress = () => {
        if (disabled || !value || isSelected) return;

        if (onValueChange) {
          onValueChange(value);
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

      // Determine radio border color based on state
      const radioBorderColor = disabled ? disabledColor : focused ? radioColor : borderColor;

      const radioOpacity = disabled ? 0.6 : pressed ? 0.8 : 1;

      return (
        <Pressable
          ref={ref}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={style}
          disabled={disabled}
          accessibilityRole="radio"
          accessibilityState={{ checked: isSelected, disabled }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        >
          <StyledRadioContainer>
            <StyledRadio
              size={size}
              style={{
                borderColor: radioBorderColor,
                opacity: radioOpacity,
              }}
            >
              {isSelected && (
                <StyledRadioIndicator
                  size={size}
                  style={{
                    backgroundColor: radioColor,
                  }}
                />
              )}
            </StyledRadio>

            {label && (
              <StyledLabel>
                <ThemedText
                  type="body2"
                  style={{
                    opacity: disabled ? 0.6 : 1,
                  }}
                >
                  {label}
                </ThemedText>
              </StyledLabel>
            )}
          </StyledRadioContainer>
        </Pressable>
      );
    }
  )
);

ThemedRadio.displayName = 'ThemedRadio';

// Helper function to create a typed radio component
export function createThemedRadio<T>() {
  return ThemedRadio as React.ForwardRefExoticComponent<
    ThemedRadioProps<T> & React.RefAttributes<React.ElementRef<typeof Pressable>>
  >;
}

const StyledRadioGroup = styled(Stack, {
  name: 'StyledRadioGroup',
  flexDirection: 'column',
});

export function ThemedRadioGroup<T = string | number>({
  children,
  selectedValue,
  onValueChange,
  style,
}: ThemedRadioGroupProps<T>) {
  return (
    <StyledRadioGroup style={style}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<ThemedRadioProps<T>>(child)) {
          return React.cloneElement(child, {
            selectedValue,
            onValueChange,
          });
        }
        return child;
      })}
    </StyledRadioGroup>
  );
}

// Helper function to create a typed radio group
export function createThemedRadioGroup<T>() {
  return ThemedRadioGroup as React.FC<ThemedRadioGroupProps<T>>;
}
