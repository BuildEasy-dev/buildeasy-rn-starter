import React from 'react';
import { StyleSheet, Pressable, Switch } from 'react-native';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface DrawerFooterAction {
  /**
   * Unique identifier for the action
   */
  id: string;
  /**
   * Action label text
   */
  label: string;
  /**
   * Icon for the action
   */
  icon?: IconSymbolName;
  /**
   * Action type
   */
  type?: 'button' | 'switch' | 'text';
  /**
   * Text color (for custom styling)
   */
  color?: string;
  /**
   * Press handler for button type
   */
  onPress?: () => void;
  /**
   * Switch value for switch type
   */
  value?: boolean;
  /**
   * Switch change handler for switch type
   */
  onValueChange?: (value: boolean) => void;
  /**
   * Whether the action is destructive (e.g., logout)
   */
  destructive?: boolean;
}

export interface DrawerFooterProps {
  /**
   * Footer actions/buttons
   */
  actions?: DrawerFooterAction[];
  /**
   * App version text
   */
  version?: string;
  /**
   * Copyright or additional info text
   */
  copyright?: string;
  /**
   * Show border top
   * @default true
   */
  showBorder?: boolean;
  /**
   * Custom background color
   */
  backgroundColor?: string;
  /**
   * Vertical padding
   * @default 20
   */
  paddingVertical?: number;
  /**
   * Horizontal padding
   * @default 20
   */
  paddingHorizontal?: number;
}

/**
 * DrawerFooter - Generic footer component for drawer navigation
 *
 * Features:
 * - Multiple action types (button, switch, text)
 * - Version and copyright display
 * - Destructive action styling
 * - Theme-aware colors
 * - Customizable padding and background
 *
 * @example
 * ```tsx
 * <DrawerFooter
 *   actions={[
 *     {
 *       id: 'theme',
 *       label: 'Dark Mode',
 *       icon: 'moon',
 *       type: 'switch',
 *       value: isDarkMode,
 *       onValueChange: setDarkMode,
 *     },
 *     {
 *       id: 'logout',
 *       label: 'Sign Out',
 *       icon: 'arrow.right.square',
 *       type: 'button',
 *       destructive: true,
 *       onPress: handleLogout,
 *     },
 *   ]}
 *   version="v1.0.0"
 *   copyright="© 2024 Your Company"
 * />
 * ```
 */
export function DrawerFooter({
  actions = [],
  version,
  copyright,
  showBorder = true,
  backgroundColor,
  paddingVertical = 20,
  paddingHorizontal = 20,
}: DrawerFooterProps) {
  const defaultBackgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const tintColor = useThemeColor('tint');
  const borderColor = useThemeColor('border');

  const renderAction = (action: DrawerFooterAction) => {
    const {
      id,
      label,
      icon,
      type = 'button',
      color,
      onPress,
      value,
      onValueChange,
      destructive = false,
    } = action;

    const actionColor = color || (destructive ? '#FF3B30' : textColor);

    if (type === 'switch') {
      return (
        <ThemedView key={id} style={styles.actionItem}>
          <ThemedView style={styles.actionContent}>
            {icon && (
              <IconSymbol name={icon} size={20} color={actionColor} style={styles.actionIcon} />
            )}
            <ThemedText style={[styles.actionLabel, { color: actionColor }]}>{label}</ThemedText>
          </ThemedView>
          <Switch value={value} onValueChange={onValueChange} trackColor={{ true: tintColor }} />
        </ThemedView>
      );
    }

    if (type === 'text') {
      return (
        <ThemedView key={id} style={styles.actionItem}>
          <ThemedView style={styles.actionContent}>
            {icon && (
              <IconSymbol name={icon} size={20} color={actionColor} style={styles.actionIcon} />
            )}
            <ThemedText style={[styles.actionLabel, { color: actionColor }]}>{label}</ThemedText>
          </ThemedView>
        </ThemedView>
      );
    }

    // Default: button type
    return (
      <Pressable
        key={id}
        onPress={onPress}
        style={({ pressed }) => [
          styles.actionItem,
          styles.actionButton,
          pressed && styles.actionButtonPressed,
        ]}
      >
        <ThemedView style={styles.actionContent}>
          {icon && (
            <IconSymbol name={icon} size={20} color={actionColor} style={styles.actionIcon} />
          )}
          <ThemedText style={[styles.actionLabel, { color: actionColor }]}>{label}</ThemedText>
        </ThemedView>
      </Pressable>
    );
  };

  const renderInfo = () => {
    if (!version && !copyright) return null;

    return (
      <ThemedView style={styles.infoContainer}>
        {version && (
          <ThemedText style={[styles.infoText, { color: textColor }]}>{version}</ThemedText>
        )}
        {copyright && (
          <ThemedText style={[styles.infoText, { color: textColor }]}>{copyright}</ThemedText>
        )}
      </ThemedView>
    );
  };

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor || defaultBackgroundColor,
          borderTopColor: borderColor,
          borderTopWidth: showBorder ? StyleSheet.hairlineWidth : 0,
          paddingVertical,
          paddingHorizontal,
        },
      ]}
    >
      {actions.length > 0 && (
        <ThemedView style={styles.actionsContainer}>{actions.map(renderAction)}</ThemedView>
      )}
      {renderInfo()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    // Container styles are set dynamically
  },
  actionsContainer: {
    // Actions container styles
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  actionButton: {
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  actionButtonPressed: {
    opacity: 0.5,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
  },
  infoText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
});
