import React, { forwardRef } from 'react';
import { SectionList, type SectionListProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { withScrollToTop } from '@/hooks/with-scroll-to-top';

export type ThemedSectionListProps<ItemT, SectionT = any> = SectionListProps<ItemT, SectionT> & {
  lightColor?: string;
  darkColor?: string;
};

function ThemedSectionListComponent<ItemT, SectionT = any>(
  { style, lightColor, darkColor, ...otherProps }: ThemedSectionListProps<ItemT, SectionT>,
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
export const ScrollToTopSectionList = withScrollToTop(ThemedSectionList);
