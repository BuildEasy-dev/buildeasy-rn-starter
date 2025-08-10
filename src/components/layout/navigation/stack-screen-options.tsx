import { Platform } from 'react-native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

interface StackHeaderOptions {
  backButton?: 'default' | 'icon-only' | 'title-only' | 'hidden';
}

function getBackButtonConfig(backButtonType?: string) {
  switch (backButtonType) {
    case 'icon-only':
      return {
        headerBackTitleVisible: false,
      };

    case 'title-only':
      return {
        headerBackTitleVisible: true,
        headerBackImage: () => null,
      };

    case 'hidden':
      return {
        headerLeft: () => null,
        gestureEnabled: false,
      };

    case 'default':
    default:
      return {};
  }
}

export function createStackScreenOptions(
  options?: StackHeaderOptions
): NativeStackNavigationOptions {
  const backButtonConfig = getBackButtonConfig(options?.backButton);

  return {
    ...backButtonConfig,
    gestureEnabled: options?.backButton !== 'hidden',
    animation: Platform.select({
      ios: 'default',
      android: 'slide_from_right',
      default: 'slide_from_right',
    }),
  };
}
