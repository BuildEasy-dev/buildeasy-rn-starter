import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { FlatList, type FlatListProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export type ThemedFlatListProps<ItemT> = FlatListProps<ItemT> & {
  lightColor?: string;
  darkColor?: string;
  enableScrollToTop?: boolean;
};

export interface ScrollToTopFlatListRef {
  scrollToTop: (animated?: boolean) => void;
}

function ThemedFlatListComponent<ItemT>(
  {
    style,
    lightColor,
    darkColor,
    enableScrollToTop = false,
    ...otherProps
  }: ThemedFlatListProps<ItemT>,
  ref: React.Ref<FlatList<ItemT>>
) {
  const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });

  return <FlatList ref={ref} style={[{ backgroundColor }, style]} {...otherProps} />;
}

export const ThemedFlatList = forwardRef(ThemedFlatListComponent) as <ItemT>(
  props: ThemedFlatListProps<ItemT> & { ref?: React.Ref<FlatList<ItemT>> }
) => React.ReactElement;

/**
 * A ThemedFlatList that automatically integrates with TabScreenWrapper's scroll-to-top functionality.
 *
 * **Use Cases:**
 * - Simple lists with uniform item structure (posts, products, users)
 * - Search results and filtered content displays
 * - Performance-optimized lists with many similar items
 * - Lists that need pull-to-refresh and infinite scroll capabilities
 *
 * **When to use:**
 * - For lists of homogeneous data (same item structure throughout)
 * - When you need optimized rendering for large datasets
 * - For simple, non-grouped list layouts
 * - When performance is critical for scrolling through many items
 *
 * **When NOT to use:**
 * - For grouped/sectioned data (use ScrollToTopSectionList instead)
 * - For mixed content layouts (use ScrollToTopScrollView instead)
 * - When you need section headers or complex grouping
 */
function ScrollToTopFlatListComponent<ItemT>(
  { enableScrollToTop = true, ...props }: ThemedFlatListProps<ItemT>,
  ref: React.Ref<ScrollToTopFlatListRef>
) {
  const flatListRef = useRef<FlatList<ItemT>>(null);
  const scrollToTopContext = useScrollToTop();

  // Expose scrollToTop method via ref
  useImperativeHandle(
    ref,
    () => ({
      scrollToTop: (animated = true) => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated });
      },
    }),
    []
  );

  // Register scroll handler with scroll-to-top context
  useEffect(() => {
    if (!enableScrollToTop || !scrollToTopContext) return;

    const scrollHandler = (options?: { x?: number; y?: number; animated?: boolean }) => {
      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: options?.animated ?? true,
      });
    };

    scrollToTopContext.registerScrollHandler(scrollHandler);
  }, [scrollToTopContext, enableScrollToTop]);

  return <ThemedFlatList ref={flatListRef} enableScrollToTop={enableScrollToTop} {...props} />;
}

export const ScrollToTopFlatList = forwardRef(ScrollToTopFlatListComponent) as <ItemT>(
  props: ThemedFlatListProps<ItemT> & { ref?: React.Ref<ScrollToTopFlatListRef> }
) => React.ReactElement;
