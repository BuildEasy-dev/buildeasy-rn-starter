import React from 'react';
import {
  TabView,
  TabBar,
  type TabViewProps,
  type Route,
  type TabBarProps,
  type NavigationState,
  type SceneRendererProps,
} from 'react-native-tab-view';
import { useWindowDimensions, StyleSheet, type ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface ThemedTabViewProps<T extends Route> extends Omit<TabViewProps<T>, 'renderTabBar'> {
  renderTabBar?: (
    props: SceneRendererProps & {
      navigationState: NavigationState<T>;
    }
  ) => React.ReactNode;
  tabBarPosition?: 'top' | 'bottom';
  tabBarStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
  scrollEnabled?: boolean;
  bounces?: boolean;
  pressOpacity?: number;
  pressColor?: string;
  tabStyle?: ViewStyle;
  indicatorContainerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export function ThemedTabView<T extends Route>({
  navigationState,
  renderScene,
  onIndexChange,
  renderTabBar,
  tabBarPosition = 'top',
  tabBarStyle,
  indicatorStyle,
  scrollEnabled = false,
  bounces = true,
  pressOpacity = 0.7,
  pressColor,
  tabStyle,
  indicatorContainerStyle,
  contentContainerStyle,
  ...rest
}: ThemedTabViewProps<T>) {
  const layout = useWindowDimensions();
  const backgroundColor = useThemeColor('background');

  const defaultRenderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<T>;
    }
  ) => (
    <ThemedTabBar
      {...props}
      style={tabBarStyle}
      indicatorStyle={indicatorStyle}
      scrollEnabled={scrollEnabled}
      bounces={bounces}
      pressOpacity={pressOpacity}
      pressColor={pressColor}
      tabStyle={tabStyle}
      indicatorContainerStyle={indicatorContainerStyle}
      contentContainerStyle={contentContainerStyle}
    />
  );

  return (
    <TabView
      navigationState={navigationState}
      renderScene={renderScene}
      onIndexChange={onIndexChange}
      renderTabBar={renderTabBar || defaultRenderTabBar}
      tabBarPosition={tabBarPosition}
      initialLayout={{ width: layout.width }}
      style={{ backgroundColor }}
      {...rest}
    />
  );
}

interface ThemedTabBarProps<T extends Route> extends Omit<TabBarProps<T>, 'style'> {
  style?: ViewStyle;
}

export function ThemedTabBar<T extends Route>({
  style,
  indicatorStyle,
  activeColor,
  inactiveColor: customInactiveColor,
  pressColor,
  pressOpacity = 0.7,
  scrollEnabled = false,
  bounces = true,
  tabStyle,
  indicatorContainerStyle,
  contentContainerStyle,
  ...props
}: ThemedTabBarProps<T>) {
  const backgroundColor = useThemeColor('background');
  const tintColor = useThemeColor('tint');
  const borderColor = useThemeColor('separator');
  const defaultInactiveColor = useThemeColor('tabIconDefault');

  return (
    <TabBar
      {...props}
      style={[
        {
          backgroundColor,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: borderColor,
          elevation: 0,
          shadowOpacity: 0,
        },
        style,
      ]}
      indicatorStyle={[
        {
          backgroundColor: tintColor,
          height: 2,
        },
        indicatorStyle,
      ]}
      activeColor={activeColor || tintColor}
      inactiveColor={customInactiveColor || defaultInactiveColor}
      pressColor={pressColor || `${tintColor}20`}
      pressOpacity={pressOpacity}
      scrollEnabled={scrollEnabled}
      bounces={bounces}
      tabStyle={[
        {
          minHeight: 48,
          paddingHorizontal: 12,
          ...(scrollEnabled && { minWidth: 80, maxWidth: 150 }),
        },
        tabStyle,
      ]}
      indicatorContainerStyle={indicatorContainerStyle}
      contentContainerStyle={contentContainerStyle}
    />
  );
}

// Re-export useful types and utilities
export {
  SceneMap,
  type Route,
  type NavigationState,
  type SceneRendererProps,
} from 'react-native-tab-view';
