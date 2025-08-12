import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface FeedDebugButtonProps {
  debugEmptyState: boolean;
  debugErrorState: boolean;
  onToggleEmptyState: () => void;
  onToggleErrorState: () => void;
}

export function FeedDebugButton({
  debugEmptyState,
  debugErrorState,
  onToggleEmptyState,
  onToggleErrorState,
}: FeedDebugButtonProps) {
  const tintColor = useThemeColor('tint');
  const { showActionSheetWithOptions } = useActionSheet();

  // Only show in development
  if (!__DEV__) {
    return null;
  }

  const handlePress = () => {
    const options = [
      `${debugEmptyState ? '✓' : '○'} Toggle Empty State`,
      `${debugErrorState ? '✓' : '○'} Toggle Error State`,
      'Cancel',
    ];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: 'Debug Controls',
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            onToggleEmptyState();
            break;
          case 1:
            onToggleErrorState();
            break;
        }
      }
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.debugButton, pressed && { opacity: 0.7 }]}
    >
      <IconSymbol name="gear" size={20} color={tintColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  debugButton: {
    padding: 8,
    borderRadius: 6,
  },
});
