import React from 'react';
import { ScreenWrapper } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';

export default function AboutScreen() {
  return (
    <ScreenWrapper safeArea="top" padding>
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ThemedText style={{ lineHeight: 22 }}>
          This is a demonstration of custom drawer navigation components built with Expo Router and
          React Navigation Drawer.
        </ThemedText>
      </ThemedView>
    </ScreenWrapper>
  );
}
