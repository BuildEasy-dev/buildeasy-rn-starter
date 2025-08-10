import React from 'react';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedText } from '@/components/themed/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { SettingsConfig } from '@/constants/settings';

type ViewStyle = 'default' | 'card';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
  viewStyle?: ViewStyle;
}

export function SettingSection({ title, children, viewStyle = 'default' }: SettingSectionProps) {
  const childrenArray = React.Children.toArray(children);
  const cardBorderColor = useThemeColor('gray4');

  if (viewStyle === 'card') {
    return (
      <ThemedView style={{ marginBottom: 16 }}>
        <ThemedView
          style={{
            paddingHorizontal: 16,
            paddingBottom: 8,
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
        <ThemedView
          lightColor="#ffffff"
          darkColor="#1c1c1e"
          style={{
            marginHorizontal: SettingsConfig.UI.CARD_MARGIN_HORIZONTAL,
            borderRadius: SettingsConfig.UI.CARD_BORDER_RADIUS,
            borderWidth: 1,
            borderColor: cardBorderColor,
            overflow: 'hidden',
          }}
        >
          {childrenArray.map((child, index) => {
            if (React.isValidElement(child)) {
              const props = child.props as any;
              return React.cloneElement(child as React.ReactElement<any>, {
                ...props,
                isLast: index === childrenArray.length - 1,
                key: child.key || index,
              });
            }
            return child;
          })}
        </ThemedView>
      </ThemedView>
    );
  }

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
      {childrenArray.map((child, index) => {
        if (React.isValidElement(child)) {
          const props = child.props as any;
          return React.cloneElement(child as React.ReactElement<any>, {
            ...props,
            isLast: index === childrenArray.length - 1,
            key: child.key || index,
          });
        }
        return child;
      })}
    </ThemedView>
  );
}
