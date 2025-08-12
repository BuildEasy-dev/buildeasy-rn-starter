import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';

/**
 * Props for the CardHeader component
 */
export interface CardHeaderProps {
  /** Optional title text to display */
  title?: string;
  /** Optional subtitle text to display below title */
  subtitle?: string;
  /** Optional leading element (e.g., avatar, icon) */
  leading?: React.ReactNode;
  /** Optional trailing element (e.g., button, icon) */
  trailing?: React.ReactNode;
  /** Additional props to pass to the title ThemedText component */
  titleProps?: React.ComponentProps<typeof ThemedText>;
  /** Additional props to pass to the subtitle ThemedText component */
  subtitleProps?: React.ComponentProps<typeof ThemedText>;
}

/**
 * CardHeader component for displaying header content in cards
 *
 * Provides a flexible three-column layout: leading content + main content + trailing content
 *
 * @component
 * @example
 * ```tsx
 * // Basic header with title and subtitle
 * <CardHeader
 *   title="User Name"
 *   subtitle="@username"
 * />
 *
 * // Header with avatar and action button
 * <CardHeader
 *   leading={<Avatar name="John" />}
 *   title="John Doe"
 *   subtitle="Online"
 *   trailing={<IconButton icon="more" />}
 * />
 * ```
 *
 * @param props - The props for the CardHeader component
 */
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
