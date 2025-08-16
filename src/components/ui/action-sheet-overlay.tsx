import { useCallback, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { ThemedButton } from '@/components/themed/themed-button';
import { ThemedOverlay, type ThemedOverlayProps } from '@/components/themed/themed-overlay';
import { ThemedText } from '@/components/themed/themed-text';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { Separator } from '@/components/ui/separator';
import { useThemeColor } from '@/hooks/use-theme-color';

const DESTRUCTIVE_COLOR = '#FF3B30'; // iOS red color

export interface ActionSheetAction {
  /**
   * Unique identifier for the action
   */
  id: string;

  /**
   * Display label for the action
   */
  label: string;

  /**
   * Optional icon name for the action
   */
  icon?: IconSymbolName;

  /**
   * Whether this action is destructive (shows in danger style)
   * @default false
   */
  isDestructive?: boolean;

  /**
   * Whether this action is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional subtitle or description for the action
   */
  subtitle?: string;
}

export interface ActionSheetOverlayProps extends Omit<ThemedOverlayProps, 'children'> {
  /**
   * Called when an action is selected
   */
  onAction: (actionId: string) => void;

  /**
   * Optional title for the action sheet
   */
  title?: string;

  /**
   * Optional subtitle/description for the action sheet
   */
  subtitle?: string;

  /**
   * Actions to display as a flat list
   */
  actions: ActionSheetAction[];

  /**
   * Whether to show a cancel button at the bottom
   * @default true
   */
  showCancel?: boolean;

  /**
   * Custom text for the cancel button
   * @default "Cancel"
   */
  cancelLabel?: string;

  /**
   * Whether to automatically close the overlay when an action is selected
   * @default true
   */
  closeOnAction?: boolean;
}

/**
 * An action sheet overlay component built on top of ThemedOverlay
 *
 * Provides a mobile-friendly action sheet interface with support for
 * destructive actions and icons. Perfect for context menus and
 * action selection interfaces, following iOS design patterns.
 */
export function ActionSheetOverlay({
  onAction,
  onClose,
  title,
  subtitle,
  actions,
  showCancel = true,
  cancelLabel = 'Cancel',
  closeOnAction = true,
  variant = 'bottom',
  animationSpeed = 'fast',
  closeOnBackdropPress = true,
  ...overlayProps
}: ActionSheetOverlayProps) {
  const borderColor = useThemeColor('border');
  const textSecondary = useThemeColor('textSecondary');

  // Stable action handler
  const handleAction = useCallback(
    (actionId: string) => {
      onAction(actionId);
      if (closeOnAction && onClose) {
        onClose();
      }
    },
    [onAction, closeOnAction, onClose]
  );

  // Stable cancel handler
  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Get theme colors outside the callback
  const textColor = useThemeColor('text');

  // Render individual action item
  const renderAction = useCallback(
    (action: ActionSheetAction) => {
      const actionTextColor = action.isDestructive ? DESTRUCTIVE_COLOR : textColor;
      const iconColor = action.isDestructive ? DESTRUCTIVE_COLOR : textColor;

      return (
        <View key={action.id}>
          <Pressable
            onPress={() => handleAction(action.id)}
            disabled={action.disabled}
            style={({ pressed }) => [
              styles.actionItem,
              pressed && styles.actionItemPressed,
              action.disabled && styles.actionItemDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            accessibilityHint={action.subtitle || action.label}
          >
            <View style={styles.actionContent}>
              {action.icon && (
                <IconSymbol
                  name={action.icon}
                  size={20}
                  color={iconColor}
                  style={styles.actionIcon}
                />
              )}
              <View style={styles.actionTextContainer}>
                <ThemedText
                  style={[
                    styles.actionLabel,
                    { color: actionTextColor },
                    action.disabled && styles.actionLabelDisabled,
                  ]}
                >
                  {action.label}
                </ThemedText>
                {action.subtitle && (
                  <ThemedText style={[styles.actionSubtitle, { color: textSecondary }]}>
                    {action.subtitle}
                  </ThemedText>
                )}
              </View>
            </View>
          </Pressable>
          <Separator style={styles.actionSeparator} />
        </View>
      );
    },
    [handleAction, textSecondary, borderColor]
  );

  return (
    <ThemedOverlay
      variant={variant}
      animationSpeed={animationSpeed}
      closeOnBackdropPress={closeOnBackdropPress}
      onClose={onClose}
      {...overlayProps}
    >
      <View style={styles.container}>
        {/* Header */}
        {(title || subtitle) && (
          <View style={[styles.header, { borderBottomColor: borderColor }]}>
            {title && (
              <ThemedText type="h6" style={styles.title}>
                {title}
              </ThemedText>
            )}
            {subtitle && (
              <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
                {subtitle}
              </ThemedText>
            )}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>{actions.map((action) => renderAction(action))}</View>

        {/* Cancel Button */}
        {showCancel && (
          <View style={styles.cancelContainer}>
            <ThemedButton
              variant="ghost"
              size="large"
              label={cancelLabel}
              onPress={handleCancel}
              style={styles.cancelButton}
              accessibilityLabel={`${cancelLabel} button`}
              accessibilityHint="Closes the action sheet"
            />
          </View>
        )}
      </View>
    </ThemedOverlay>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 0,
  },
  actionItem: {
    minHeight: 56,
    backgroundColor: 'transparent',
  },
  actionItemPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  actionItemDisabled: {
    opacity: 0.3,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 56,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400',
  },
  actionLabelDisabled: {
    opacity: 0.3,
  },
  actionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  actionSeparator: {
    // Full width separator
  },
  cancelContainer: {
    marginTop: 16,
  },
  cancelButton: {
    marginHorizontal: 16,
    borderRadius: 12,
  },
});
