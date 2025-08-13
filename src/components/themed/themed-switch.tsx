import { Switch, type SwitchProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedSwitchProps = SwitchProps & {
  lightThumbColor?: string;
  darkThumbColor?: string;
};

export function ThemedSwitch({
  lightThumbColor,
  darkThumbColor,
  ...otherProps
}: ThemedSwitchProps) {
  const thumbColor = useThemeColor('switchThumb', {
    light: lightThumbColor,
    dark: darkThumbColor,
  });
  const trackColor = {
    false: useThemeColor('switchTrackInactive'), // Inactive track
    true: useThemeColor('switchTrackActive'), // Active track
  };

  return <Switch thumbColor={thumbColor} trackColor={trackColor} {...otherProps} />;
}
