import { DrawerNavigationOptions } from '@react-navigation/drawer';
import { Platform } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface CreateDrawerOptionsProps {
  /**
   * Drawer position - Which side of the screen the drawer appears on
   * - 'left': Drawer slides in from the left side
   * - 'right': Drawer slides in from the right side
   * @default 'left'
   */
  position?: 'left' | 'right';
  /**
   * Drawer type - Controls how the drawer animates and appears
   * - 'front': Drawer slides over the screen with an modal
   * - 'back': Screen slides away to reveal drawer behind it
   * - 'slide': Both screen and drawer slide together
   * - 'permanent': Drawer is always visible (good for tablets)
   * @default 'slide' on iOS, 'front' on Android
   */
  type?: 'front' | 'back' | 'slide' | 'permanent';
  /**
   * Drawer width - The width of the drawer in pixels
   * Determines how much screen space the drawer occupies when open
   * @default 280
   */
  width?: number;
  /**
   * Whether to hide status bar when drawer is open
   * Controls if the status bar (time, battery, etc.) is hidden during drawer open state
   * @default false
   */
  hideStatusBar?: boolean;
  /**
   * Modal color when drawer is open
   * The semi-transparent color that covers the main content when drawer is open
   * Supports rgba, hex, or named colors (e.g., 'rgba(0, 0, 0, 0.5)')
   * @default 'rgba(0, 0, 0, 0.5)'
   */
  modalColor?: string;
  /**
   * Whether swipe gestures are enabled
   * Controls if users can open/close the drawer by swiping from the screen edge
   * @default true
   */
  swipeEnabled?: boolean;
  /**
   * Edge width for swipe gesture detection
   * The width (in pixels) from the screen edge where swipe gestures are detected
   * Larger values make it easier to trigger the drawer with swipes
   * @default 20
   */
  swipeEdgeWidth?: number;
  /**
   * Whether to show the default navigation header
   * Controls if the built-in header with back button and title is displayed
   * Set to false when using custom headers or when header is not needed
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
      type = Platform.select({
        ios: 'slide',
        android: 'front',
        default: 'front',
      }) as 'front' | 'back' | 'slide' | 'permanent',
      width = 280,
      hideStatusBar = false,
      modalColor = 'rgba(0, 0, 0, 0.5)',
      swipeEnabled = true,
      swipeEdgeWidth = 20,
      headerShown = false,
    } = props || {};

    return {
      // Header configuration
      headerShown, // Whether to show the default navigation header

      // Drawer positioning and behavior
      drawerPosition: position, // Which side the drawer appears on ('left' or 'right')
      drawerType: type, // Animation type for drawer appearance

      // Drawer container styling
      drawerStyle: {
        backgroundColor, // Background color of the drawer container
        width, // Width of the drawer in pixels
      },

      // Drawer content area styling
      drawerContentStyle: {
        backgroundColor, // Background color of the drawer content area
      },

      // Drawer item colors
      drawerActiveTintColor: tintColor, // Text/icon color for the active drawer item
      drawerInactiveTintColor: textColor, // Text/icon color for inactive drawer items
      drawerActiveBackgroundColor: `${tintColor}15`, // Background color for active drawer item (15% opacity)
      drawerInactiveBackgroundColor: 'transparent', // Background color for inactive drawer items

      // Drawer item text styling
      drawerLabelStyle: {
        fontSize: 16, // Font size for drawer item labels
        fontWeight: '500', // Font weight for drawer item labels
      },

      // Drawer item container styling
      drawerItemStyle: {
        borderRadius: 8, // Border radius for drawer item containers
        marginHorizontal: 8, // Horizontal margin for drawer items
        marginVertical: 2, // Vertical margin for drawer items
      },

      // Modal and interaction
      modalColor, // Color of the modal when drawer is open
      drawerHideStatusBarOnOpen: hideStatusBar, // Whether to hide status bar when drawer opens
      swipeEnabled, // Whether swipe gestures are enabled
      swipeEdgeWidth, // Width of the edge area for swipe gesture detection

      // Platform-specific status bar animation
      drawerStatusBarAnimation: Platform.select({
        ios: 'slide', // Smooth slide animation on iOS
        default: 'none', // No animation on other platforms
      }),
    };
  };
}
