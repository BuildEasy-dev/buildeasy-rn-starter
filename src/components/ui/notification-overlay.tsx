import { useCallback, useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PanGestureHandler,
  type PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { ThemedButton } from '@/components/themed/themed-button';
import { ThemedOverlay, type ThemedOverlayProps } from '@/components/themed/themed-overlay';
import { ThemedText } from '@/components/themed/themed-text';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export type NotificationVariant = 'success' | 'error' | 'info' | 'warning';

// 优雅的图标颜色，背景保持中性
const VARIANT_COLORS = {
  success: '#34C759', // iOS green
  error: '#FF3B30', // iOS red
  info: '#007AFF', // iOS blue
  warning: '#FF9500', // iOS orange
} as const;

const VARIANT_ICONS: Record<NotificationVariant, IconSymbolName> = {
  success: 'checkmark.circle.fill',
  error: 'xmark.circle.fill',
  info: 'info.circle.fill',
  warning: 'exclamationmark.triangle.fill',
} as const;

export interface NotificationOverlayProps extends Omit<ThemedOverlayProps, 'children' | 'variant'> {
  /**
   * The notification variant that determines styling and icon
   */
  variant: NotificationVariant;

  /**
   * Title text for the notification
   */
  title: string;

  /**
   * Optional message text below the title
   */
  message?: string;

  /**
   * Auto-dismiss duration in milliseconds
   * Set to 0 to disable auto-dismiss
   * @default 4000
   */
  autoDismissMs?: number;

  /**
   * Whether to enable swipe-to-dismiss gesture
   * @default true
   */
  swipeToDismiss?: boolean;

  /**
   * Optional action button configuration
   */
  action?: {
    label: string;
    onPress: () => void;
  };

  /**
   * Whether to automatically close when action is pressed
   * @default true
   */
  closeOnAction?: boolean;
}

/**
 * A notification overlay component that slides in from the top
 *
 * Provides toast-like notifications with auto-dismiss, swipe gestures,
 * and optional action buttons. Supports success, error, info, and warning variants.
 */
export function NotificationOverlay({
  variant,
  title,
  message,
  autoDismissMs = 4000,
  swipeToDismiss = true,
  action,
  closeOnAction = true,
  onClose,
  visible,
  animationSpeed = 'fast',
  ...overlayProps
}: NotificationOverlayProps) {
  const autoDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const translateY = useSharedValue(0);

  // Get theme colors and safe area insets
  const textColor = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const insets = useSafeAreaInsets();

  // Get variant-specific styling
  const variantColor = VARIANT_COLORS[variant];
  const variantIcon = VARIANT_ICONS[variant];

  // Auto-dismiss timer effect
  useEffect(() => {
    if (visible && autoDismissMs > 0) {
      autoDismissTimer.current = setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, autoDismissMs) as ReturnType<typeof setTimeout>;
    }

    return () => {
      if (autoDismissTimer.current) {
        clearTimeout(autoDismissTimer.current);
        autoDismissTimer.current = null;
      }
    };
  }, [visible, autoDismissMs, onClose]);

  // Clear timer on manual close
  const handleClose = useCallback(() => {
    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current);
      autoDismissTimer.current = null;
    }
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Handle action button press
  const handleAction = useCallback(() => {
    if (action?.onPress) {
      action.onPress();
    }
    if (closeOnAction) {
      handleClose();
    }
  }, [action, closeOnAction, handleClose]);

  // Swipe gesture handler
  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      // Reset any existing animation
      translateY.value = withTiming(0, { duration: 0 });
    },
    onActive: (event) => {
      // Only allow upward swipes (negative translateY)
      if (event.translationY < 0) {
        translateY.value = event.translationY;
      }
    },
    onEnd: (event) => {
      if (event.translationY < -50 || event.velocityY < -500) {
        // Swipe threshold met - dismiss
        translateY.value = withTiming(-200, { duration: 200 }, () => {
          runOnJS(handleClose)();
        });
      } else {
        // Return to original position
        translateY.value = withTiming(0, { duration: 200 });
      }
    },
  });

  // Animated style for swipe gesture
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Memoize container style - let ThemedOverlay handle background
  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        marginTop: insets.top,
      },
    ],
    [insets.top]
  );

  const content = (
    <Animated.View style={[containerStyle, animatedStyle]}>
      <View style={styles.content}>
        {/* Icon */}
        <IconSymbol name={variantIcon} size={20} color={variantColor} style={styles.icon} />

        {/* Text Content */}
        <View style={styles.textContainer}>
          <ThemedText style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </ThemedText>
          {message && (
            <ThemedText style={[styles.message, { color: textSecondary }]} numberOfLines={2}>
              {message}
            </ThemedText>
          )}
        </View>

        {/* Action Button */}
        {action && (
          <View style={styles.actionContainer}>
            <ThemedButton
              variant="ghost"
              size="small"
              label={action.label}
              onPress={handleAction}
              style={{
                ...styles.actionButton,
                borderColor: variantColor,
              }}
              accessibilityLabel={`${action.label} button`}
            />
          </View>
        )}

        {/* Close Button */}
        <Pressable
          onPress={handleClose}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Close notification"
          accessibilityHint="Dismisses this notification"
        >
          <IconSymbol name="xmark" size={16} color={textSecondary} />
        </Pressable>
      </View>
    </Animated.View>
  );

  return (
    <ThemedOverlay
      visible={visible}
      onClose={handleClose}
      variant="top"
      animationSpeed={animationSpeed}
      closeOnBackdropPress={false}
      {...overlayProps}
    >
      {swipeToDismiss ? (
        <PanGestureHandler onGestureEvent={gestureHandler}>{content}</PanGestureHandler>
      ) : (
        content
      )}
    </ThemedOverlay>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center', // Center align for iOS banner style
    paddingHorizontal: 16,
    paddingVertical: 12, // Reduced padding for banner style
    minHeight: 64, // iOS banner min height
  },
  icon: {
    marginRight: 12,
    width: 24, // Fixed icon container width
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 15, // iOS banner title size
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 1,
  },
  message: {
    fontSize: 13, // iOS banner subtitle size
    lineHeight: 18,
    opacity: 0.9,
  },
  actionContainer: {
    marginRight: 8,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 8, // iOS button radius
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 32,
  },
  closeButton: {
    padding: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
});
