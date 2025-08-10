import React, { useRef, useEffect, ReactNode } from 'react';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { ScreenWrapper, type ScreenWrapperProps } from './screen-wrapper';
import { ScrollToTopContext } from '@/contexts/scroll-to-top-context';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedScrollView } from '@/components/themed/themed-scroll-view';
import { useBottomTabOverflow } from '@/components/ui/tab-bar-background';
import { ModalHeaderButton, HeaderButtonVariant } from './modal-header-button';

type HeaderButtonConfig = {
  variant: HeaderButtonVariant;
  text?: string;
  onPress?: () => void;
  disabled?: boolean;
};

export interface TabScreenWrapperProps extends Omit<ScreenWrapperProps, 'scrollable'> {
  // Tab-specific features
  tabName?: string;
  scrollToTopOnPress?: boolean;

  // Override safeArea default for tab screens
  safeArea?: boolean | 'top' | 'bottom' | 'both';

  // Tab scrolling options - when true, creates optimized scrollable content with tab bar handling
  scrollable?: boolean;
  padding?: number; // Only applies when scrollable=true

  // Custom header - if provided, replaces the entire default header
  renderHeader?: () => ReactNode;

  // Header configuration - header will be shown if any of these props are provided
  headerTitle?: string;
  headerTitleAlign?: 'left' | 'center' | 'right';
  headerLeft?: ReactNode | HeaderButtonConfig;
  headerRight?: ReactNode | HeaderButtonConfig;
}

export function TabScreenWrapper({
  children,
  tabName,
  scrollToTopOnPress = true,
  safeArea = false, // Default to false - let inner components handle tab bar spacing
  scrollable = false,
  padding = 0,
  renderHeader,
  headerTitle,
  headerTitleAlign = 'center',
  headerLeft,
  headerRight,
  ...screenWrapperProps
}: TabScreenWrapperProps) {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const scrollHandlerRef = useRef<
    ((options?: { x?: number; y?: number; animated?: boolean }) => void) | null
  >(null);
  const bottom = useBottomTabOverflow();

  // Auto-determine if header should be shown based on header props
  const hasHeaderProps = !!(renderHeader || headerTitle || headerLeft || headerRight);

  // Helper function to render header button
  const renderHeaderButton = (config: ReactNode | HeaderButtonConfig | undefined) => {
    if (!config) return null;

    // If it's a React element, return as-is
    if (React.isValidElement(config)) {
      return config;
    }

    // If it's a config object, create a ModalHeaderButton
    if (typeof config === 'object' && 'variant' in config) {
      return (
        <ModalHeaderButton
          variant={config.variant}
          text={config.text}
          onPress={config.onPress}
          disabled={config.disabled}
        />
      );
    }

    return null;
  };

  // Tab Header Component
  const TabHeader = () => {
    // If custom header is provided, use it instead of default header
    if (renderHeader) {
      return <>{renderHeader()}</>;
    }

    // Otherwise, render default header
    return (
      <ThemedView style={styles.header}>
        {/* Left Button */}
        {headerLeft && (
          <ThemedView style={styles.headerLeft}>{renderHeaderButton(headerLeft)}</ThemedView>
        )}

        {/* Title */}
        {headerTitle && (
          <ThemedText style={[styles.headerTitle, { textAlign: headerTitleAlign }]}>
            {headerTitle}
          </ThemedText>
        )}

        {/* Right Button */}
        {headerRight && (
          <ThemedView style={styles.headerRight}>{renderHeaderButton(headerRight)}</ThemedView>
        )}
      </ThemedView>
    );
  };

  // Get current route name from navigation state
  const routeName = useNavigationState((state: any) => {
    if (state?.routes) {
      return state.routes[state.index]?.name;
    }
    return undefined;
  });

  // Context functions
  const registerScrollHandler = (
    scrollTo: (options?: { x?: number; y?: number; animated?: boolean }) => void
  ) => {
    scrollHandlerRef.current = scrollTo;
  };

  const triggerScrollToTop = () => {
    if (scrollHandlerRef.current) {
      scrollHandlerRef.current({ y: 0, animated: true });
    } else if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  // Handle scroll to top when tab is pressed again
  useEffect(() => {
    if (!scrollToTopOnPress) return;

    const unsubscribe = navigation.addListener('tabPress', (e: any) => {
      // Only handle if this is the current tab
      const currentTabName = tabName || routeName;
      if (e.target?.split('-')[0] === currentTabName) {
        triggerScrollToTop();
      }
    });

    return unsubscribe;
  }, [navigation, scrollToTopOnPress, tabName, routeName]);

  // Register scroll handler automatically when scrollable
  useEffect(() => {
    if (scrollable && scrollViewRef.current && scrollToTopOnPress) {
      registerScrollHandler((options) => {
        scrollViewRef.current?.scrollTo({
          x: options?.x || 0,
          y: options?.y || 0,
          animated: options?.animated ?? true,
        });
      });
    }
  }, [scrollable, scrollToTopOnPress]);

  const content = scrollable ? (
    <ScreenWrapper safeArea={safeArea} {...screenWrapperProps}>
      {hasHeaderProps && <TabHeader />}
      <ThemedScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          gap: 8,
          padding,
          paddingBottom: bottom,
        }}
        scrollIndicatorInsets={{ bottom }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ThemedScrollView>
    </ScreenWrapper>
  ) : (
    <ScreenWrapper safeArea={safeArea} {...screenWrapperProps}>
      {hasHeaderProps && <TabHeader />}
      {children}
    </ScreenWrapper>
  );

  return (
    <ScrollToTopContext.Provider value={{ registerScrollHandler, triggerScrollToTop }}>
      {content}
    </ScrollToTopContext.Provider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 44,
  },
  headerLeft: {
    minWidth: 80,
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerRight: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
});
