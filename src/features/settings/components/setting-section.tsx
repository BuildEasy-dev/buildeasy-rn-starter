import React from 'react';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedText } from '@/components/themed/themed-text';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <ThemedView style={{ marginBottom: 16 }}>
      <ThemedView
        lightColor="#f8f9fa"
        darkColor="#1a1a1a"
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <ThemedText
          style={{
            fontSize: 12,
            fontWeight: '600',
            opacity: 0.6,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {title}
        </ThemedText>
      </ThemedView>
      {children}
    </ThemedView>
  );
}
