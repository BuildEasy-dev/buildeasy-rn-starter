import React from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import { YStack } from '@tamagui/stacks';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ComponentProps<typeof IconSymbol>['name'];
  actionLabel?: string;
  onAction?: () => void;
  fullScreen?: boolean;
  containerStyle?: ViewStyle;
}

export function EmptyState({
  title = 'No data found',
  message = 'Try adjusting your filters or search criteria',
  icon = 'doc',
  actionLabel,
  onAction,
  fullScreen = true,
  containerStyle,
}: EmptyStateProps) {
  const textColor = useThemeColor('text');
  const backgroundColor = useThemeColor('background');
  const primaryColor = useThemeColor('primary');

  const baseContainerStyle = fullScreen
    ? [styles.fullScreenContainer, { backgroundColor }]
    : styles.inlineContainer;

  return (
    <ThemedView style={[baseContainerStyle, containerStyle]}>
      <YStack space="$4" alignItems="center" maxWidth={300}>
        <ThemedView style={styles.iconContainer}>
          <IconSymbol name={icon} size={48} color={textColor} style={{ opacity: 0.3 }} />
        </ThemedView>

        <YStack space="$2" alignItems="center">
          <ThemedText type="title" style={{ textAlign: 'center' }}>
            {title}
          </ThemedText>

          <ThemedText
            style={{
              textAlign: 'center',
              opacity: 0.6,
            }}
          >
            {message}
          </ThemedText>
        </YStack>

        {actionLabel && onAction && (
          <Pressable
            onPress={onAction}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: primaryColor,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={{ fontWeight: '600', color: 'white' }}>{actionLabel}</ThemedText>
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
    padding: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
});
