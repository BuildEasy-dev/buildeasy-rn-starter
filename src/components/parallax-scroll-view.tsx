import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { forwardRef, useImperativeHandle } from 'react';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed/themed-view';
import { useBottomTabOverflow } from '@/components/ui/tab-bar-background';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
    const bottom = useBottomTabOverflow();

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
          scrollIndicatorInsets={{ bottom }}
          contentContainerStyle={{ paddingBottom: bottom }}
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
