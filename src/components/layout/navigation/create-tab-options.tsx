import { Platform } from 'react-native';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { HapticTab } from '@/components/haptic-tab';
import TabBarBackground from '@/components/ui/tab-bar-background';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Returns standardized options for tab screens
 *
 * Default behavior:
 * - headerShown: false (using custom headers)
 * - tabBarActiveTintColor and inactiveTintColor based on platform
 * - Animation and gesture handling for smooth tab transitions
 */
export function useTabOptions(): BottomTabNavigationOptions {
  const tintColor = useThemeColor('tint');

  return {
    tabBarActiveTintColor: tintColor,
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
    tabBarStyle: Platform.select({
      ios: {
        // Use a transparent background on iOS to show the blur effect
        position: 'absolute',
      },
      default: {},
    }),
  };
}
