import { TextInput, type TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  placeholderLightColor?: string;
  placeholderDarkColor?: string;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  placeholderLightColor,
  placeholderDarkColor,
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const placeholderTextColor = useThemeColor(
    { light: placeholderLightColor, dark: placeholderDarkColor },
    'placeholder'
  );

  return (
    <TextInput style={[{ color }, style]} placeholderTextColor={placeholderTextColor} {...rest} />
  );
}
