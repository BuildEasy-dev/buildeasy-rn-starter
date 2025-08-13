import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, View } from 'react-native';
import { DrawerContent, createDrawerOptions } from '@/components/layout';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText, ThemedView, ThemedSwitch } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme, setColorScheme } from '@/hooks/use-color-scheme';

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const textColor = useThemeColor('text');

  const toggleDarkMode = (value: boolean) => {
    setColorScheme(value ? 'dark' : 'light');
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.textContainer}>
        <ThemedText style={[styles.appName, { color: textColor }]} numberOfLines={1}>
          BuildEasy
        </ThemedText>
        <ThemedText style={[styles.tagline, { color: textColor }]} numberOfLines={1}>
          React Native Starter
        </ThemedText>
      </View>
    </View>
  );

  const renderFooter = () => (
    <ThemedView style={styles.footerContainer}>
      <ThemedView style={styles.footerAction}>
        <ThemedView style={styles.actionContent}>
          <IconSymbol name="moon" size={20} color={textColor} style={styles.actionIcon} />
          <ThemedText style={[styles.actionLabel, { color: textColor }]}>Dark Mode</ThemedText>
        </ThemedView>
        <ThemedSwitch value={isDarkMode} onValueChange={toggleDarkMode} />
      </ThemedView>
    </ThemedView>
  );

  return (
    <Drawer
      screenOptions={createDrawerOptions({
        position: 'left',
        width: 280,
        headerShown: true,
        swipeEnabled: true,
      })}
      drawerContent={(props) => (
        <DrawerContent
          {...props}
          header={renderHeader()}
          footer={renderFooter()}
          sections={[
            {
              routes: [
                { name: '(tabs)', label: 'Home', icon: 'house.fill' },
                { name: 'profile', label: 'Profile', icon: 'person.fill', badge: 'New' },
              ],
            },
            {
              routes: [
                {
                  name: 'help',
                  label: 'Help & Support',
                  icon: 'questionmark.circle',
                  badge: '!',
                  badgeVariant: 'danger',
                },
                { name: 'about', label: 'About', icon: 'info.circle' },
              ],
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
          headerShown: false,
          drawerLabel: 'Home',
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

const styles = StyleSheet.create({
  headerContainer: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
  },
  footerContainer: {
    paddingVertical: 4,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});
