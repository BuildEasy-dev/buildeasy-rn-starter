import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';

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
    /**
     * Toggle drawer open/closed state
     * Opens the drawer if closed, closes it if open
     */
    toggleDrawer: () => navigation.toggleDrawer(),

    /**
     * Open the drawer
     * Forces the drawer to open regardless of current state
     */
    openDrawer: () => navigation.openDrawer(),

    /**
     * Close the drawer
     * Forces the drawer to close regardless of current state
     */
    closeDrawer: () => navigation.closeDrawer(),
  };
}
