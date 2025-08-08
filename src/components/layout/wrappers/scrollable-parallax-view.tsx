import React, { useRef, useEffect } from 'react';
import ParallaxScrollView, { type ParallaxScrollViewRef } from '@/components/parallax-scroll-view';
import { useScrollToTop } from './tab-screen-wrapper';

type ParallaxScrollViewProps = React.ComponentProps<typeof ParallaxScrollView>;

/**
 * A ParallaxScrollView that automatically integrates with TabScreenWrapper's scroll-to-top functionality
 */
export function ScrollableParallaxView(props: ParallaxScrollViewProps) {
  const scrollRef = useRef<ParallaxScrollViewRef>(null);
  const scrollToTopContext = useScrollToTop();

  // Register scroll handler with TabScreenWrapper
  useEffect(() => {
    if (scrollToTopContext && scrollRef.current) {
      scrollToTopContext.registerScrollHandler((options) => {
        scrollRef.current?.scrollTo(options || { y: 0, animated: true });
      });
    }
  }, [scrollToTopContext]);

  return <ParallaxScrollView ref={scrollRef} {...props} />;
}
