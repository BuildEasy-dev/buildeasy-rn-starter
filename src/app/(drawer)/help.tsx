import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ScreenWrapper, useDrawerActions } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HelpScreen() {
  const { toggleDrawer } = useDrawerActions();
  const tintColor = useThemeColor('tint');

  return (
    <ScreenWrapper safeArea="top" scrollable padding>
      <ThemedView style={styles.header}>
        <Pressable onPress={toggleDrawer} style={styles.menuButton}>
          <IconSymbol name="line.3.horizontal" size={24} color={tintColor} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Help & Support</ThemedText>
        <ThemedView style={styles.headerRight} />
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedText type="title">Help Center</ThemedText>
        <ThemedText style={styles.description}>
          Find answers to common questions and get support.
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
    padding: 16,
  },
  description: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.7,
  },
});
