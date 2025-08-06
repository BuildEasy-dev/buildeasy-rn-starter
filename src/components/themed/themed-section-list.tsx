import { SectionList, type SectionListProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedSectionListProps<ItemT, SectionT = any> = SectionListProps<ItemT, SectionT> & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedSectionList<ItemT, SectionT = any>({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedSectionListProps<ItemT, SectionT>) {
  const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });

  return <SectionList style={[{ backgroundColor }, style]} {...otherProps} />;
}
