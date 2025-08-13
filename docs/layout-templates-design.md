# Layout Templates Design

## Overview

This document describes the design principles and architecture for reusable layout components that work with Expo Router's file-based navigation system.

## Goals

1. **Consistency** - Standardized layout patterns across the app
2. **Reusability** - Drop-in components for common layouts
3. **Flexibility** - Customizable while maintaining standards
4. **Type Safety** - Full TypeScript support
5. **Theme Integration** - Seamless integration with Tamagui theming
6. **Expo Router Compatible** - Enhance, not replace, navigation system

## Architecture

### Component Structure

```
src/components/layout/
├── wrappers/           # Screen-level wrappers
│   ├── screen-wrapper      # Base wrapper with safe area
│   ├── tab-screen-wrapper  # Tab screens with scroll-to-top
│   ├── modal-wrapper       # Modal screens with headers
│   └── safe-area-wrapper   # Standalone safe area
├── navigation/         # Navigation configuration
│   ├── create-tab-options  # Tab navigator config
│   ├── drawer-options      # Drawer navigator config
│   ├── modal-screen-options # Modal presentation
│   └── drawer-content      # Custom drawer UI
├── content/           # Content layouts
│   └── list/
│       ├── list-layout     # Scrollable lists with states
│       └── list-item       # List item components
└── common/            # Shared components
    ├── empty-state         # Empty state display
    ├── loading-state       # Loading indicators
    └── error-state         # Error handling
```

## Core Interfaces

### Screen Wrappers

```typescript
interface ScreenWrapperProps {
  children: ReactNode;
  safeArea?: boolean | 'top' | 'bottom' | 'both';
  backgroundColor?: string;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

interface TabScreenWrapperProps extends ScreenWrapperProps {
  // Tab-specific features
  tabName?: string;
  scrollToTopOnPress?: boolean;
  scrollable?: boolean;
  padding?: number;

  // Header configuration
  renderHeader?: () => ReactNode;
  headerTitle?: string;
  headerTitleAlign?: 'left' | 'center' | 'right';
  headerLeft?: ReactNode | HeaderButtonConfig;
  headerRight?: ReactNode | HeaderButtonConfig;
}

interface ModalWrapperProps {
  children: ReactNode;
  title?: string;
  variant?: 'default' | 'bottom' | 'fullscreen';
  showHandle?: boolean;
  onClose?: () => void;
  closeButton?: boolean;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  safeArea?: boolean | 'top' | 'bottom' | 'both';
}
```

### Navigation Configuration

```typescript
interface DrawerOptions {
  position?: 'left' | 'right';
  width?: number;
  headerShown?: boolean;
  swipeEnabled?: boolean;
  hideStatusBar?: boolean;
}

interface DrawerContentProps {
  sections: DrawerSection[];
  header?: ReactNode;
  footer?: ReactNode;
  hiddenRoutes?: string[];
}

interface DrawerSection {
  title?: string;
  routes: DrawerRoute[];
}

interface DrawerRoute {
  name: string;
  label: string;
  icon: string;
  badge?: string | number;
  badgeVariant?: 'default' | 'danger' | 'success';
}
```

### Content Layouts

```typescript
interface ScrollableListLayoutProps<T> {
  // Data
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => ReactNode;
  keyExtractor: (item: T) => string;
  estimatedItemSize?: number;

  // Refresh & Loading
  refreshing?: boolean;
  onRefresh?: () => void | Promise<void>;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;

  // Pagination
  loadingMore?: boolean;
  hasMore?: boolean;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;

  // Empty state
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: string;
  emptyAction?: { label: string; onPress: () => void };

  // Styling
  showSeparator?: boolean;
  contentContainerStyle?: ViewStyle;
}
```

### State Components

```typescript
interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

interface ErrorStateProps {
  error?: Error | null;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}
```

## Design Principles

### 1. Wrapper Components

Screen wrappers provide consistent structure:

- **Safe area handling** - Automatic safe area insets
- **Header support** - Optional built-in headers
- **Scroll management** - Coordinated scrolling behavior
- **Theme integration** - Automatic theme colors

### 2. Navigation Integration

Navigation helpers work with Expo Router:

- **Tab configuration** - Haptic feedback, blur backgrounds
- **Drawer sections** - Grouped navigation items
- **Modal presentation** - Consistent modal styles
- **Type safety** - Fully typed navigation

### 3. Content Layouts

Reusable content patterns:

- **List layouts** - Pull-to-refresh, infinite scroll, empty states
- **State management** - Loading, error, and empty states
- **Responsive design** - Adapt to screen sizes
- **Performance** - Optimized rendering with FlashList

## Key Features

### TabScreenWrapper

Wrapper for screens within tab navigation:

- Automatic scroll-to-top on tab press
- Tab bar inset handling
- Optional header with customizable buttons
- Integrated safe area management
- ScrollToTop context provider

### ScrollableListLayout

High-performance list component:

- Pull-to-refresh functionality
- Infinite scroll with pagination
- Built-in loading/error/empty states
- Separator and item rendering
- FlashList optimization

### DrawerContent

Custom drawer navigation:

- Sectioned route organization
- Badge support for notifications
- Header/footer customization
- Route filtering and hiding
- Active route highlighting

### ModalWrapper

Modal screen wrapper:

- Multiple presentation variants
- Header with action buttons
- Handle indicator for bottom sheets
- Gesture-based dismissal
- Safe area handling

## Navigation Patterns

### Tab Navigation

- Uses `useTabOptions()` hook for configuration
- Preserves platform-specific behaviors (iOS blur, Android solid)
- Integrates haptic feedback on tab press
- Tab bar inset context for content spacing

### Drawer Navigation

- Sections for grouping related screens
- Custom header/footer areas
- Badge indicators for notifications
- Swipe gesture support
- Customizable drawer width and position

### Modal Presentation

- Standard modal, bottom sheet, and fullscreen variants
- Consistent header styling
- Platform-appropriate animations
- Gesture-based dismissal

## State Management

### Loading States

- Skeleton screens for initial load
- Progress indicators for actions
- Shimmer effects for content placeholders
- Inline vs fullscreen loading

### Error States

- User-friendly error messages
- Retry action buttons
- Contextual error information
- Error boundaries integration

### Empty States

- Illustrative icons
- Helpful messages and descriptions
- Call-to-action buttons
- Customizable appearance

## Theme Integration

All layout components are theme-aware:

- Automatic color adaptation (light/dark mode)
- Consistent spacing using theme tokens
- Platform-specific styling
- Accessible color contrasts

## Context Providers

### ScrollToTopContext

Manages scroll-to-top behavior for tab screens:

- `registerScrollHandler` - Register scroll view
- `triggerScrollToTop` - Trigger scroll action

### TabBarInsetContext

Provides tab bar height for content spacing:

- Automatic bottom padding
- Scroll indicator insets

## Best Practices

1. **Use appropriate wrappers** - TabScreenWrapper for tabs, ModalWrapper for modals
2. **Leverage built-in states** - Don't recreate loading/error/empty states
3. **Follow navigation patterns** - Use provided configuration hooks
4. **Maintain consistency** - Use layout components throughout the app
5. **Consider performance** - Use ScrollableListLayout for long lists
6. **Handle edge cases** - Always provide error and empty states

## Migration Strategy

### Progressive Enhancement

1. Start with basic wrappers for consistency
2. Add specialized features as needed
3. Migrate screens incrementally

### Backward Compatibility

- Existing screens continue working
- No breaking changes to navigation
- Gradual adoption path

## Benefits

1. **Reduced boilerplate** - Less repetitive code
2. **Consistent UX** - Same patterns everywhere
3. **Faster development** - Pre-built components
4. **Better maintenance** - Centralized layout logic
5. **Type safety** - Full TypeScript support
6. **Performance** - Optimized rendering and scrolling
