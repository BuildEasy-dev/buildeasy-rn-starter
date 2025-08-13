import React from 'react';
import { ScreenWrapper } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';

export default function ProfileScreen() {
  return (
    <ScreenWrapper safeArea="top" padding>
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ThemedText style={{ lineHeight: 22 }}>
          Manage your personal information and account settings.
        </ThemedText>
      </ThemedView>
    </ScreenWrapper>
  );
}
