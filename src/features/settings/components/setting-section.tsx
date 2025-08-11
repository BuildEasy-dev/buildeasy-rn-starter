import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedText } from '@/components/themed/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type ViewStyle = 'default' | 'card';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
  viewStyle?: ViewStyle;
}

const renderChildren = (children: React.ReactNode) => {
  const childrenArray = React.Children.toArray(children);
  return childrenArray.map((child, index) => {
    if (React.isValidElement(child)) {
      const props = child.props as any;
      return React.cloneElement(child as React.ReactElement<any>, {
        ...props,
        isLast: index === childrenArray.length - 1,
        key: child.key || index,
      });
    }
    return child;
  });
};

export function SettingSection({ title, children, viewStyle = 'default' }: SettingSectionProps) {
  const cardBorderColor = useThemeColor('gray4');
  const isCardStyle = viewStyle === 'card';

  const titleComponent = <ThemedText style={styles.titleText}>{title}</ThemedText>;

  const childrenContent = isCardStyle ? (
    <ThemedView
      lightColor="#ffffff"
      darkColor="#1c1c1e"
      style={[styles.cardContent, { borderColor: cardBorderColor }]}
    >
      {renderChildren(children)}
    </ThemedView>
  ) : (
    renderChildren(children)
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>{titleComponent}</ThemedView>
      {childrenContent}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  cardContent: {
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
