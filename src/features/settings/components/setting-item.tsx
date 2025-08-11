import React from 'react';
import { Switch, Pressable, View } from 'react-native';
import { ThemedText } from '@/components/themed/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface SettingItemProps {
  icon: IconSymbolName;
  title: string;
  subtitle?: string;
  type?: 'nav' | 'toggle';
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  isLast?: boolean;
}

export function SettingItem({
  icon,
  title,
  subtitle,
  type = 'nav',
  value,
  onValueChange,
  onPress,
  isLast = false,
}: SettingItemProps) {
  const tintColor = useThemeColor('tint');
  const borderColor = useThemeColor('separator'); // Border separator color
  const chevronColor = useThemeColor('gray8'); // Chevron arrow color
  const switchTrackColor = {
    false: useThemeColor('gray6'), // Switch track color when off
    true: tintColor, // Switch track color when on
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={type === 'toggle'}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <View
        style={{
          marginLeft: 16,
          marginRight: 12,
          paddingVertical: 10,
        }}
      >
        <IconSymbol name={icon} size={24} color={tintColor} />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: borderColor,
            paddingVertical: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <ThemedText style={{ fontSize: 16, fontWeight: '500' }}>{title}</ThemedText>
            {subtitle && (
              <ThemedText style={{ fontSize: 14, opacity: 0.6, marginTop: 2 }}>
                {subtitle}
              </ThemedText>
            )}
          </View>

          {type === 'toggle' ? (
            <Switch value={value} onValueChange={onValueChange} trackColor={switchTrackColor} />
          ) : (
            <IconSymbol name="chevron.right" size={16} color={chevronColor} />
          )}
        </View>

        <View style={{ width: 16 }} />
      </View>
    </Pressable>
  );
}
