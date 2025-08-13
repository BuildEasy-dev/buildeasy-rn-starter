import { DrawerNavigationOptions, DrawerNavigationProp } from '@react-navigation/drawer';
import { Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface CreateDrawerOptionsProps {
  /**
   * Drawer position
   * @default 'left'
   */
  position?: 'left' | 'right';
  /**
   * Drawer type
   * @default 'front'
   */
  type?: 'front' | 'back' | 'slide' | 'permanent';
  /**
   * Drawer width
   * @default 280
   */
  width?: number;
  /**
   * Whether to hide status bar when drawer is open
   * @default false
   */
  hideStatusBar?: boolean;
  /**
   * Overlay color when drawer is open
   */
  overlayColor?: string;
  /**
   * Whether swipe gestures are enabled
   * @default true
   */
  swipeEnabled?: boolean;
  /**
   * Edge width for swipe gesture detection
   * @default 20
   */
  swipeEdgeWidth?: number;
  /**
   * Whether to show header
   * @default false (since we often use custom headers)
   */
  headerShown?: boolean;
}

/**
 * createDrawerOptions - Create standardized drawer navigation options
 *
 * @example
 * ```tsx
 * import { Drawer } from 'expo-router/drawer';
 * import { createDrawerOptions } from '@/components/layout';
 *
 * export default function DrawerLayout() {
 *   return (
 *     <Drawer screenOptions={createDrawerOptions()}>
 *       <Drawer.Screen name="home" />
 *     </Drawer>
 *   );
 * }
 * ```
 */
export function createDrawerOptions(
  props?: CreateDrawerOptionsProps
): DrawerNavigationOptions | ((props: any) => DrawerNavigationOptions) {
  return () => {
    const backgroundColor = useThemeColor('background');
    const tintColor = useThemeColor('tint');
    const textColor = useThemeColor('text');

    const {
      position = 'left',
      type = 'front',
      width = 280,
      hideStatusBar = false,
      overlayColor = 'rgba(0, 0, 0, 0.5)',
      swipeEnabled = true,
      swipeEdgeWidth = 20,
      headerShown = false,
    } = props || {};

    return {
      headerShown,
      drawerPosition: position,
      drawerType: type,
      drawerStyle: {
        backgroundColor,
        width,
      },
      drawerContentStyle: {
        backgroundColor,
      },
      drawerActiveTintColor: tintColor,
      drawerInactiveTintColor: textColor,
      drawerActiveBackgroundColor: `${tintColor}15`,
      drawerInactiveBackgroundColor: 'transparent',
      drawerLabelStyle: {
        fontSize: 16,
        fontWeight: '500',
      },
      drawerItemStyle: {
        borderRadius: 8,
        marginHorizontal: 8,
        marginVertical: 2,
      },
      overlayColor,
      drawerHideStatusBarOnOpen: hideStatusBar,
      swipeEnabled,
      swipeEdgeWidth,
      drawerStatusBarAnimation: Platform.select({
        ios: 'slide',
        default: 'none',
      }),
    };
  };
}

/**
 * useDrawerActions - Hook for common drawer actions
 *
 * @example
 * ```tsx
 * const { toggleDrawer, openDrawer, closeDrawer } = useDrawerActions();
 *
 * <Pressable onPress={toggleDrawer}>
 *   <IconSymbol name="line.3.horizontal" />
 * </Pressable>
 * ```
 */
export function useDrawerActions() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return {
    toggleDrawer: () => navigation.toggleDrawer(),
    openDrawer: () => navigation.openDrawer(),
    closeDrawer: () => navigation.closeDrawer(),
  };
}
