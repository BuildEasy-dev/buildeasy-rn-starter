import { FlatList, type FlatListProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedFlatListProps<ItemT> = FlatListProps<ItemT> & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedFlatList<ItemT>({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedFlatListProps<ItemT>) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <FlatList style={[{ backgroundColor }, style]} {...otherProps} />;
}
