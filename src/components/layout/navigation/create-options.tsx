import { Platform } from 'react-native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

/**
 * Returns standardized options for modal screens that use ModalWrapper
 *
 * Default behavior:
 * - presentation: 'modal'
 * - headerShown: false (since ModalWrapper provides custom header)
 * - animation: 'slide_from_bottom' on iOS, 'slide_from_right' on Android
 * - gestureEnabled: true for swipe to dismiss
 */
export function createModalScreenOptions(): NativeStackNavigationOptions {
  return {
    presentation: 'modal',
    headerShown: false,
    animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'slide_from_right',
    gestureEnabled: true,
  };
}
