import React, { useRef, useEffect } from 'react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

/**
 * Higher-Order Component that adds scroll-to-top functionality to any scrollable component.
 *
 * This HOC automatically integrates with TabScreenWrapper's scroll-to-top functionality
 * by registering a scroll handler that can scroll the wrapped component to the top.
 *
 * @param Component - The component to wrap with scroll-to-top functionality
 * @returns A new component with scroll-to-top integration
 *
 * @example
 * ```tsx
 * const ScrollToTopScrollView = withScrollToTop(ThemedScrollView);
 * const ScrollToTopFlatList = withScrollToTop(ThemedFlatList);
 * ```
 */
export function withScrollToTop<TProps extends Record<string, any>>(
  Component: React.ComponentType<TProps>
) {
  const WrappedComponent = React.forwardRef<any, TProps>((props, forwardedRef) => {
    const scrollRef = useRef<any>(null);
    const scrollToTopContext = useScrollToTop();

    // Use forwarded ref if provided, otherwise use internal ref
    const ref = forwardedRef || scrollRef;

    useEffect(() => {
      if (!scrollToTopContext) return;

      const scrollHandler = (options?: { x?: number; y?: number; animated?: boolean }) => {
        const currentRef = 'current' in ref ? ref.current : ref;
        if (!currentRef) return;

        const animated = options?.animated ?? true;

        // Handle different types of scrollable components
        if ('scrollTo' in currentRef && typeof currentRef.scrollTo === 'function') {
          // ScrollView, Animated.ScrollView, etc.
          currentRef.scrollTo({ x: 0, y: 0, animated });
        } else if (
          'scrollToOffset' in currentRef &&
          typeof currentRef.scrollToOffset === 'function'
        ) {
          // FlatList, VirtualizedList, etc.
          currentRef.scrollToOffset({ offset: 0, animated });
        } else if (
          'scrollToLocation' in currentRef &&
          typeof currentRef.scrollToLocation === 'function'
        ) {
          // SectionList
          try {
            currentRef.scrollToLocation({ sectionIndex: 0, itemIndex: 0, animated });
          } catch {
            // Fallback if section/item doesn't exist
            if ('scrollToOffset' in currentRef) {
              currentRef.scrollToOffset({ offset: 0, animated });
            }
          }
        }
      };

      scrollToTopContext.registerScrollHandler(scrollHandler);
    }, [scrollToTopContext, ref]);

    return <Component {...(props as any)} ref={ref} />;
  });

  // Preserve display name for debugging
  const componentName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withScrollToTop(${componentName})`;

  return WrappedComponent;
}
