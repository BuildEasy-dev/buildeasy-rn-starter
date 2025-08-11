import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle, PressableProps, TextStyle } from 'react-native';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface ListItemProps extends Omit<PressableProps, 'style' | 'children'> {
  // Content
  title: string;
  subtitle?: string;
  description?: string;

  // Leading element
  leadingIcon?: IconSymbolName;
  leadingIconColor?: string;
  leadingElement?: React.ReactNode;

  // Trailing element
  trailingIcon?: IconSymbolName;
  trailingIconColor?: string;
  trailingText?: string;
  trailingElement?: React.ReactNode;
  showChevron?: boolean;

  // Badge
  badge?: string | number;
  badgeColor?: string;

  // Styling
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;

  // Behavior
  onPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
}

export function ListItem({
  title,
  subtitle,
  description,
  leadingIcon,
  leadingIconColor,
  leadingElement,
  trailingIcon,
  trailingIconColor,
  trailingText,
  trailingElement,
  showChevron = false,
  badge,
  badgeColor,
  containerStyle,
  contentStyle,
  titleStyle,
  subtitleStyle,
  onPress,
  disabled = false,
  selected = false,
  ...pressableProps
}: ListItemProps) {
  const tintColor = useThemeColor('tint');
  const textColor = useThemeColor('text');
  const secondaryTextColor = useThemeColor('tabIconDefault');
  const backgroundColor = useThemeColor('background');
  const selectedBackgroundColor = useThemeColor('backgroundSecondary');
  const disabledOpacity = 0.5;

  const finalLeadingIconColor = leadingIconColor || tintColor;
  const finalTrailingIconColor = trailingIconColor || secondaryTextColor;
  const finalBadgeColor = badgeColor || tintColor;

  const renderLeading = () => {
    if (leadingElement) {
      return leadingElement;
    }

    if (leadingIcon) {
      return (
        <View style={styles.leadingContainer}>
          <IconSymbol name={leadingIcon} size={24} color={finalLeadingIconColor} />
        </View>
      );
    }

    return null;
  };

  const renderTrailing = () => {
    const elements: React.ReactNode[] = [];

    if (badge !== undefined) {
      elements.push(
        <View key="badge" style={[styles.badge, { backgroundColor: finalBadgeColor }]}>
          <ThemedText style={styles.badgeText}>{badge}</ThemedText>
        </View>
      );
    }

    if (trailingText) {
      elements.push(
        <ThemedText key="text" style={[styles.trailingText, { color: secondaryTextColor }]}>
          {trailingText}
        </ThemedText>
      );
    }

    if (trailingElement) {
      elements.push(<React.Fragment key="element">{trailingElement}</React.Fragment>);
    }

    if (trailingIcon) {
      elements.push(
        <IconSymbol
          key="icon"
          name={trailingIcon}
          size={20}
          color={finalTrailingIconColor}
          style={styles.trailingIcon}
        />
      );
    }

    if (showChevron) {
      elements.push(
        <IconSymbol
          key="chevron"
          name="chevron.right"
          size={16}
          color={secondaryTextColor}
          style={styles.chevron}
        />
      );
    }

    if (elements.length === 0) return null;

    return <View style={styles.trailingContainer}>{elements}</View>;
  };

  const content = (
    <ThemedView
      style={[
        styles.container,
        selected && { backgroundColor: selectedBackgroundColor },
        !selected && { backgroundColor },
        containerStyle,
      ]}
    >
      {renderLeading()}

      <View style={[styles.content, contentStyle]}>
        <ThemedText
          style={[
            styles.title,
            { color: textColor },
            disabled && { opacity: disabledOpacity },
            titleStyle,
          ]}
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
              subtitleStyle,
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

      {renderTrailing()}
    </ThemedView>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [pressed && styles.pressed]}
        {...pressableProps}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
  },
  pressed: {
    opacity: 0.7,
  },
  leadingContainer: {
    marginRight: 16,
    width: 40,
    alignItems: 'center',
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
  trailingText: {
    fontSize: 14,
    marginRight: 8,
  },
  trailingIcon: {
    marginLeft: 8,
  },
  chevron: {
    marginLeft: 4,
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
});
