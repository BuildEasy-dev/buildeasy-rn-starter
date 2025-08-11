import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { ThemedText, ThemedView } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ListDemoHeaderProps {
  showEmpty: boolean;
  onToggleEmptyState: () => void;
}

export function ListDemoHeader({ showEmpty, onToggleEmptyState }: ListDemoHeaderProps) {
  const tintColor = useThemeColor('tint');
  const switchTrackColor = {
    false: useThemeColor('gray6'),
    true: tintColor,
  };

  return (
    <ThemedView style={styles.header}>
      <ThemedText type="title" style={styles.headerTitle}>
        ListLayout Demo
      </ThemedText>
      <ThemedText style={styles.headerSubtitle}>
        Pull to refresh • Tap items • Scroll for more
      </ThemedText>
      <View style={styles.toggleContainer}>
        <ThemedText>Show empty state</ThemedText>
        <Switch
          value={showEmpty}
          onValueChange={onToggleEmptyState}
          trackColor={switchTrackColor}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    marginBottom: 8,
  },
  headerSubtitle: {
    opacity: 0.7,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
});
