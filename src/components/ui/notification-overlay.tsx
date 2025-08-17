import { StyleSheet } from 'react-native';

import { ThemedOverlay, ThemedOverlayProps } from '@/components/themed/themed-overlay';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedButton } from '@/components/themed/themed-button';

export interface NotificationOverlayProps extends Omit<ThemedOverlayProps, 'children' | 'variant'> {
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
 * NotificationOverlay Component
 *
 * A specialized overlay for displaying notifications at the top of the screen.
 * Slides down from the top with a subtle backdrop.
 *
 * @example
 * ```tsx
 * <NotificationOverlay
 *   visible={showNotification}
 *   onClose={() => setShowNotification(false)}
 *   title="New Message"
 *   message="You have received a new message from John Doe"
 *   icon="📬"
 * />
 * ```
 */
export const NotificationOverlay = ({
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
}: NotificationOverlayProps) => {
  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
    onClose?.();
  };

  return (
    <ThemedOverlay
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
    </ThemedOverlay>
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
