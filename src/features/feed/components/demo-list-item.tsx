import React from 'react';
import { StyleSheet, View, Pressable, ViewStyle } from 'react-native';
import { ListItem } from '@/components/layout';
import { ThemedText } from '@/components/themed';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface DemoListItemProps {
  // Content
  title: string;
  subtitle?: string;
  description?: string;

  // Leading element
  leadingIcon?: IconSymbolName;
  leadingIconColor?: string;

  // Trailing elements
  badge?: string | number;
  badgeColor?: string;
  showChevron?: boolean;

  // Behavior
  onPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
}

export function DemoListItem({
  title,
  subtitle,
  description,
  leadingIcon,
  leadingIconColor,
  badge,
  badgeColor,
  showChevron = false,
  onPress,
  disabled = false,
  selected = false,
}: DemoListItemProps) {
  const tintColor = useThemeColor('tint');
  const secondaryTextColor = useThemeColor('tabIconDefault');
  const disabledOpacity = 0.5;

  const finalLeadingIconColor = leadingIconColor || tintColor;
  const finalBadgeColor = badgeColor || tintColor;

  const leadingElement = leadingIcon ? (
    <View style={styles.iconContainer}>
      <IconSymbol name={leadingIcon} size={24} color={finalLeadingIconColor} />
    </View>
  ) : null;

  const trailingElements = [];

  if (badge !== undefined) {
    trailingElements.push(
      <View key="badge" style={[styles.badge, { backgroundColor: finalBadgeColor }]}>
        <ThemedText style={styles.badgeText}>{badge}</ThemedText>
      </View>
    );
  }

  if (showChevron) {
    trailingElements.push(
      <IconSymbol
        key="chevron"
        name="chevron.right"
        size={16}
        color={secondaryTextColor}
        style={styles.chevron}
      />
    );
  }

  const trailingElement =
    trailingElements.length > 0 ? (
      <View style={styles.trailingContainer}>{trailingElements}</View>
    ) : null;

  const backgroundColor = useThemeColor('background');
  const selectedBackgroundColor = useThemeColor('backgroundSecondary');

  const containerStyles: ViewStyle = StyleSheet.flatten([
    styles.itemContainer,
    selected && { backgroundColor: selectedBackgroundColor },
    !selected && { backgroundColor },
    disabled && { opacity: disabledOpacity },
  ]);

  const content = (
    <ListItem containerStyle={containerStyles}>
      <View style={styles.container}>
        {leadingElement && <View style={styles.leadingContainer}>{leadingElement}</View>}

        <View style={styles.content}>
          <ThemedText
            style={[styles.title, disabled && { opacity: disabledOpacity }]}
            numberOfLines={1}
          >
            {title}
          </ThemedText>

          {subtitle && (
            <ThemedText
              style={[
                styles.subtitle,
                { color: secondaryTextColor },
                disabled && { opacity: disabledOpacity },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </ThemedText>
          )}

          {description && (
            <ThemedText
              style={[
                styles.description,
                { color: secondaryTextColor },
                disabled && { opacity: disabledOpacity },
              ]}
              numberOfLines={2}
            >
              {description}
            </ThemedText>
          )}
        </View>

        {trailingElement && <View style={styles.trailingContainer}>{trailingElement}</View>}
      </View>
    </ListItem>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  itemContainer: {
    // Business-specific container styles can go here
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  leadingContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    lineHeight: 18,
  },
  description: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  trailingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  chevron: {
    marginLeft: 4,
  },
});
