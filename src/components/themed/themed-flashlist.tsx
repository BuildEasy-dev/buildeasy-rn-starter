import React, { forwardRef } from 'react';
import { FlashList, type FlashListProps } from '@shopify/flash-list';

import { useThemeColor } from '@/hooks/use-theme-color';
import { withScrollToTop } from '@/hooks/with-scroll-to-top';

export type ThemedFlashListProps<ItemT> = FlashListProps<ItemT> & {
  lightColor?: string;
  darkColor?: string;
};

function ThemedFlashListComponent<ItemT>(
  { contentContainerStyle, lightColor, darkColor, ...otherProps }: ThemedFlashListProps<ItemT>,
  ref: any
) {
  const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });

  return (
    <FlashList
      ref={ref}
      contentContainerStyle={{ backgroundColor, ...(contentContainerStyle as any) }}
      {...otherProps}
    />
  );
}

export const ThemedFlashList = forwardRef(ThemedFlashListComponent) as <ItemT>(
  props: ThemedFlashListProps<ItemT> & { ref?: any }
) => React.ReactElement;

/**
 * A ThemedFlashList that automatically integrates with TabScreenWrapper's scroll-to-top functionality.
 *
 * FlashList is an alternative to FlatList that uses cell recycling for rendering optimization.
 *
 * **Use cases:**
 * - Large lists with many items
 * - Complex item layouts
 * - Lists that require smooth scrolling
 * - Dynamic content where items may change size
 *
 * **Avoid when:**
 * - Using advanced FlatList features not supported by FlashList
 * - Items have highly variable heights without estimatedItemSize
 * - Need precise control over virtualization behavior
 * - Working with very simple, static lists where FlatList overhead is minimal
 */
export const ScrollToTopFlashList = withScrollToTop(ThemedFlashList);
