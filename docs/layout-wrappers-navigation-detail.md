# Layout Wrappers and Navigation Components - Detailed Guide

## Understanding the Architecture

### The Problem We're Solving

When using Expo Router, you get file-based routing out of the box, but you often need:

- Consistent safe areas across screens
- Common loading/error states
- Custom tab bars and headers
- Themed components that match your design system

Our wrapper and navigation components solve these needs while preserving Expo Router's benefits.

## Wrapper Components

### 1. ScreenWrapper

**What it does:** Wraps any screen content with common functionality that every screen needs.

**Key Features:**

```typescript
interface ScreenWrapperProps {
  children: ReactNode;

  // Layout
  padding?: boolean | number; // Adds consistent padding (default: 16)
  scrollable?: boolean; // Makes content scrollable
  safeArea?: boolean | 'top' | 'bottom' | 'both'; // Handles device safe areas

  // States
  loading?: boolean; // Shows loading overlay
  error?: Error; // Shows error state
  empty?: boolean; // Shows empty state

  // Functionality
  onRefresh?: () => Promise<void>; // Pull-to-refresh
  keyboardAvoiding?: boolean; // Keyboard handling

  // Styling
  backgroundColor?: string; // Override background
  style?: ViewStyle; // Additional styles
}
```

**How it works internally:**

1. Wraps content in SafeAreaView (if specified)
2. Adds KeyboardAvoidingView (if needed)
3. Handles loading/error/empty states
4. Applies theme-aware styling
5. Manages pull-to-refresh

**Real Usage:**

```typescript
// app/(tabs)/home.tsx
import { ScreenWrapper } from '@/components/layout';
import { useState, useEffect } from 'react';

export default function HomeScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getData();
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScreenWrapper
      safeArea="top"          // Only top safe area (tab bar handles bottom)
      padding={16}             // Custom padding (no default)
      scrollable              // Content can scroll
      loading={loading}       // Auto shows loading state
      error={error}          // Auto shows error state
      onRefresh={fetchData}  // Pull to refresh
    >
      {/* Your actual content */}
      {data && <YourContent data={data} />}
    </ScreenWrapper>
  );
}
```

### 2. ModalWrapper

**What it does:** Provides consistent modal styling and behavior.

**Key Features:**

```typescript
interface ModalWrapperProps {
  children: ReactNode;

  // Modal specific
  title?: string; // Modal header title
  showHandle?: boolean; // Drag handle (bottom sheet style)
  closeButton?: boolean | 'left' | 'right'; // X button position

  // Variants
  variant?: 'center' | 'bottom' | 'fullscreen';

  // Behavior
  onClose?: () => void; // Close handler
  swipeToClose?: boolean; // Swipe down to close (bottom variant)
  backdropPress?: boolean; // Tap backdrop to close

  // Styling
  maxHeight?: number | string; // Limit modal height
  contentPadding?: boolean; // Add padding to content
}
```

**How it works internally:**

1. Adds modal header with title and close button
2. Handles different presentation styles
3. Manages swipe gestures for bottom sheets
4. Applies proper animations

**Real Usage:**

```typescript
// app/create-post.tsx
import { ModalWrapper } from '@/components/layout';
import { router } from 'expo-router';

export default function CreatePostModal() {
  const handleClose = () => {
    router.back();
  };

  const handleSubmit = async (data) => {
    await api.createPost(data);
    router.back();
  };

  return (
    <ModalWrapper
      title="Create Post"
      variant="bottom"
      showHandle
      closeButton="right"
      onClose={handleClose}
      swipeToClose
      maxHeight="80%"
    >
      <PostForm onSubmit={handleSubmit} />
    </ModalWrapper>
  );
}

// In your layout file (app/_layout.tsx)
<Stack.Screen
  name="create-post"
  options={{
    presentation: 'modal',
    animation: 'slide_from_bottom',
    headerShown: false  // ModalWrapper provides its own header
  }}
/>
```

### 3. TabScreenWrapper

**What it does:** Specialized wrapper for tab screens with tab-specific features.

**Additional Features beyond ScreenWrapper:**

- Handles tab bar height in safe area calculations
- Badge management
- Tab-specific gesture handling
- Scroll-to-top on tab press

**Real Usage:**

```typescript
// app/(tabs)/home.tsx
export default function HomeTab() {
  return (
    <TabScreenWrapper
      safeArea="top"  // Bottom handled by tab bar
      scrollToTopOnPress  // Scroll to top when tab pressed again
    >
      <FeedContent />
    </TabScreenWrapper>
  );
}
```

### 4. DrawerWrapper

**What it does:** Wrapper for screens within drawer navigation.

**Features:**

- Handles drawer toggle button
- Manages drawer-specific gestures
- Provides consistent header with menu button

## Navigation Components

### 1. Enhanced Tab Configuration

**What it does:** Enhances existing HapticTab and TabBarBackground components with additional variants and features.

**Current Project Setup:**
The project already has excellent tab components:

- `HapticTab` - Provides haptic feedback on tab press
- `TabBarBackground` - Platform-specific blur (iOS) and solid (Android) backgrounds
- `IconSymbol` - Adaptive icons for iOS SF Symbols vs Android Material Icons

**Enhancement Approach:**
Instead of replacing these components, we enhance them with additional configuration options.

**Enhanced Configuration Function:**

```typescript
// components/layout/navigation/enhanced-tab-config.tsx
import { Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import TabBarBackground from '@/components/ui/tab-bar-background';
import { useThemeColor } from '@/hooks/use-theme-color';

interface EnhancedTabOptions {
  variant?: 'default' | 'compact' | 'floating';
  showBadges?: boolean;
  animateIcons?: boolean;
  customHeight?: number;
}

export function createEnhancedTabOptions(options?: EnhancedTabOptions) {
  const tintColor = useThemeColor('tint');

  return {
    // Keep all existing functionality
    tabBarButton: HapticTab, // Existing haptic feedback
    tabBarBackground: TabBarBackground, // Existing platform backgrounds
    tabBarActiveTintColor: tintColor, // Existing theme integration
    headerShown: false,

    // Add enhancements
    tabBarStyle: Platform.select({
      ios: {
        position: 'absolute', // Existing iOS setup
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

    // Enhanced styling
    tabBarLabelStyle: {
      fontSize: options?.variant === 'compact' ? 11 : 12,
      fontWeight: '500',
    },

    // Badge support (handled by Expo Router automatically)
    tabBarBadgeStyle: {
      backgroundColor: tintColor,
      color: 'white',
      fontSize: 12,
    },
  };
}
```

**Usage in Expo Router:**

```typescript
// app/(tabs)/_layout.tsx - Enhanced Version
import { Tabs } from 'expo-router';
import { createEnhancedTabOptions } from '@/components/layout';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={createEnhancedTabOptions({
        variant: 'default',  // or 'compact', 'floating'
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
          tabBarBadge: 3  // Automatically styled with enhanced config
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

// Compare with current setup (no changes needed to existing code)
// app/(tabs)/_layout.tsx - Current Working Version
export default function TabLayout() {
  const tintColor = useThemeColor('tint');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,     // ✅ Keeps working
        headerShown: false,                   // ✅ Keeps working
        tabBarButton: HapticTab,              // ✅ Keeps working
        tabBarBackground: TabBarBackground,   // ✅ Keeps working
        tabBarStyle: Platform.select({        // ✅ Keeps working
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
  );
}
```

### 2. Enhanced Stack Header Configuration

**What it does:** Provides consistent header styling using Expo Router's built-in header system.

**Approach:** Instead of creating custom header components, we enhance Expo Router's existing header options with consistent theming and styling.

**Enhanced Header Configuration:**

```typescript
// components/layout/navigation/enhanced-stack-config.tsx
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface StackHeaderOptions {
  variant?: 'default' | 'large' | 'transparent'
  backButton?: 'default' | 'icon-only' | 'title-only' | 'hidden'
  centerTitle?: boolean
}

export function createEnhancedStackOptions(options?: StackHeaderOptions) {
  // Note: Theme colors (background, text) are handled automatically by
  // React Navigation's ThemeProvider in app-providers.tsx

  const backButtonConfig = getBackButtonConfig(options?.backButton);

  return {
    // Background and text colors auto-adapt to light/dark theme
    headerStyle: {
      ...(options?.variant === 'transparent' && {
        backgroundColor: 'transparent'
      }),
    },
    headerTitleStyle: {
      fontWeight: '600',
      fontSize: options?.variant === 'large' ? 22 : 17,
      // color automatically handled by ThemeProvider
    },
    headerTitleAlign: options?.centerTitle ? 'center' : 'left',

    // Back button configuration
    ...backButtonConfig,

    gestureEnabled: true,
    animation: 'slide_from_right',
  };
}

function getBackButtonConfig(backButtonType?: string) {
  switch (backButtonType) {
    case 'icon-only':
      return {
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <IconSymbol
            name="chevron.left"
            size={24}
            style={{ marginLeft: 8 }}
          />
        ),
      };

    case 'title-only':
      return {
        headerBackTitleVisible: true,
        headerBackImage: () => null, // No icon, just title
      };

    case 'hidden':
      return {
        headerLeft: () => null, // Completely hide back button
        gestureEnabled: false,  // Also disable swipe back
      };

    case 'default':
    default:
      return {
        headerBackTitleVisible: true, // iOS shows "Back" or previous title
        // Uses default system back button (iOS arrow + title, Android arrow)
      };
  }
}

// Common header actions (colors auto-themed)
export const HeaderActions = {
  settings: () => (
    <Pressable
      onPress={() => router.push('/settings')}
      style={{ marginRight: 16 }}
    >
      <IconSymbol name="gear" size={20} />
      {/* color automatically themed by React Navigation */}
    </Pressable>
  ),

  close: () => (
    <Pressable
      onPress={() => router.back()}
      style={{ marginRight: 16 }}
    >
      <IconSymbol name="xmark" size={20} />
    </Pressable>
  ),

  search: (onPress: () => void) => (
    <Pressable
      onPress={onPress}
      style={{ marginRight: 16 }}
    >
      <IconSymbol name="magnifyingglass" size={20} />
    </Pressable>
  ),
};
```

**Usage with Expo Router:**

```typescript
// app/_layout.tsx - Root Stack with different back button styles
import { Stack } from 'expo-router';
import { createEnhancedStackOptions, HeaderActions } from '@/components/layout';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={createEnhancedStackOptions({
        variant: 'default',
        backButton: 'default', // iOS: arrow + "Back", Android: arrow
        centerTitle: false
      })}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Modal with close button, no back navigation */}
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          ...createEnhancedStackOptions({ backButton: 'hidden' }),
          headerRight: HeaderActions.close,
        }}
      />

      {/* Settings with custom back title */}
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerBackTitle: 'Home', // Shows "Home" instead of "Back"
          headerLargeTitle: true,
          ...createEnhancedStackOptions({ backButton: 'default' }),
        }}
      />
    </Stack>
  );
}

// Example with custom back title:
<Stack.Screen
  name="details"
  options={{
    headerBackTitle: 'Home', // Shows "Home" instead of "Back"
    ...createEnhancedStackOptions({ backButton: 'default' })
  }}
/>
```

### 3. DrawerContent

**What it does:** Custom drawer content with sections and navigation items.

**Important Notes about Drawer in Expo Router:**

- Drawer navigation is imported from `expo-router/drawer`, not `@react-navigation/drawer`
- Helper components like `DrawerContentScrollView`, `DrawerItemList`, and `DrawerItem` are still imported from `@react-navigation/drawer`
- Must wrap the Drawer in `GestureHandlerRootView` for gesture support
- Requires installation: `npx expo install @react-navigation/drawer react-native-gesture-handler react-native-reanimated`

**Integration:**

```typescript
// components/layout/navigation/drawer-content.tsx
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';  // These helper components are still from @react-navigation/drawer
import { View, Text } from 'react-native';

interface DrawerContentProps {
  state: DrawerNavigationState
  navigation: DrawerNavigationHelpers
  descriptors: DrawerDescriptorMap

  // Custom props
  header?: ReactNode
  footer?: ReactNode
  sections?: Array<{
    title: string
    routes: string[]
  }>
}

export function DrawerContent({
  state,
  navigation,
  descriptors,
  header,
  footer,
  sections
}) {
  const currentRoute = state.routes[state.index].name;

  return (
    <DrawerContentScrollView>
      {header && (
        <View style={styles.header}>
          {header}
        </View>
      )}

      {sections ? (
        sections.map((section) => (
          <View key={section.title}>
            {section.title && (
              <Text style={styles.sectionTitle}>
                {section.title}
              </Text>
            )}
            {section.routes.map((routeName) => {
              const route = state.routes.find(r => r.name === routeName);
              if (!route) return null;

              const { options } = descriptors[route.key];
              const isFocused = currentRoute === routeName;

              return (
                <DrawerItem
                  key={route.key}
                  label={options.title ?? route.name}
                  focused={isFocused}
                  onPress={() => navigation.navigate(routeName)}
                  icon={options.drawerIcon}
                  activeTintColor="#2196F3"
                  inactiveTintColor="gray"
                />
              );
            })}
          </View>
        ))
      ) : (
        <DrawerItemList
          state={state}
          navigation={navigation}
          descriptors={descriptors}
        />
      )}

      {footer && (
        <View style={styles.footer}>
          {footer}
        </View>
      )}
    </DrawerContentScrollView>
  );
}
```

**Usage:**

```typescript
// app/(drawer)/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawerContent } from '@/components/layout';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
      drawerContent={(props) => (
        <DrawerContent
          {...props}
          header={
            <UserProfile
              name="John Doe"
              email="john@example.com"
              avatar="/path/to/avatar"
            />
          }
          sections={[
            {
              title: 'Main',
              routes: ['dashboard', 'analytics', 'reports']
            },
            {
              title: 'Settings',
              routes: ['preferences', 'account', 'security']
            }
          ]}
          footer={
            <Pressable onPress={handleLogout}>
              <Text>Logout</Text>
            </Pressable>
          }
        />
      )}
      screenOptions={{
        drawerPosition: 'left',
        drawerType: 'slide',
        swipeEnabled: true
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color }) => (
            <IconSymbol name="chart.bar" color={color} />
          )
        }}
      />
    </Drawer>
    </GestureHandlerRootView>
  );
}
```

## Key Integration Points

### 1. Navigation State Access

All navigation components receive Expo Router's navigation state:

```typescript
// In any custom navigation component
const { state, navigation, descriptors } = props;

// state contains:
state.index; // Current active index
state.routes; // All routes in this navigator
state.routeNames; // Route names

// navigation provides:
navigation.navigate(routeName);
navigation.goBack();
navigation.emit(event);

// descriptors contain:
descriptors[route.key].options; // Screen options
descriptors[route.key].navigation; // Screen-specific navigation
```

### 2. Screen Options Pass-through

Options defined in Expo Router are passed to your custom components:

```typescript
// In app/(tabs)/home.tsx
<Tabs.Screen
  name="home"
  options={{
    title: 'Home',          // Available in custom tab bar
    tabBarIcon: Icon,       // Available in custom tab bar
    tabBarBadge: 3,        // Available in custom tab bar
    headerShown: false,    // Handled by Expo Router
    customProp: 'value'    // Also passed through
  }}
/>

// In your CustomTabBar
const { options } = descriptors[route.key];
console.log(options.title);       // 'Home'
console.log(options.customProp);  // 'value'
```

### 3. Event Handling

Navigation events flow through your custom components:

```typescript
// In CustomTabBar
const onPress = () => {
  // Emit event first (can be prevented)
  const event = navigation.emit({
    type: 'tabPress',
    target: route.key,
    canPreventDefault: true,
  });

  // Navigate if not prevented
  if (!event.defaultPrevented) {
    navigation.navigate(route.name);
  }
};
```

### 4. Deep Linking Compatibility

Your custom components maintain deep linking:

```typescript
// Still works with custom components
// myapp://home/profile/123

// Expo Router handles the routing
// Your components handle the presentation
```

## Common Patterns

### Loading States Pattern

```typescript
// Create a reusable hook
function useScreenData(fetchFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// Use in screens
export default function Screen() {
  const { data, loading, error, refetch } = useScreenData(api.getData);

  return (
    <ScreenWrapper
      loading={loading}
      error={error}
      onRefresh={refetch}
    >
      {data && <Content data={data} />}
    </ScreenWrapper>
  );
}
```

### Consistent Navigation Pattern

```typescript
// Create navigation helper
export const navigation = {
  goToProfile: (userId: string) => router.push(`/profile/${userId}`),
  goToSettings: () => router.push('/settings'),
  goBack: () => router.back(),
  openModal: (name: string) => router.push(`/${name}`),
};

// Use consistently
<Button onPress={() => navigation.goToProfile(user.id)}>
  View Profile
</Button>
```

### Theme-aware Components

```typescript
// All wrappers use theme
export function ScreenWrapper({ children, ...props }) {
  const theme = useTheme();
  const backgroundColor = useThemeColor('background');

  return (
    <View style={[
      styles.container,
      { backgroundColor },
      props.style
    ]}>
      {children}
    </View>
  );
}
```

## Benefits of This Approach

1. **Separation of Concerns**
   - Expo Router handles routing logic
   - Our components handle presentation

2. **Consistency**
   - All screens have same padding, safe areas
   - Loading/error states look identical
   - Navigation components match design system

3. **Flexibility**
   - Can override any wrapper behavior
   - Custom components are optional
   - Mix and match as needed

4. **Maintainability**
   - Change UI in one place
   - Navigation logic stays in Expo Router
   - Easy to test components

5. **Performance**
   - Wrappers are lightweight
   - Navigation components are optimized
   - No duplicate navigation state

## Migration Strategy

### Step 1: Add Wrappers to Existing Screens

```typescript
// Before
export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Content />
      </View>
    </SafeAreaView>
  );
}

// After
export default function HomeScreen() {
  return (
    <ScreenWrapper safeArea="top" padding>
      <Content />
    </ScreenWrapper>
  );
}
```

### Step 2: Enhance Tab Configuration

```typescript
// Before (current working setup)
<Tabs
  screenOptions={{
    tabBarActiveTintColor: tintColor,
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
  }}
>

// After (enhanced with additional variants)
<Tabs
  screenOptions={createEnhancedTabOptions({
    variant: 'default',
    showBadges: true
  })}
>
```

### Step 3: Add Advanced Features

```typescript
// Add loading states, error handling, etc.
<ScreenWrapper
  loading={loading}
  error={error}
  onRefresh={refetch}
  emptyState={<EmptyState message="No data" />}
>
```

## Troubleshooting

### Common Issues

1. **Navigation props not available**
   - Ensure you're passing props from Expo Router
   - Check component is used in correct context

2. **Enhanced tab configuration not working**
   - Ensure you're importing createEnhancedTabOptions correctly
   - Verify existing HapticTab and TabBarBackground are still present

3. **Safe areas doubling up**
   - Don't use SafeAreaView if wrapper handles it
   - Configure wrapper's safeArea prop correctly

4. **Modal not closing**
   - Use router.back() not navigation.goBack()
   - Ensure modal wrapper's onClose is connected

## Summary

The wrapper and navigation components work as a layer on top of Expo Router:

- **Wrappers** provide consistent UI/UX for screen content
- **Navigation components** customize the appearance of navigators
- **Expo Router** continues to handle all routing logic
- Together they create a robust, maintainable navigation system
