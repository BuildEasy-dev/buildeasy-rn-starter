import React from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import { YStack } from '@tamagui/stacks';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ErrorStateProps {
  error?: Error | string | null;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  containerStyle?: ViewStyle;
}

export function ErrorState({
  error,
  message,
  onRetry,
  fullScreen = true,
  containerStyle,
}: ErrorStateProps) {
  const backgroundColor = useThemeColor('background');
  const errorColor = useThemeColor('red10');

  const errorMessage =
    message || (typeof error === 'string' ? error : error?.message || 'An error occurred');

  const baseContainerStyle = fullScreen
    ? [styles.fullScreenContainer, { backgroundColor }]
    : styles.inlineContainer;

  return (
    <ThemedView style={[baseContainerStyle, containerStyle]}>
      <YStack space="$4" alignItems="center" maxWidth={300}>
        <IconSymbol name="exclamationmark.triangle" size={48} color={errorColor} />

        <YStack space="$2" alignItems="center">
          <ThemedText type="title" style={{ textAlign: 'center' }}>
            Something went wrong
          </ThemedText>

          <ThemedText
            style={{
              textAlign: 'center',
              opacity: 0.7,
            }}
          >
            {errorMessage}
          </ThemedText>
        </YStack>

        {onRetry && (
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [styles.retryButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <ThemedText style={{ fontWeight: '600', color: '#007AFF' }}>Try Again</ThemedText>
          </Pressable>
        )}
      </YStack>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  inlineContainer: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
});
