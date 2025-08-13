import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View , Alert } from 'react-native';
import { DrawerContent, createDrawerOptions, DrawerFooter } from '@/components/layout';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed';
import { router } from 'expo-router';

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
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            header={
              <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 50 }}>
                <ThemedText style={{ fontSize: 18, fontWeight: '700' }}>BuildEasy</ThemedText>
                <ThemedText style={{ fontSize: 13, opacity: 0.7 }}>React Native Starter</ThemedText>
              </View>
            }
            footer={
              <DrawerFooter
                actions={[
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
                ]}
                version="v1.0.0"
                copyright="© 2024 BuildEasy"
              />
            }
            sections={[
              {
                key: 'main',
                title: 'Main',
                routes: ['index', 'dashboard', 'profile'],
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
    </GestureHandlerRootView>
  );
}
