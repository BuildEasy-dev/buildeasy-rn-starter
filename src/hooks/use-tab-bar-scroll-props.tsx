import { useMemo } from 'react';
import { useTabBarInset } from '@/contexts/tab-bar-inset-context';

/**
 * Hook that returns common props needed for scrollable components in tab screens
 * to handle tab bar overlap correctly
 *
 * @example
 * ```tsx
 * // For ScrollView/FlatList
 * const scrollProps = useTabBarScrollProps();
 * <ScrollView {...scrollProps}>
 *
 * // For custom content container style
 * const scrollProps = useTabBarScrollProps({ paddingHorizontal: 16 });
 * <ScrollView contentContainerStyle={scrollProps.contentContainerStyle}>
 *
 * // Get just the bottom inset value
 * const { bottomInset } = useTabBarScrollProps();
 * ```
 */
export function useTabBarScrollProps(additionalStyle?: Record<string, any>) {
  const bottomInset = useTabBarInset();

  return useMemo(
    () => ({
      // The bottom inset value for custom usage
      bottomInset,

      // Ready-to-use props for ScrollView/FlatList
      contentContainerStyle: {
        paddingBottom: bottomInset,
        ...additionalStyle,
      },
      scrollIndicatorInsets: {
        bottom: bottomInset,
      },

      // Individual style objects for more flexibility
      bottomPadding: { paddingBottom: bottomInset },
      scrollInsets: { bottom: bottomInset },
    }),
    [bottomInset, additionalStyle]
  );
}
