import React from 'react';
import { StyleSheet } from 'react-native';
import { ScreenWrapper } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function AboutScreen() {
  const tintColor = useThemeColor('tint');

  return (
    <ScreenWrapper safeArea="top" scrollable padding>
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
