import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { ThemedText } from '@/components/themed';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface DrawerItemProps {
  /**
   * Label text for the item
   */
  label: string;
  /**
   * Icon name from IconSymbol
   */
  icon?: IconSymbolName;
  /**
   * Whether this item is currently active
   */
  focused?: boolean;
  /**
   * Badge text or number to display
   */
  badge?: string | number;
  /**
   * Badge variant
   */
  badgeVariant?: 'default' | 'danger';
  /**
   * Press handler
   */
  onPress: () => void;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Custom style for the item
   */
  style?: any;
}

/**
 * DrawerItem - Theme-aware drawer item component
 *
 * Features:
 * - Integrates with IconSymbol for consistent icons
 * - Badge support with variants
 * - Active state styling
 * - Theme-aware colors
 * - Disabled state
 *
 * @example
 * ```tsx
 * <DrawerItem
 *   label="Dashboard"
 *   icon="house.fill"
 *   focused={isActive}
 *   badge={3}
 *   onPress={() => navigation.navigate('dashboard')}
 * />
 *
 * <DrawerItem
 *   label="Notifications"
 *   icon="bell.fill"
 *   badge="!"
 *   badgeVariant="danger"
 *   onPress={() => navigation.navigate('notifications')}
 * />
 * ```
 */
export function DrawerItem({
  label,
  icon,
  focused = false,
  badge,
  badgeVariant = 'default',
  onPress,
  disabled = false,
  style,
}: DrawerItemProps) {
  const textColor = useThemeColor('text');
  const tintColor = useThemeColor('tint');
  const backgroundColor = useThemeColor('background');

  const getBadgeColors = () => {
    switch (badgeVariant) {
      case 'danger':
        return {
          bg: '#FF3B30',
          text: '#FFFFFF',
        };
      default:
        return {
          bg: tintColor,
          text: backgroundColor,
        };
    }
  };

  const badgeColors = getBadgeColors();
  const itemColor = focused ? tintColor : textColor;
  const focusedBackgroundColor = focused
    ? tintColor.startsWith('#')
      ? `${tintColor}15`
      : 'rgba(0, 122, 255, 0.1)'
    : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        focused && styles.containerFocused,
        focused && { backgroundColor: focusedBackgroundColor },
        disabled && styles.containerDisabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && (
          <View style={styles.iconContainer}>
            <IconSymbol name={icon} size={24} color={disabled ? `${textColor}50` : itemColor} />
          </View>
        )}

        <ThemedText
          style={[
            styles.label,
            focused && styles.labelFocused,
            disabled && styles.labelDisabled,
            { color: disabled ? `${textColor}50` : itemColor },
          ]}
          numberOfLines={1}
        >
          {label}
        </ThemedText>

        {badge !== undefined && (
          <View
            style={[
              styles.badge,
              { backgroundColor: badgeColors.bg },
              // Make it a perfect circle for single characters
              String(badge).length === 1 && styles.badgeCircle,
            ]}
          >
            <ThemedText style={[styles.badgeText, { color: badgeColors.text }]}>{badge}</ThemedText>
          </View>
        )}
      </View>
    </Pressable>
  );
}

/**
 * DrawerItemSeparator - Separator component for drawer items
 */
export function DrawerItemSeparator() {
  const borderColor = useThemeColor('border');

  return <View style={[styles.separator, { backgroundColor: borderColor }]} />;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
  },
  containerFocused: {
    // Background color is set dynamically
  },
  containerDisabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  labelFocused: {
    fontWeight: '600',
  },
  labelDisabled: {
    // Color is set dynamically
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
