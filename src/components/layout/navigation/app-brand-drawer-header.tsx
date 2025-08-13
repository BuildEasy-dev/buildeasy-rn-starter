import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface AppBrandDrawerHeaderProps {
  /**
   * App name or brand text
   */
  appName?: string;
  /**
   * App tagline or version
   */
  tagline?: string;
}

/**
 * AppBrandDrawerHeader - Clean text-only app branding component
 *
 * A minimalist business component for displaying app brand information
 * in drawer headers. Designed as a pure display component with no interactions.
 *
 * Design principles:
 * - Text-only approach (no logos or icons)
 * - Clean, centered typography
 * - Automatic theme color adaptation
 * - Minimal space consumption
 * - Professional appearance
 *
 * Features:
 * - App name display (18px, bold)
 * - Optional tagline (13px, subtle)
 * - Theme-aware text colors
 * - Responsive text sizing
 * - No user interactions (pure display)
 *
 * @example
 * ```tsx
 * // Basic app branding
 * <DrawerHeader>
 *   <AppBrandDrawerHeader
 *     appName="BuildEasy"
 *     tagline="React Native Starter"
 *   />
 * </DrawerHeader>
 *
 * // App name only
 * <DrawerHeader>
 *   <AppBrandDrawerHeader appName="My App" />
 * </DrawerHeader>
 *
 * // With custom background
 * <DrawerHeader backgroundColor="#1e40af">
 *   <AppBrandDrawerHeader
 *     appName="BuildEasy"
 *     tagline="Professional Edition"
 *   />
 * </DrawerHeader>
 * ```
 */
export function AppBrandDrawerHeader({ appName, tagline }: AppBrandDrawerHeaderProps) {
  const textColor = useThemeColor('text');

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {appName && (
          <ThemedText style={[styles.appName, { color: textColor }]} numberOfLines={1}>
            {appName}
          </ThemedText>
        )}
        {tagline && (
          <ThemedText style={[styles.tagline, { color: textColor }]} numberOfLines={1}>
            {tagline}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
  },
});
