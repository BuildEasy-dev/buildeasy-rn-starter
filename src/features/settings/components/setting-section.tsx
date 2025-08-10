import React from 'react';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedText } from '@/components/themed/themed-text';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingSection({ title, children }: SettingSectionProps) {
  const childrenArray = React.Children.toArray(children);

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
