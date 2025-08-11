import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { SectionList, type SectionListProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export type ThemedSectionListProps<ItemT, SectionT = any> = SectionListProps<ItemT, SectionT> & {
  lightColor?: string;
  darkColor?: string;
  enableScrollToTop?: boolean;
};

export interface ScrollToTopSectionListRef {
  scrollToTop: (animated?: boolean) => void;
}

function ThemedSectionListComponent<ItemT, SectionT = any>(
  {
    style,
    lightColor,
    darkColor,
    enableScrollToTop = false,
    ...otherProps
  }: ThemedSectionListProps<ItemT, SectionT>,
  ref: React.Ref<SectionList<ItemT, SectionT>>
) {
  const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });

  return <SectionList ref={ref} style={[{ backgroundColor }, style]} {...otherProps} />;
}

export const ThemedSectionList = forwardRef(ThemedSectionListComponent) as <ItemT, SectionT = any>(
  props: ThemedSectionListProps<ItemT, SectionT> & { ref?: React.Ref<SectionList<ItemT, SectionT>> }
) => React.ReactElement;

/**
 * A ThemedSectionList that automatically integrates with TabScreenWrapper's scroll-to-top functionality.
 *
 * **Use Cases:**
 * - Settings pages with grouped configuration options
 * - Contact lists organized alphabetically or by category
 * - Content organized by date, category, or other grouping criteria
 * - Feature lists with logical sections and dividers
 * - Any full-page grouped data display
 *
 * **When to use:**
 * - For grouped/sectioned data with headers and separators
 * - When building settings, preferences, or configuration screens
 * - For contact lists, categorized content, or organized data
 * - When you need section headers, footers, or sticky headers
 * - For full-page lists that serve as the main content container
 *
 * **When NOT to use:**
 * - For simple, non-grouped lists (use ScrollToTopFlatList instead)
 * - For mixed content layouts (use ScrollToTopScrollView instead)
 * - When sections are not needed for your data structure
 */
function ScrollToTopSectionListComponent<ItemT, SectionT = any>(
  { enableScrollToTop = true, ...props }: ThemedSectionListProps<ItemT, SectionT>,
  ref: React.Ref<ScrollToTopSectionListRef>
) {
  const sectionListRef = useRef<SectionList<ItemT, SectionT>>(null);
  const scrollToTopContext = useScrollToTop();

  // Expose scrollToTop method via ref
  useImperativeHandle(
    ref,
    () => ({
      scrollToTop: (animated = true) => {
        sectionListRef.current?.scrollToLocation({
          sectionIndex: 0,
          itemIndex: 0,
          animated,
        });
      },
    }),
    []
  );

  // Register scroll handler with scroll-to-top context
  useEffect(() => {
    if (!enableScrollToTop || !scrollToTopContext) return;

    const scrollHandler = (options?: { x?: number; y?: number; animated?: boolean }) => {
      // For SectionList, scroll to top by going to first section, first item
      sectionListRef.current?.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        animated: options?.animated ?? true,
      });
    };

    scrollToTopContext.registerScrollHandler(scrollHandler);
  }, [scrollToTopContext, enableScrollToTop]);

  return (
    <ThemedSectionList ref={sectionListRef} enableScrollToTop={enableScrollToTop} {...props} />
  );
}

export const ScrollToTopSectionList = forwardRef(ScrollToTopSectionListComponent) as <
  ItemT,
  SectionT = any,
>(
  props: ThemedSectionListProps<ItemT, SectionT> & {
    ref?: React.Ref<ScrollToTopSectionListRef>;
  }
) => React.ReactElement;
