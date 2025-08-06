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
  const color = useThemeColor('text', { light: lightColor, dark: darkColor });
  const placeholderTextColor = useThemeColor('placeholder', {
    light: placeholderLightColor,
    dark: placeholderDarkColor,
  });

  return (
    <TextInput style={[{ color }, style]} placeholderTextColor={placeholderTextColor} {...rest} />
  );
}
