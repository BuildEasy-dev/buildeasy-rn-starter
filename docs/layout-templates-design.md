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
└── index.tsx

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

#### TabScreenWrapper

**Purpose:** Enhanced wrapper specifically for tab screens with scroll-to-top functionality

**Props:**

```typescript
interface TabScreenWrapperProps extends ScreenWrapperProps {
  // Tab-specific features
  tabName?: string;
  scrollToTopOnPress?: boolean;

  // Override safeArea default for tab screens
  safeArea?: boolean | 'top' | 'bottom' | 'both';
}
```

**TabScreenWrapper Key Features:**

- **Scroll-to-Top**: Automatically scrolls to top when the tab is pressed again
- **Context Integration**: Provides `useScrollToTop` hook for child components
- **Safe Area Defaults**: Defaults to `safeArea='top'` since tab bar handles bottom
- **Tab Navigation**: Listens to tab press events and triggers scroll-to-top

**Usage:**

```typescript
// app/(tabs)/index.tsx
import { TabScreenWrapper } from '@/components/layout';
import { ScrollableParallaxView } from '@/components/parallax-scroll-view';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

function ScrollToTopButton() {
  const scrollToTop = useScrollToTop();

  if (!scrollToTop) return null;

  return (
    <Pressable onPress={() => scrollToTop.triggerScrollToTop()}>
      <Text>Scroll to Top</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <TabScreenWrapper safeArea={false} scrollToTopOnPress>
      <ScrollableParallaxView>
        <Content />
        <ScrollToTopButton />
      </ScrollableParallaxView>
    </TabScreenWrapper>
  );
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
        variant: 'default'
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

### Tab Screen with Wrapper

```typescript
// app/(tabs)/index.tsx
import { TabScreenWrapper } from '@/components/layout';
import { ScrollableParallaxView } from '@/components/parallax-scroll-view';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { Image, StyleSheet, Pressable } from 'react-native';

function ScrollToTopButton() {
  const scrollToTop = useScrollToTop();

  return (
    <Pressable
      onPress={() => scrollToTop?.triggerScrollToTop()}
      style={styles.scrollButton}
    >
      <Text style={styles.scrollButtonText}>Scroll to Top</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <TabScreenWrapper safeArea={false} scrollToTopOnPress>
      <ScrollableParallaxView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1: Try it</ThemedText>
          <ThemedText>
            Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
            Press <ThemedText type="defaultSemiBold">⌘ + d</ThemedText> to open developer tools.
          </ThemedText>
          <ScrollToTopButton />
        </ThemedView>
      </ScrollableParallaxView>
    </TabScreenWrapper>
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
    variant: 'default'
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
   - Scroll-to-top functionality for tab screens
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

1. **TabScreenWrapper**: Enhanced tab screens with scroll-to-top functionality
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
