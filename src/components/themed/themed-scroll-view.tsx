import React, { forwardRef } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { withScrollToTop } from '@/hooks/with-scroll-to-top';

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export const ThemedScrollView = forwardRef<ScrollView, ThemedScrollViewProps>(
  ({ style, lightColor, darkColor, ...otherProps }, ref) => {
    const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });

    return <ScrollView ref={ref} style={[{ backgroundColor }, style]} {...otherProps} />;
  }
);

ThemedScrollView.displayName = 'ThemedScrollView';

/**
 * A ThemedScrollView that automatically integrates with TabScreenWrapper's scroll-to-top functionality.
 *
 * **Use Cases:**
 * - Form pages with multiple input fields and mixed content
 * - Content pages with text, images, and interactive elements
 * - General purpose scrollable containers for complex layouts
 * - Pages that need custom scroll behavior but don't require list optimization
 *
 * **When to use:**
 * - When you need a general scrollable container for mixed content
 * - For pages with forms, text content, or custom layouts
 * - When FlatList/SectionList are overkill for your content structure
 *
 * **When NOT to use:**
 * - For large lists of similar items (use ScrollToTopFlatList instead)
 * - For grouped/sectioned data (use ScrollToTopSectionList instead)
 * - For performance-critical lists with many items
 */
export const ScrollToTopScrollView = withScrollToTop(ThemedScrollView);
