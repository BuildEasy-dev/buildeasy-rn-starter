import { router } from 'expo-router';
import { Platform, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';

interface BaseHeaderActionProps {
  iconName: string;
  onPress?: () => void;
  color: string;
}

function BaseHeaderAction({ iconName, onPress, color }: BaseHeaderActionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ marginRight: 16 }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <IconSymbol name={iconName as any} size={20} color={color} />
    </Pressable>
  );
}

const ACTION_CONFIG = {
  Settings: { icon: 'gear', defaultAction: () => router.push('/settings') },
  Close: { icon: 'xmark', defaultAction: () => router.back() },
  Search: { icon: 'magnifyingglass', defaultAction: undefined },
  Add: { icon: 'plus', defaultAction: undefined },
  Edit: { icon: 'pencil', defaultAction: undefined },
  Share: { icon: 'square.and.arrow.up', defaultAction: undefined },
  Save: { icon: 'checkmark', defaultAction: undefined },
  More: {
    icon: Platform.OS === 'ios' ? 'ellipsis.circle' : 'ellipsis',
    defaultAction: undefined,
  },
} as const;

interface OptionalColorProps {
  color?: string;
  onPress?: () => void;
}

export function useHeaderActions() {
  const tintColor = useThemeColor('tint');

  return Object.entries(ACTION_CONFIG).reduce(
    (actions, [name, config]) => {
      actions[name as keyof typeof ACTION_CONFIG] = (props?: OptionalColorProps) => (
        <BaseHeaderAction
          iconName={config.icon}
          color={props?.color || tintColor}
          onPress={props?.onPress || config.defaultAction}
        />
      );
      return actions;
    },
    {} as Record<keyof typeof ACTION_CONFIG, (props?: OptionalColorProps) => React.JSX.Element>
  );
}
