import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import React, { forwardRef, useImperativeHandle } from 'react';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed/themed-view';
import { useTabBarScrollProps } from '@/hooks/use-tab-bar-scroll-props';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { withScrollToTop } from '@/hooks/with-scroll-to-top';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export interface ParallaxScrollViewRef {
  scrollTo: (options: { x?: number; y?: number; animated?: boolean }) => void;
}

const ParallaxScrollView = forwardRef<ParallaxScrollViewRef, Props>(
  ({ children, headerImage, headerBackgroundColor }, ref) => {
    const colorScheme = useColorScheme() ?? 'light';
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);
    const { scrollIndicatorInsets, bottomPadding } = useTabBarScrollProps();

    // Expose scrollTo method via ref
    useImperativeHandle(
      ref,
      () => ({
        scrollTo: (options: { x?: number; y?: number; animated?: boolean }) => {
          scrollRef.current?.scrollTo({
            x: options.x || 0,
            y: options.y || 0,
            animated: options.animated ?? true,
          });
        },
      }),
      [scrollRef]
    );

    const headerAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: interpolate(
              scrollOffset.value,
              [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
              [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
            ),
          },
          {
            scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
          },
        ],
      };
    });

    return (
      <ThemedView style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          scrollIndicatorInsets={scrollIndicatorInsets}
          contentContainerStyle={bottomPadding}
        >
          <Animated.View
            style={[
              styles.header,
              { backgroundColor: headerBackgroundColor[colorScheme] },
              headerAnimatedStyle,
            ]}
          >
            {headerImage}
          </Animated.View>
          <ThemedView style={styles.content}>{children}</ThemedView>
        </Animated.ScrollView>
      </ThemedView>
    );
  }
);

ParallaxScrollView.displayName = 'ParallaxScrollView';

export default ParallaxScrollView;

/**
 * A ParallaxScrollView that automatically integrates with TabScreenWrapper's scroll-to-top functionality
 */
export const ScrollableParallaxView = withScrollToTop(ParallaxScrollView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
