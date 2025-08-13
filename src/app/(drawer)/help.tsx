import React from 'react';
import { StyleSheet } from 'react-native';
import { ScreenWrapper } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';

export default function HelpScreen() {
  return (
    <ScreenWrapper safeArea="top" scrollable padding>
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
