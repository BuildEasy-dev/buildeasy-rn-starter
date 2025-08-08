import React, { useRef, useEffect, createContext, useContext } from 'react';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { ScrollView } from 'react-native';
import { ScreenWrapper, type ScreenWrapperProps } from './screen-wrapper';

// Context to provide scroll function to child components
export interface ScrollToTopContextType {
  registerScrollHandler: (
    scrollTo: (options?: { x?: number; y?: number; animated?: boolean }) => void
  ) => void;
  triggerScrollToTop: () => void;
}

const ScrollToTopContext = createContext<ScrollToTopContextType | null>(null);

export const useScrollToTop = () => {
  const context = useContext(ScrollToTopContext);
  return context;
};

export interface TabScreenWrapperProps extends ScreenWrapperProps {
  // Tab-specific features
  tabName?: string;
  scrollToTopOnPress?: boolean;

  // Override safeArea default for tab screens
  safeArea?: boolean | 'top' | 'bottom' | 'both';
}

export function TabScreenWrapper({
  children,
  tabName,
  scrollToTopOnPress = true,
  safeArea = 'top', // Default to 'top' for tab screens (bottom handled by tab bar)
  ...screenWrapperProps
}: TabScreenWrapperProps) {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const scrollHandlerRef = useRef<
    ((options?: { x?: number; y?: number; animated?: boolean }) => void) | null
  >(null);

  // Get current route name from navigation state
  const routeName = useNavigationState((state) => {
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

    const unsubscribe = navigation.addListener('tabPress', (e) => {
      // Only handle if this is the current tab
      const currentTabName = tabName || routeName;
      if (e.target?.split('-')[0] === currentTabName) {
        triggerScrollToTop();
      }
    });

    return unsubscribe;
  }, [navigation, scrollToTopOnPress, tabName, routeName]);

  // Pass scroll ref to ScreenWrapper if it's scrollable
  const modifiedProps = {
    ...screenWrapperProps,
    safeArea,
    // Add ref forwarding for scrollable content
    ...(screenWrapperProps.scrollable &&
      scrollToTopOnPress && {
        scrollViewRef,
      }),
  };

  return (
    <ScrollToTopContext.Provider value={{ registerScrollHandler, triggerScrollToTop }}>
      <ScreenWrapper {...modifiedProps}>{children}</ScreenWrapper>
    </ScrollToTopContext.Provider>
  );
}
