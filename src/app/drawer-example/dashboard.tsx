import React from 'react';
import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { ScreenWrapper, useDrawerActions } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function DashboardScreen() {
  const { toggleDrawer } = useDrawerActions();
  const tintColor = useThemeColor('tint');
  const borderColor = useThemeColor('border');

  const stats = [
    { label: 'Total Users', value: '1,234', icon: 'person.2.fill' as const, color: '#007AFF' },
    { label: 'Active Sessions', value: '89', icon: 'wifi' as const, color: '#34C759' },
    { label: 'Messages', value: '456', icon: 'envelope.fill' as const, color: '#FF9500' },
    { label: 'Storage Used', value: '2.4 GB', icon: 'externaldrive' as const, color: '#AF52DE' },
  ];

  return (
    <ScreenWrapper safeArea="top" scrollable={false}>
      {/* Header */}
      <ThemedView style={[styles.header, { borderBottomColor: borderColor }]}>
        <Pressable onPress={toggleDrawer} style={styles.menuButton}>
          <IconSymbol name="line.3.horizontal" size={24} color={tintColor} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Dashboard</ThemedText>
        <Pressable style={styles.menuButton}>
          <IconSymbol name="bell" size={24} color={tintColor} />
        </Pressable>
      </ThemedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* Stats Grid */}
          <ThemedView style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <ThemedView key={index} style={[styles.statCard, { borderColor: borderColor }]}>
                <ThemedView
                  style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}
                >
                  <IconSymbol name={stat.icon} size={24} color={stat.color} />
                </ThemedView>
                <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>

          {/* Recent Activity */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Recent Activity
            </ThemedText>

            {[1, 2, 3, 4].map((item) => (
              <ThemedView
                key={item}
                style={[styles.activityItem, { borderBottomColor: borderColor }]}
              >
                <ThemedView style={styles.activityIcon}>
                  <IconSymbol
                    name={item % 2 === 0 ? 'arrow.up.circle' : 'arrow.down.circle'}
                    size={20}
                    color={item % 2 === 0 ? '#34C759' : '#007AFF'}
                  />
                </ThemedView>
                <ThemedView style={styles.activityContent}>
                  <ThemedText style={styles.activityTitle}>
                    {item % 2 === 0 ? 'New user registered' : 'File uploaded'}
                  </ThemedText>
                  <ThemedText style={styles.activityTime}>{item * 5} minutes ago</ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  statCard: {
    width: '50%',
    padding: 8,
  },
  statCardInner: {
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  activityIcon: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 13,
    opacity: 0.6,
  },
});
