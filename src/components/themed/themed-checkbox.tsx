import React, { forwardRef, useState, memo, useEffect } from 'react';
import { Pressable, View, StyleSheet, type ViewStyle, type PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

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

// Size configurations
const sizeConfigs = {
  small: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
  medium: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  large: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
};

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

      // Animation values
      const checkboxScale = useSharedValue(1);
      const checkmarkScale = useSharedValue(isChecked ? 1 : 0);
      const checkmarkOpacity = useSharedValue(isChecked ? 1 : 0);
      const backgroundColorProgress = useSharedValue(isChecked ? 1 : 0);

      // Apply theme colors with fallback to Tamagui tokens
      // Note: backgroundColor is not used in the new checkmark design

      const borderColor = useThemeColor('border', {
        light: lightBorderColor,
        dark: darkBorderColor,
      });

      const checkColor = useThemeColor('tint', { light: lightCheckColor, dark: darkCheckColor });

      const disabledColor = useThemeColor('textSecondary');

      // Update animations when checked state changes
      useEffect(() => {
        if (isChecked) {
          checkmarkScale.value = withSpring(1, { damping: 12, stiffness: 200 });
          checkmarkOpacity.value = withTiming(1, { duration: 150 });
          backgroundColorProgress.value = withTiming(1, { duration: 200 });
        } else {
          checkmarkScale.value = withTiming(0, { duration: 100 });
          checkmarkOpacity.value = withTiming(0, { duration: 100 });
          backgroundColorProgress.value = withTiming(0, { duration: 150 });
        }
      }, [isChecked, checkmarkScale, checkmarkOpacity, backgroundColorProgress]);

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
        checkboxScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      };

      const handlePressOut = () => {
        setPressed(false);
        checkboxScale.value = withSpring(1, { damping: 15, stiffness: 300 });
      };

      // Determine checkbox border color based on state
      const checkboxBorderColor = disabled ? disabledColor : focused ? checkColor : borderColor;

      const checkboxOpacity = disabled ? 0.6 : pressed ? 0.8 : 1;

      // Animated styles - combine background and border on same element
      const animatedCheckboxStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkboxScale.value }],
        backgroundColor: interpolateColor(
          backgroundColorProgress.value,
          [0, 1],
          ['transparent', checkColor]
        ),
        borderColor: checkboxBorderColor,
        opacity: checkboxOpacity,
      }));

      const animatedCheckmarkStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkmarkScale.value }],
        opacity: checkmarkOpacity.value,
      }));

      const sizeConfig = sizeConfigs[size];

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
          <View style={styles.container}>
            <Animated.View style={[styles.checkbox, sizeConfig, animatedCheckboxStyle]}>
              <Animated.View style={animatedCheckmarkStyle}>
                <IconSymbol name="checkmark" size={getIconSize(size)} color="white" />
              </Animated.View>
            </Animated.View>

            {label && (
              <View style={styles.labelContainer}>
                <ThemedText type="body2" style={[styles.label, { opacity: disabled ? 0.6 : 1 }]}>
                  {label}
                </ThemedText>
              </View>
            )}
          </View>
        </Pressable>
      );
    }
  )
);

ThemedCheckbox.displayName = 'ThemedCheckbox';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  checkbox: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    marginLeft: 8,
  },
  label: {
    // Additional label styles can be added here
  },
});
