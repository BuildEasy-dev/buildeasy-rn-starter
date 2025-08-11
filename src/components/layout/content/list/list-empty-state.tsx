import React from 'react';
import { StyleSheet, View, Pressable, ViewStyle } from 'react-native';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface ListEmptyStateProps {
  title?: string;
  message?: string;
  icon?: IconSymbolName;
  onAction?: () => void;
  actionLabel?: string;
  containerStyle?: ViewStyle;
}

export function ListEmptyState({
  title = 'No items found',
  message,
  icon = 'doc.text',
  onAction,
  actionLabel = 'Try Again',
  containerStyle,
}: ListEmptyStateProps) {
  const textColor = useThemeColor('text');
  const secondaryTextColor = useThemeColor('tabIconDefault');
  const tintColor = useThemeColor('tint');
  const backgroundColor = useThemeColor('background');

  return (
    <ThemedView style={[styles.container, { backgroundColor }, containerStyle]}>
      <View style={styles.content}>
        {icon && (
          <View style={styles.iconContainer}>
            <IconSymbol name={icon} size={64} color={secondaryTextColor} style={{ opacity: 0.5 }} />
          </View>
        )}

        <ThemedText style={[styles.title, { color: textColor }]}>{title}</ThemedText>

        {message && (
          <ThemedText style={[styles.message, { color: secondaryTextColor }]}>{message}</ThemedText>
        )}

        {onAction && (
          <Pressable
            onPress={onAction}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: tintColor },
              pressed && styles.buttonPressed,
            ]}
          >
            <ThemedText style={styles.buttonText}>{actionLabel}</ThemedText>
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
