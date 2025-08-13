import React from 'react';
import { StyleSheet } from 'react-native';
import { ScreenWrapper } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ProfileScreen() {
  const tintColor = useThemeColor('tint');

  return (
    <ScreenWrapper safeArea="top" padding>
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
