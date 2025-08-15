import { Switch, type SwitchProps } from 'react-native';
import * as Haptics from 'expo-haptics';

import { useThemeColor } from '@/hooks/use-theme-color';

export type SwitchSize = 'small' | 'medium' | 'large';

export type ThemedSwitchProps = SwitchProps & {
  // Thumb colors
  lightThumbColor?: string;
  darkThumbColor?: string;

  // Track colors - using object structure like React Native Switch
  lightTrackColor?: { false?: string; true?: string };
  darkTrackColor?: { false?: string; true?: string };

  // Size variants
  size?: SwitchSize;

  // Utility states
  loading?: boolean;

  // Interaction enhancements
  haptics?: boolean;
};

export function ThemedSwitch({
  lightThumbColor,
  darkThumbColor,
  lightTrackColor,
  darkTrackColor,
  size = 'medium',
  loading = false,
  haptics = true,
  onValueChange,
  style,
  ...otherProps
}: ThemedSwitchProps) {
  const thumbColor = useThemeColor('switchThumb', {
    light: lightThumbColor,
    dark: darkThumbColor,
  });

  const trackColor = {
    false: useThemeColor('switchTrackInactive', {
      light: lightTrackColor?.false,
      dark: darkTrackColor?.false,
    }),
    true: useThemeColor('switchTrackActive', {
      light: lightTrackColor?.true,
      dark: darkTrackColor?.true,
    }),
  };

  // Size scaling
  const sizeScale = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;

  // Enhanced value change handler
  const handleValueChange = (value: boolean) => {
    if (loading) return;

    if (haptics) {
      Haptics.selectionAsync();
    }

    onValueChange?.(value);
  };

  return (
    <Switch
      thumbColor={thumbColor}
      trackColor={trackColor}
      onValueChange={handleValueChange}
      disabled={loading || otherProps.disabled}
      style={[
        {
          transform: [{ scale: sizeScale }],
          opacity: loading ? 0.6 : 1,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
