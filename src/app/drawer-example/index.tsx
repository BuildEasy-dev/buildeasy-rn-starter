import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ScreenWrapper, useDrawerActions } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function DrawerHomeScreen() {
  const { toggleDrawer } = useDrawerActions();
  const tintColor = useThemeColor('tint');

  return (
    <ScreenWrapper safeArea="top" padding>
      {/* Custom Header with Drawer Toggle */}
      <ThemedView style={styles.header}>
        <Pressable onPress={toggleDrawer} style={styles.menuButton}>
          <IconSymbol name="line.3.horizontal" size={24} color={tintColor} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Drawer Example Home</ThemedText>
        <ThemedView style={styles.headerRight} />
      </ThemedView>

      {/* Content */}
      <ThemedView style={styles.content}>
        <ThemedView style={styles.card}>
          <IconSymbol name="house.fill" size={48} color={tintColor} />
          <ThemedText type="title" style={styles.cardTitle}>
            Welcome to Drawer Navigation
          </ThemedText>
          <ThemedText style={styles.cardDescription}>
            This is a demonstration of the custom drawer components with Expo Router. Swipe from the
            left edge or tap the menu button to open the drawer.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.features}>
          <ThemedText type="subtitle" style={styles.featuresTitle}>
            Features
          </ThemedText>

          <ThemedView style={styles.featureItem}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={tintColor} />
            <ThemedText style={styles.featureText}>Custom drawer content with sections</ThemedText>
          </ThemedView>

          <ThemedView style={styles.featureItem}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={tintColor} />
            <ThemedText style={styles.featureText}>Theme-aware components</ThemedText>
          </ThemedView>

          <ThemedView style={styles.featureItem}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={tintColor} />
            <ThemedText style={styles.featureText}>User profile header</ThemedText>
          </ThemedView>

          <ThemedView style={styles.featureItem}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={tintColor} />
            <ThemedText style={styles.featureText}>Platform-specific icons</ThemedText>
          </ThemedView>

          <ThemedView style={styles.featureItem}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={tintColor} />
            <ThemedText style={styles.featureText}>Gesture support</ThemedText>
          </ThemedView>
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
  features: {
    paddingHorizontal: 8,
  },
  featuresTitle: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
  },
});
