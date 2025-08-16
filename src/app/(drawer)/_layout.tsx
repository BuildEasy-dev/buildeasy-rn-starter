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
        <ThemedText
          type="h5"
          weight="bold"
          style={{ color: textColor, textAlign: 'center', marginBottom: 2 }}
          numberOfLines={1}
        >
          BuildEasy
        </ThemedText>
        <ThemedText
          type="caption"
          variant="muted"
          style={{ textAlign: 'center' }}
          numberOfLines={1}
        >
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
          <ThemedText type="body1" weight="medium" style={{ color: textColor }}>
            Dark Mode
          </ThemedText>
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
              routes: [{ name: '(tabs)', label: 'Home', icon: 'house', badge: 'New' }],
            },
            {
              routes: [
                { name: 'typography', label: 'Typography', icon: 'textformat' },
                { name: 'icons', label: 'Icons', icon: 'star' },
                { name: 'buttons', label: 'Buttons', icon: 'slider.horizontal.3' },
                { name: 'text-inputs', label: 'Text Inputs', icon: 'textbox' },
                { name: 'checkboxes', label: 'Checkboxes', icon: 'checkmark' },
                { name: 'radios', label: 'Radio Buttons', icon: 'checkmark.circle' },
                { name: 'switches', label: 'Switches', icon: 'switch.2' },
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
          drawerIcon: ({ color, size }) => <IconSymbol name="house" color={color} size={size} />,
        }}
      />

      {/* Additional drawer screens */}
      <Drawer.Screen
        name="typography"
        options={{
          title: 'Typography',
          drawerIcon: ({ color, size }) => (
            <IconSymbol name="textformat" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="icons"
        options={{
          title: 'Icons',
          drawerIcon: ({ color, size }) => <IconSymbol name="star" color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="buttons"
        options={{
          title: 'Buttons',
          drawerIcon: ({ color, size }) => (
            <IconSymbol name="slider.horizontal.3" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="text-inputs"
        options={{
          title: 'Text Inputs',
          drawerIcon: ({ color, size }) => <IconSymbol name="textbox" color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="checkboxes"
        options={{
          title: 'Checkboxes',
          drawerIcon: ({ color, size }) => (
            <IconSymbol name="checkmark" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="radios"
        options={{
          title: 'Radio Buttons',
          drawerIcon: ({ color, size }) => (
            <IconSymbol name="checkmark.circle" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="switches"
        options={{
          title: 'Switches',
          drawerIcon: ({ color, size }) => <IconSymbol name="switch.2" color={color} size={size} />,
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
});
