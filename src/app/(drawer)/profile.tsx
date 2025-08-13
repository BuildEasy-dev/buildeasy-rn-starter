import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ScreenWrapper, useDrawerActions } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ProfileScreen() {
  const { toggleDrawer } = useDrawerActions();
  const tintColor = useThemeColor('tint');

  return (
    <ScreenWrapper safeArea="top" padding>
      {/* Header with Drawer Toggle */}
      <ThemedView style={styles.header}>
        <Pressable onPress={toggleDrawer} style={styles.menuButton}>
          <IconSymbol name="line.3.horizontal" size={24} color={tintColor} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Profile</ThemedText>
        <ThemedView style={styles.headerRight} />
      </ThemedView>

      {/* Content */}
      <ThemedView style={styles.content}>
        <ThemedView style={styles.card}>
          <IconSymbol name="person.fill" size={48} color={tintColor} />
          <ThemedText type="title" style={styles.cardTitle}>
            User Profile
          </ThemedText>
          <ThemedText style={styles.cardDescription}>
            Manage your personal information and account settings.
          </ThemedText>
        </ThemedView>
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
    flex: 1,
    paddingTop: 20,
  },
  card: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    marginBottom: 32,
  },
  cardTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
});
