import React from 'react';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedText } from '@/components/themed/themed-text';
import { Config } from '@/constants/config';

export function AppFooter() {
  return (
    <ThemedView
      style={{
        alignItems: 'center',
        padding: 16,
      }}
    >
      <ThemedText
        style={{
          opacity: 0.5,
          fontSize: 14,
          marginBottom: 8,
        }}
      >
        {Config.COPYRIGHT}
      </ThemedText>
      <ThemedText
        style={{
          opacity: 0.5,
          fontSize: 12,
        }}
      >
        Version {Config.APP_VERSION} (Build {Config.BUILD_VERSION})
      </ThemedText>
    </ThemedView>
  );
}
