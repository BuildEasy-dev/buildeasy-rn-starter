import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedSafeAreaViewProps = SafeAreaViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedSafeAreaView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedSafeAreaViewProps) {
  const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });

  return <SafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
}
