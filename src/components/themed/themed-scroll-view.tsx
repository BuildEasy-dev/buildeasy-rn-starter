import React, { forwardRef } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export const ThemedScrollView = forwardRef<ScrollView, ThemedScrollViewProps>(
  ({ style, lightColor, darkColor, ...otherProps }, ref) => {
    const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });

    return <ScrollView ref={ref} style={[{ backgroundColor }, style]} {...otherProps} />;
  }
);

ThemedScrollView.displayName = 'ThemedScrollView';
