import React from 'react';
import { Pressable, View } from 'react-native';
import { ThemedText, ThemedSwitch } from '@/components/themed';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { Separator } from '@/components/ui/separator';
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
  const chevronColor = useThemeColor('gray8'); // Chevron arrow color

  return (
    <View style={{ paddingHorizontal: 16 }}>
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
            marginRight: 12,
            paddingVertical: 10,
          }}
        >
          <IconSymbol name={icon} size={24} color={useThemeColor('tint')} />
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
              paddingVertical: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <ThemedText type="body1" weight="medium">
                {title}
              </ThemedText>
              {subtitle && (
                <ThemedText type="body2" variant="muted" style={{ marginTop: 2 }}>
                  {subtitle}
                </ThemedText>
              )}
            </View>

            {type === 'toggle' ? (
              <ThemedSwitch value={value} onValueChange={onValueChange} />
            ) : (
              <IconSymbol name="chevron.right" size={16} color={chevronColor} />
            )}
          </View>
        </View>
      </Pressable>
      {!isLast && <Separator style={{ marginLeft: 36 }} />}
    </View>
  );
}
