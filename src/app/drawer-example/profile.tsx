import React from 'react';
import { StyleSheet, Pressable, Image } from 'react-native';
import { ScreenWrapper, useDrawerActions } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ProfileScreen() {
  const { toggleDrawer } = useDrawerActions();
  const tintColor = useThemeColor('tint');
  const borderColor = useThemeColor('border');

  return (
    <ScreenWrapper safeArea="top" scrollable padding>
      {/* Header */}
      <ThemedView style={styles.header}>
        <Pressable onPress={toggleDrawer} style={styles.menuButton}>
          <IconSymbol name="line.3.horizontal" size={24} color={tintColor} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Profile</ThemedText>
        <Pressable style={styles.menuButton}>
          <IconSymbol name="square.and.pencil" size={24} color={tintColor} />
        </Pressable>
      </ThemedView>

      {/* Profile Content */}
      <ThemedView style={styles.profileSection}>
        <Image source={{ uri: 'https://picsum.photos/200' }} style={styles.avatar} />
        <ThemedText type="title" style={styles.name}>
          John Doe
        </ThemedText>
        <ThemedText style={styles.email}>john.doe@example.com</ThemedText>

        <ThemedView style={styles.statsRow}>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>128</ThemedText>
            <ThemedText style={styles.statLabel}>Posts</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.statItem, styles.statItemBorder, { borderColor }]}>
            <ThemedText style={styles.statValue}>1.2K</ThemedText>
            <ThemedText style={styles.statLabel}>Followers</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>358</ThemedText>
            <ThemedText style={styles.statLabel}>Following</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Profile Options */}
      <ThemedView style={styles.optionsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Account Settings
        </ThemedText>

        {[
          { icon: 'person.circle' as const, label: 'Edit Profile', color: tintColor },
          { icon: 'bell' as const, label: 'Notifications', color: tintColor },
          { icon: 'lock' as const, label: 'Privacy', color: tintColor },
          { icon: 'creditcard' as const, label: 'Payment Methods', color: tintColor },
          { icon: 'questionmark.circle' as const, label: 'Help & Support', color: tintColor },
          { icon: 'arrow.right.square' as const, label: 'Sign Out', color: '#FF3B30' },
        ].map((option, index) => (
          <Pressable key={index} style={[styles.optionItem, { borderBottomColor: borderColor }]}>
            <IconSymbol name={option.icon} size={24} color={option.color} />
            <ThemedText style={styles.optionLabel}>{option.label}</ThemedText>
            <IconSymbol name="chevron.right" size={16} color={borderColor} />
          </Pressable>
        ))}
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
  profileSection: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statItemBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  optionsSection: {
    paddingTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
});
