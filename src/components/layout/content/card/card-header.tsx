import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';

export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  titleProps?: React.ComponentProps<typeof ThemedText>;
  subtitleProps?: React.ComponentProps<typeof ThemedText>;
}

export function CardHeader({
  title,
  subtitle,
  leading,
  trailing,
  titleProps,
  subtitleProps,
}: CardHeaderProps) {
  return (
    <ThemedView style={styles.container}>
      {leading && <View style={styles.leading}>{leading}</View>}

      <View style={styles.content}>
        {title && (
          <ThemedText type="defaultSemiBold" style={styles.title} {...titleProps}>
            {title}
          </ThemedText>
        )}
        {subtitle && (
          <ThemedText
            style={[styles.subtitle, title && styles.subtitleWithTitle]}
            {...subtitleProps}
          >
            {subtitle}
          </ThemedText>
        )}
      </View>

      {trailing && <View style={styles.trailing}>{trailing}</View>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leading: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  trailing: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  subtitleWithTitle: {
    marginTop: 2,
  },
});
