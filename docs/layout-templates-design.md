# Layout Templates Technical Design (Revised)

## Overview

This document outlines the technical design for creating reusable layout template components in `src/components/layout/` that work with Expo Router's file-based navigation system and build upon existing components like `HapticTab`, `TabBarBackground`, and `IconSymbol`.

## Goals

1. **Consistency** - Standardized layout patterns across the app
2. **Reusability** - Drop-in components for common layouts
3. **Flexibility** - Customizable while maintaining standards
4. **Type Safety** - Full TypeScript support
5. **Theme Integration** - Work seamlessly with Tamagui theming
6. **Expo Router Compatible** - Enhance, not replace, Expo Router's navigation
7. **Build on Existing** - Leverage existing HapticTab, TabBarBackground, IconSymbol

## Architecture

```
src/components/layout/
├── wrappers/           # Wrappers that enhance Expo Router layouts
│   ├── screen-wrapper.tsx
│   ├── tab-screen-wrapper.tsx
│   ├── modal-wrapper.tsx
│   └── drawer-wrapper.tsx
├── navigation/         # Enhanced navigation components
│   ├── enhanced-tab-config.tsx  # Build on HapticTab/TabBarBackground
│   ├── stack-header.tsx         # Custom header for Stack
│   ├── drawer-content.tsx       # Custom drawer content
│   └── drawer-item.tsx
├── content/           # Content layout components
│   ├── list/
│   │   ├── list-layout.tsx
│   │   ├── list-item.tsx
│   │   └── list-empty-state.tsx
│   ├── grid/
│   │   ├── grid-layout.tsx
│   │   ├── grid-item.tsx
│   │   └── grid-responsive.tsx
│   ├── card/
│   │   ├── card.tsx
│   │   ├── card-header.tsx
│   │   ├── card-content.tsx
│   │   └── card-footer.tsx
│   └── modal/
│       ├── modal-content.tsx
│       └── modal-header.tsx
├── common/
│   ├── empty-state.tsx
│   ├── loading-state.tsx
│   ├── error-state.tsx
│   └── safe-area-wrapper.tsx
└── index.ts

// Current project components (already exist)
src/components/
├── ui/
│   ├── tab-bar-background.tsx     # Platform-specific backgrounds
│   ├── tab-bar-background.ios.tsx # iOS blur effect
│   └── icon-symbol.tsx            # Adaptive icons
└── haptic-tab.tsx                 # Tab with haptic feedback
```

## Working With Existing Components

### Current Tab Setup Analysis

The project already has:

```typescript
// app/(tabs)/_layout.tsx - Current Implementation
<Tabs
  screenOptions={{
    tabBarActiveTintColor: tintColor,    // Theme-aware colors
    headerShown: false,                   // Headers hidden
    tabBarButton: HapticTab,              // Custom haptic feedback
    tabBarBackground: TabBarBackground,   // Platform blur/solid
    tabBarStyle: Platform.select({        // Platform-specific styling
      ios: { position: 'absolute' },
      default: {},
    }),
  }}
>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} />
    }}
  />
</Tabs>
```

**What's Already Great:**

- ✅ Haptic feedback on tab press
- ✅ Platform-specific blur backgrounds
- ✅ Theme-aware colors
- ✅ Adaptive icons (iOS SF Symbols vs Android)
- ✅ Proper safe area handling

## Component Specifications

### 1. Navigation Components (Enhanced)

#### EnhancedTabConfig

**Purpose:** Extend existing tab functionality with additional variants and features

**What it builds upon:**

- Uses existing `HapticTab` for button behavior
- Uses existing `TabBarBackground` for platform backgrounds
- Uses existing `useThemeColor` for theming

**Additional features:**

```typescript
interface EnhancedTabOptions {
  variant?: 'default' | 'compact' | 'floating';
  showBadges?: boolean;
  animateIcons?: boolean;
  customHeight?: number;
}

// components/layout/navigation/enhanced-tab-config.tsx
import { HapticTab } from '@/components/haptic-tab';
import TabBarBackground from '@/components/ui/tab-bar-background';
import { useThemeColor } from '@/hooks/use-theme-color';

export function createEnhancedTabOptions(options?: EnhancedTabOptions) {
  const tintColor = useThemeColor('tint');

  return {
    // Keep existing functionality
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
    tabBarActiveTintColor: tintColor,
    headerShown: false,

    // Add enhancements
    tabBarStyle: Platform.select({
      ios: {
        position: 'absolute',
        ...(options?.variant === 'floating' && {
          marginHorizontal: 16,
          marginBottom: 16,
          borderRadius: 25,
          height: options?.customHeight ?? 80,
          paddingBottom: 20,
        }),
        ...(options?.variant === 'compact' && {
          height: options?.customHeight ?? 60,
        }),
      },
      default: {
        ...(options?.variant === 'compact' && {
          height: options?.customHeight ?? 60,
        }),
      },
    }),

    // Enhanced label styling
    tabBarLabelStyle: {
      fontSize: options?.variant === 'compact' ? 11 : 12,
      fontWeight: '500',
    },
  };
}
```

**Usage:**

```typescript
// app/(tabs)/_layout.tsx - Enhanced version
import { createEnhancedTabOptions } from '@/components/layout';

export default function TabLayout() {
  return (
    <Tabs screenOptions={createEnhancedTabOptions({ variant: 'default' })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} />,
          tabBarBadge: 3, // Now supported
        }}
      />
    </Tabs>
  );
}
```

#### ScreenWrapper

**Purpose:** Consistent wrapper for all screens

**Props:**

```typescript
interface ScreenWrapperProps {
  children: ReactNode;
  title?: string;
  safeArea?: boolean | 'top' | 'bottom' | 'both';
  padding?: boolean | number;
  scrollable?: boolean;
  loading?: boolean;
  error?: Error;
  onRefresh?: () => Promise<void>;
  backgroundColor?: string;
}
```

**Implementation:**

```typescript
// components/layout/wrappers/screen-wrapper.tsx
import { View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, YStack } from 'tamagui';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LoadingState, ErrorState } from '../common';

export function ScreenWrapper({
  children,
  safeArea = false,
  padding = false,
  scrollable = false,
  loading = false,
  error,
  onRefresh,
  backgroundColor,
}: ScreenWrapperProps) {
  const bgColor = backgroundColor ?? useThemeColor('background');
  const paddingValue = typeof padding === 'number' ? padding : padding ? 16 : 0;

  const content = (
    <YStack
      flex={1}
      backgroundColor={bgColor}
      padding={paddingValue}
    >
      {loading && <LoadingState />}
      {error && !loading && <ErrorState error={error} />}
      {!loading && !error && children}
    </YStack>
  );

  const scrollableContent = scrollable ? (
    <ScrollView
      style={{ flex: 1, backgroundColor: bgColor }}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        ) : undefined
      }
    >
      {content}
    </ScrollView>
  ) : content;

  if (safeArea) {
    const edges = safeArea === true ? ['top', 'bottom'] :
                 safeArea === 'both' ? ['top', 'bottom'] : [safeArea];

    return (
      <SafeAreaView style={{ flex: 1 }} edges={edges}>
        {scrollableContent}
      </SafeAreaView>
    );
  }

  return scrollableContent;
}
```

#### StackHeader

**Purpose:** Custom header that works with Expo Router Stack

**Props:**

```typescript
interface StackHeaderProps {
  title?: string;
  canGoBack?: boolean;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  variant?: 'default' | 'large' | 'transparent';
  showBorder?: boolean;
}
```

**Usage with Expo Router:**

```typescript
// app/(stack)/_layout.tsx
import { Stack } from 'expo-router';
import { StackHeader } from '@/components/layout';

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <StackHeader {...props} variant="large" />
      }}
    >
      <Stack.Screen
        name="profile"
        options={{
          headerRight: () => (
            <Pressable onPress={() => router.push('/settings')}>
              <IconSymbol name="gear" />
            </Pressable>
          )
        }}
      />
    </Stack>
  );
}
```

### 2. Content Layout Components

#### List Layout Components

**ListLayout**

```typescript
interface ListLayoutProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T) => string;
  onRefresh?: () => Promise<void>;
  onEndReached?: () => void;
  emptyState?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  separator?: boolean | ReactNode;
  contentPadding?: number;
}
```

#### Grid Layout Components

**GridLayout**

```typescript
interface GridLayoutProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  columns?: number | 'auto';
  spacing?: number;
  aspectRatio?: number;
  onItemPress?: (item: T) => void;
  emptyState?: ReactNode;
}
```

#### Card Components

**Card**

```typescript
interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  children: ReactNode;
}
```

## Usage Examples

### Enhanced Tab Layout

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { createEnhancedTabOptions } from '@/components/layout';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={createEnhancedTabOptions({
        variant: 'default',
        showBadges: true
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name={focused ? 'house.fill' : 'house'}
              color={color}
            />
          ),
          tabBarBadge: 3, // Shows notification count
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name={focused ? 'paperplane.fill' : 'paperplane'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
```

### Screen with Wrapper

```typescript
// app/(tabs)/index.tsx
import { ScreenWrapper, ListLayout, Card } from '@/components/layout';
import { useState, useEffect } from 'react';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getPosts();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <ScreenWrapper
      safeArea="top"
      loading={loading}
      onRefresh={fetchPosts}
    >
      <ListLayout
        data={posts}
        renderItem={(post) => (
          <Card variant="elevated">
            <Text>{post.title}</Text>
            <Text>{post.content}</Text>
          </Card>
        )}
        contentPadding={16}
      />
    </ScreenWrapper>
  );
}
```

### Modal Screen

```typescript
// app/create-post.tsx
import { ModalWrapper } from '@/components/layout';
import { router } from 'expo-router';

export default function CreatePostModal() {
  return (
    <ModalWrapper
      title="Create Post"
      variant="bottom"
      showHandle
      onClose={() => router.back()}
    >
      <PostForm onSubmit={handleSubmit} />
    </ModalWrapper>
  );
}
```

## Migration Strategy

### Phase 1: Add Wrappers to Existing Screens

```typescript
// Before
export default function HomeScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 16 }}>
          <Content />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// After
export default function HomeScreen() {
  return (
    <ScreenWrapper safeArea="top" padding scrollable>
      <Content />
    </ScreenWrapper>
  );
}
```

### Phase 2: Enhance Tab Configuration

```typescript
// Before (current)
<Tabs
  screenOptions={{
    tabBarActiveTintColor: tintColor,
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
  }}
>

// After (enhanced)
<Tabs
  screenOptions={createEnhancedTabOptions({
    variant: 'default',
    showBadges: true
  })}
>
```

### Phase 3: Add Content Layouts

```typescript
// Replace manual lists with ListLayout
<FlatList data={items} renderItem={...} />

// Becomes
<ListLayout
  data={items}
  renderItem={...}
  onRefresh={refetch}
  emptyState={<EmptyState />}
/>
```

## Key Benefits

1. **Preserves Existing Work**
   - Keeps HapticTab functionality
   - Maintains TabBarBackground blur effects
   - Uses existing IconSymbol components

2. **Adds Consistency**
   - Standardized screen wrappers
   - Common loading/error states
   - Consistent spacing and theming

3. **Enhances Functionality**
   - Badge support for tabs
   - Additional tab variants
   - Better state management

4. **Type Safety**
   - Full TypeScript support
   - Proper prop validation
   - IntelliSense support

5. **Backward Compatible**
   - Existing screens continue working
   - Gradual migration possible
   - No breaking changes

## Implementation Notes

### Respecting Existing Patterns

1. **Keep HapticTab**: Don't replace, enhance
2. **Keep TabBarBackground**: Build variants on top
3. **Keep IconSymbol**: Use for consistency
4. **Keep Theme System**: Integrate with existing `useThemeColor`

### New Additions

1. **Badge Support**: Add notification counts to tabs
2. **Screen States**: Consistent loading/error handling
3. **Layout Variants**: Floating, compact tab styles
4. **Content Components**: List, Grid, Card layouts

### File Organization

```
components/
├── layout/           # New layout components
│   ├── navigation/   # Enhanced nav components
│   ├── wrappers/     # Screen wrappers
│   └── content/      # List, Grid, Card
├── ui/              # Existing UI components (keep)
│   ├── tab-bar-background.tsx
│   └── icon-symbol.tsx
└── haptic-tab.tsx   # Existing (keep)
```

This approach respects the excellent foundation already built while adding the layout consistency and reusability we need.
