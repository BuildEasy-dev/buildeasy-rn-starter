import { StyleSheet } from 'react-native';

import { ThemedModal, ThemedModalProps } from '@/components/themed/themed-modal';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedButton } from '@/components/themed/themed-button';

export interface NotificationModalProps extends Omit<ThemedModalProps, 'children' | 'variant'> {
  /**
   * Title of the notification
   */
  title: string;
  /**
   * Message content of the notification
   */
  message: string;
  /**
   * Icon to display (emoji or symbol)
   * @default "🔔"
   */
  icon?: string;
  /**
   * Label for the dismiss button
   * @default "Dismiss"
   */
  dismissLabel?: string;
  /**
   * Callback when dismiss button is pressed
   * If not provided, will use onClose
   */
  onDismiss?: () => void;
}

/**
 * NotificationModal Component
 *
 * A specialized modal for displaying notifications at the top of the screen.
 * Slides down from the top with a subtle backdrop.
 *
 * @example
 * ```tsx
 * <NotificationModal
 *   visible={showNotification}
 *   onClose={() => setShowNotification(false)}
 *   title="New Message"
 *   message="You have received a new message from John Doe"
 *   icon="📬"
 * />
 * ```
 */
export const NotificationModal = ({
  visible,
  onClose,
  title,
  message,
  icon = '🔔',
  dismissLabel = 'Dismiss',
  onDismiss,
  animationSpeed = 'fast',
  backdropOpacity = 0.3,
  ...props
}: NotificationModalProps) => {
  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
    onClose?.();
  };

  return (
    <ThemedModal
      visible={visible}
      onClose={onClose}
      variant="top"
      animationSpeed={animationSpeed}
      backdropOpacity={backdropOpacity}
      {...props}
    >
      <ThemedText type="h6" style={styles.title}>
        {icon} {title}
      </ThemedText>
      <ThemedText style={styles.content}>{message}</ThemedText>
      <ThemedButton
        onPress={handleDismiss}
        label={dismissLabel}
        variant="ghost"
        size="small"
        style={styles.button}
      />
    </ThemedModal>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'center',
  },
});
