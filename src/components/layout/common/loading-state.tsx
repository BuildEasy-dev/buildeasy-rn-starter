import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { YStack } from '@tamagui/stacks';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function LoadingState({ message, size = 'large', fullScreen = true }: LoadingStateProps) {
  const tintColor = useThemeColor('tint');
  const backgroundColor = useThemeColor('background');

  const containerStyle = fullScreen
    ? [styles.fullScreenContainer, { backgroundColor }]
    : styles.inlineContainer;

  return (
    <ThemedView style={containerStyle}>
      <YStack space="$4" alignItems="center">
        <ActivityIndicator size={size} color={tintColor} />
        {message && <ThemedText style={{ textAlign: 'center' }}>{message}</ThemedText>}
      </YStack>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineContainer: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
