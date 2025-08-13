import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContent, createDrawerOptions } from '@/components/layout';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Alert } from 'react-native';

export default function DrawerLayout() {
  const [darkMode, setDarkMode] = React.useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          console.log('User logged out');
          // In a real app, you'd handle authentication here
        },
      },
    ]);
  };

  return (
    <Drawer
      screenOptions={createDrawerOptions({
        position: 'left',
        width: 280,
        headerShown: false,
        swipeEnabled: true,
      })}
      drawerContent={(props) => (
        <DrawerContent
          {...props}
          headerProps={{
            avatar: { uri: 'https://picsum.photos/200' },
            title: 'John Doe',
            subtitle: 'john.doe@example.com',
            caption: 'Premium Member',
            showOnlineStatus: true,
            isOnline: true,
            actionIcon: 'pencil' as const,
            onActionPress: () => console.log('Edit profile'),
            onPress: () => console.log('Go to profile'),
          }}
          footerProps={{
            actions: [
              {
                id: 'theme',
                label: 'Dark Mode',
                icon: 'moon' as const,
                type: 'switch',
                value: darkMode,
                onValueChange: setDarkMode,
              },
              {
                id: 'logout',
                label: 'Sign Out',
                icon: 'arrow.right.square' as const,
                type: 'button',
                destructive: true,
                onPress: handleLogout,
              },
            ],
            version: 'v1.0.0',
            copyright: '© 2024 BuildEasy',
          }}
          sections={[
            {
              key: 'main',
              title: 'Main',
              routes: ['(tabs)', 'profile', 'dashboard'],
            },
            {
              key: 'tools',
              title: 'Tools & Settings',
              routes: ['settings', 'help', 'about'],
            },
          ]}
          hiddenRoutes={['_sitemap', '+not-found']}
        />
      )}
    >
      {/* Main app with tabs */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <IconSymbol name="house.fill" color={color} size={size} />
          ),
        }}
      />

      {/* Additional drawer screens */}
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
        name="dashboard"
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <IconSymbol name="square.grid.2x2" color={color} size={size} />
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
          title: 'Help & Support',
          drawerIcon: ({ color, size }) => (
            <IconSymbol name="questionmark.circle" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: 'About',
          drawerIcon: ({ color, size }) => (
            <IconSymbol name="info.circle" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}
