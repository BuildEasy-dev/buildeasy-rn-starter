import { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemedButton } from '@/components/themed/themed-button';
import { ThemedOverlay, type ThemedOverlayProps } from '@/components/themed/themed-overlay';
import { ThemedText } from '@/components/themed/themed-text';

export interface ConfirmOverlayProps extends Omit<ThemedOverlayProps, 'children'> {
  /**
   * Called when the confirm button is pressed
   */
  onConfirm: () => void;

  /**
   * Dialog title text
   */
  title: string;

  /**
   * Confirmation message text
   */
  message: string;

  /**
   * Custom text for the confirm button
   * @default "Confirm"
   */
  confirmLabel?: string;

  /**
   * Custom text for the cancel button
   * @default "Cancel"
   */
  cancelLabel?: string;

  /**
   * Whether the confirm action is destructive (shows confirm button in danger style)
   * @default false
   */
  isDestructive?: boolean;

  /**
   * Whether the confirm button should be disabled
   * @default false
   */
  confirmDisabled?: boolean;

  /**
   * Whether to automatically close the overlay when confirm is pressed
   * @default true
   */
  closeOnConfirm?: boolean;
}

/**
 * A confirmation dialog overlay component built on top of ThemedOverlay
 *
 * Provides a standard confirmation interface with title, message,
 * and confirm/cancel actions. Supports destructive action styling.
 */
export function ConfirmOverlay({
  onConfirm,
  onClose,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  confirmDisabled = false,
  closeOnConfirm = true,
  variant = 'alert',
  size = 'small',
  animationSpeed = 'fast',
  closeOnBackdropPress = false,
  ...overlayProps
}: ConfirmOverlayProps) {
  // Stable handlers to prevent unnecessary re-renders
  const handleConfirm = useCallback(() => {
    onConfirm();
    if (closeOnConfirm && onClose) {
      onClose();
    }
  }, [onConfirm, closeOnConfirm, onClose]);

  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Memoize button variant based on destructive state
  const confirmVariant = useMemo(() => {
    return isDestructive ? 'danger' : 'primary';
  }, [isDestructive]);

  return (
    <ThemedOverlay
      variant={variant}
      size={size}
      animationSpeed={animationSpeed}
      closeOnBackdropPress={closeOnBackdropPress}
      onClose={onClose}
      {...overlayProps}
    >
      <View style={styles.container}>
        {/* Title */}
        <ThemedText type="h5" style={styles.title}>
          {title}
        </ThemedText>

        {/* Message */}
        <ThemedText style={styles.message}>{message}</ThemedText>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <ThemedButton
            variant="outline"
            size="medium"
            label={cancelLabel}
            onPress={handleCancel}
            style={styles.cancelButton}
            accessibilityLabel={`${cancelLabel} button`}
            accessibilityHint="Dismisses the confirmation dialog"
          />

          <ThemedButton
            variant={confirmVariant}
            size="medium"
            label={confirmLabel}
            onPress={handleConfirm}
            disabled={confirmDisabled}
            style={styles.confirmButton}
            accessibilityLabel={`${confirmLabel} button`}
            accessibilityHint={
              isDestructive
                ? 'Performs a destructive action that cannot be undone'
                : 'Confirms the action'
            }
          />
        </View>
      </View>
    </ThemedOverlay>
  );
}

const styles = StyleSheet.create({
  container: {
    // No additional padding needed - alert variant handles this
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  confirmButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
