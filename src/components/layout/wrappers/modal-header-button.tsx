import React from 'react';
import { Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export type HeaderButtonVariant = 'cancel' | 'back' | 'close' | 'done' | 'save' | 'next';

interface HeaderButtonProps {
  variant: HeaderButtonVariant;
  text?: string;
  onPress?: () => void;
  disabled?: boolean;
}

const variantConfigs: Record<
  HeaderButtonVariant,
  {
    text: string;
    icon?: IconSymbolName;
    color?: string;
    fontWeight?: '400' | '500' | '600';
    defaultAction?: () => void;
  }
> = {
  cancel: {
    text: 'Cancel',
    color: '#007AFF',
    defaultAction: () => router.back(),
  },
  back: {
    text: '',
    icon: 'chevron.left',
    color: '#007AFF',
    defaultAction: () => router.back(),
  },
  close: {
    text: 'Close',
    color: '#007AFF',
    defaultAction: () => router.back(),
  },
  done: {
    text: 'Done',
    color: '#007AFF',
    fontWeight: '600',
    defaultAction: () => router.back(),
  },
  save: {
    text: 'Save',
    color: '#007AFF',
    fontWeight: '600',
    defaultAction: () => {
      Alert.alert('Success', 'Saved successfully!', [{ text: 'OK', onPress: () => router.back() }]);
    },
  },
  next: {
    text: 'Next',
    color: '#007AFF',
    fontWeight: '600',
  },
};

export function ModalHeaderButton({ variant, text, onPress, disabled }: HeaderButtonProps) {
  const config = variantConfigs[variant];
  const tintColor = useThemeColor('tint');
  const displayText = text || config.text;
  const handlePress = onPress || config.defaultAction;
  const color = disabled ? '#C7C7CC' : config.color || tintColor;

  return (
    <Pressable onPress={handlePress} disabled={disabled} style={{ padding: 8 }}>
      {config.icon ? (
        <IconSymbol name={config.icon} size={18} color={color} />
      ) : (
        <ThemedText
          style={{
            fontSize: 17,
            color,
            fontWeight: config.fontWeight || '400',
          }}
        >
          {displayText}
        </ThemedText>
      )}
    </Pressable>
  );
}
