# Drawer Navigation Implementation Example

This document provides a complete example of implementing drawer navigation with Expo Router using the custom drawer components.

## Installation

The drawer navigation package has been installed:

```bash
npx expo install @react-navigation/drawer
```

## Basic Drawer Setup

### 1. Create Drawer Layout File

Create `app/(drawer)/_layout.tsx`:

```tsx
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawerContent, createDrawerOptions } from '@/components/layout';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={createDrawerOptions({
          position: 'left',
          width: 280,
          headerShown: false,
        })}
        drawerContent={(props) => (
          <DrawerContent
            {...props}
            header={<UserProfileHeader />}
            sections={[
              {
                key: 'main',
                title: 'Main',
                routes: ['index', 'dashboard', 'profile'],
              },
              {
                key: 'tools',
                title: 'Tools',
                routes: ['settings', 'help'],
              },
            ]}
            footer={<LogoutButton />}
            hiddenRoutes={['_sitemap', '+not-found']}
          />
        )}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Home',
            drawerIcon: ({ color, size }) => (
              <IconSymbol name="house.fill" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            drawerIcon: ({ color, size }) => (
              <IconSymbol name="square.grid.2x2" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            title: 'Profile',
            drawerIcon: ({ color, size }) => (
              <IconSymbol name="person.fill" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: 'Settings',
            drawerIcon: ({ color, size }) => <IconSymbol name="gear" color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="help"
          options={{
            title: 'Help',
            drawerIcon: ({ color, size }) => (
              <IconSymbol name="questionmark.circle" color={color} size={size} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
```

### 2. Create User Profile Header Component

```tsx
// components/drawer/user-profile-header.tsx
import React from 'react';
import { StyleSheet, Pressable, Image } from 'react-native';
import { ThemedView, ThemedText } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';

export function UserProfileHeader() {
  const borderColor = useThemeColor('border');

  return (
    <ThemedView style={styles.container}>
      <Image source={{ uri: 'https://example.com/avatar.jpg' }} style={styles.avatar} />
      <ThemedText style={styles.name}>John Doe</ThemedText>
      <ThemedText style={styles.email}>john.doe@example.com</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
  },
});
```

### 3. Create Logout Button Component

```tsx
// components/drawer/logout-button.tsx
import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';

export function LogoutButton() {
  const tintColor = useThemeColor('tint');

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout');
    router.replace('/login');
  };

  return (
    <Pressable onPress={handleLogout} style={styles.container}>
      <IconSymbol name="arrow.right.square" size={20} color={tintColor} />
      <ThemedText style={[styles.text, { color: tintColor }]}>Logout</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
});
```

### 4. Using DrawerItem Component

For custom drawer items with badges:

```tsx
import { DrawerItem } from '@/components/layout';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { state, navigation } = props;

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Messages"
        icon="envelope.fill"
        badge={5}
        badgeVariant="primary"
        focused={state.index === 0}
        onPress={() => navigation.navigate('messages')}
      />

      <DrawerItem
        label="Notifications"
        icon="bell.fill"
        badge="99+"
        badgeVariant="danger"
        focused={state.index === 1}
        onPress={() => navigation.navigate('notifications')}
      />

      <DrawerItemSeparator />

      <DrawerItem
        label="Settings"
        icon="gear"
        focused={state.index === 2}
        onPress={() => navigation.navigate('settings')}
      />
    </DrawerContentScrollView>
  );
}
```

### 5. Screen with Drawer Toggle

```tsx
// app/(drawer)/index.tsx
import React from 'react';
import { Pressable } from 'react-native';
import { ScreenWrapper } from '@/components/layout';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useDrawerActions } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';

export default function HomeScreen() {
  const { toggleDrawer } = useDrawerActions();

  return (
    <ScreenWrapper safeArea="top">
      <ThemedView style={{ flexDirection: 'row', padding: 16 }}>
        <Pressable onPress={toggleDrawer}>
          <IconSymbol name="line.3.horizontal" size={24} />
        </Pressable>
        <ThemedText style={{ flex: 1, textAlign: 'center', fontSize: 18 }}>Home</ThemedText>
      </ThemedView>

      <ThemedView style={{ flex: 1, padding: 16 }}>
        <ThemedText>Your content here</ThemedText>
      </ThemedView>
    </ScreenWrapper>
  );
}
```

## Advanced Configuration

### Custom Drawer Types

```tsx
// Permanent drawer (always visible on tablets)
<Drawer
  screenOptions={createDrawerOptions({
    type: Platform.isPad ? 'permanent' : 'front',
    width: Platform.isPad ? 320 : 280,
  })}
>
```

### Right-side Drawer

```tsx
<Drawer
  screenOptions={createDrawerOptions({
    position: 'right',
    swipeEdgeWidth: 50,
  })}
>
```

### Conditional Routes

```tsx
<DrawerContent
  {...props}
  sections={[
    {
      key: 'main',
      title: 'Main',
      routes: user.isAdmin ? ['index', 'dashboard', 'admin'] : ['index', 'dashboard'],
    },
  ]}
/>
```

## Integration with Existing Navigation

### Nested in Tab Navigation

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(drawer)"
        options={{
          headerShown: false,
          title: 'Home',
        }}
      />
      <Tabs.Screen name="search" />
    </Tabs>
  );
}
```

### With Stack Navigation

```tsx
// app/(drawer)/profile/_layout.tsx
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Profile' }} />
      <Stack.Screen name="edit" options={{ title: 'Edit Profile' }} />
    </Stack>
  );
}
```

## Theme Integration

All drawer components automatically adapt to the app's theme:

- Background colors adjust for light/dark mode
- Text colors follow theme settings
- Active states use the theme's tint color
- Borders and separators use theme border colors

## Accessibility

The drawer components include:

- Proper accessibility labels
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Performance Considerations

1. **Lazy Loading**: Drawer screens are lazy-loaded by default
2. **Gesture Optimization**: Swipe gestures are optimized for smooth performance
3. **Memory Management**: Unused screens are unmounted when drawer is closed

## Troubleshooting

### Common Issues

1. **Drawer not opening**: Ensure `GestureHandlerRootView` wraps the Drawer
2. **Icons not showing**: Verify IconSymbol names are correct
3. **Theme not applying**: Check useThemeColor hook is imported correctly
4. **Navigation errors**: Ensure all routes exist in file system

### Platform-specific Notes

- **iOS**: Swipe from edge gesture works by default
- **Android**: Hardware back button closes drawer when open
- **Web**: Drawer can be toggled with keyboard shortcuts
