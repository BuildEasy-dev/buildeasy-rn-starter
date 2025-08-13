import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ScreenWrapper, useDrawerActions } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function AboutScreen() {
  const { toggleDrawer } = useDrawerActions();
  const tintColor = useThemeColor('tint');

  return (
    <ScreenWrapper safeArea="top" scrollable padding>
      <ThemedView style={styles.header}>
        <Pressable onPress={toggleDrawer} style={styles.menuButton}>
          <IconSymbol name="line.3.horizontal" size={24} color={tintColor} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>About</ThemedText>
        <ThemedView style={styles.headerRight} />
      </ThemedView>

      <ThemedView style={styles.content}>
        <IconSymbol name="info.circle" size={64} color={tintColor} />
        <ThemedText type="title" style={styles.title}>
          Drawer Navigation Demo
        </ThemedText>
        <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
        <ThemedText style={styles.description}>
          This is a demonstration of custom drawer navigation components built with Expo Router and
          React Navigation Drawer.
        </ThemedText>
      </ThemedView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    alignItems: 'center',
    padding: 32,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  version: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    opacity: 0.7,
  },
});
