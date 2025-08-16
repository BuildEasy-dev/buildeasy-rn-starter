import { forwardRef, useState, useEffect, memo } from 'react';
import { Pressable, View, Modal, StyleSheet, type ViewProps, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { animationUtils, animations } from '@/constants/animations';
import { overlayUtils, type OverlayVariant, type OverlaySize } from '@/constants/overlays';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedOverlayProps = Omit<ViewProps, 'style'> & {
  lightColor?: string;
  darkColor?: string;
  visible: boolean;
  onClose?: () => void;
  closeOnBackdropPress?: boolean;
  animationDuration?: number;
  backdropOpacity?: number;
  children?: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  // New properties
  variant?: OverlayVariant;
  size?: OverlaySize;
  animationSpeed?: 'fast' | 'normal' | 'slow';
  lazy?: boolean;
};

/**
 * A theme-aware Overlay component that adapts to light and dark mode.
 *
 * Provides a modal overlay with customizable background and content.
 * Supports multiple variants (center, bottom, top, fullscreen, alert) and sizes.
 */
const ThemedOverlayComponent = forwardRef<View, ThemedOverlayProps>(
  (
    {
      style,
      lightColor,
      darkColor,
      visible = false,
      onClose,
      closeOnBackdropPress = true,
      animationDuration,
      backdropOpacity = 0.5,
      children,
      contentContainerStyle,
      variant = 'center',
      size = 'medium',
      animationSpeed = 'normal',
      lazy = false,
      ...rest
    },
    ref
  ) => {
    const [modalVisible, setModalVisible] = useState(visible);

    // Get variant and size configurations
    const variantConfig = overlayUtils.getVariantConfig(variant);
    const animationPreset = animationUtils.getPreset(
      variantConfig.animationPreset as keyof typeof animations.presets
    );

    // Initialize animation values based on variant type
    const getInitialTranslateY = () => {
      switch (variant) {
        case 'bottom':
          return 100; // Start from below screen
        case 'top':
          return -50; // Start from above screen
        default:
          return (animationPreset.exit as any).translateY || 0;
      }
    };

    const fadeAnim = useSharedValue(0);
    const scaleAnim = useSharedValue((animationPreset.exit as any).scale || 0.9);
    const translateYAnim = useSharedValue(getInitialTranslateY());

    // Get theme colors - use backgroundSecondary for overlays to provide proper visual separation
    const backgroundColor = useThemeColor('backgroundSecondary', {
      light: lightColor,
      dark: darkColor,
    });

    // Calculate animation duration
    const finalAnimationDuration = animationDuration || animationUtils.getDuration(animationSpeed);

    // Handle visibility changes
    useEffect(() => {
      if (visible) {
        setModalVisible(true);

        // Apply enter animation based on variant
        fadeAnim.value = withTiming((animationPreset.enter as any).opacity || 1, {
          duration: finalAnimationDuration,
          easing: animationPreset.easing,
        });

        scaleAnim.value = withTiming((animationPreset.enter as any).scale || 1, {
          duration: finalAnimationDuration,
          easing: animationPreset.easing,
        });

        translateYAnim.value = withTiming((animationPreset.enter as any).translateY || 0, {
          duration: finalAnimationDuration,
          easing: animationPreset.easing,
        });
      } else {
        const closeModal = () => {
          setModalVisible(false);
        };

        // Apply exit animation based on variant
        fadeAnim.value = withTiming(
          (animationPreset.exit as any).opacity || 0,
          {
            duration: finalAnimationDuration,
            easing: animationPreset.easing,
          },
          (finished) => {
            if (finished) {
              runOnJS(closeModal)();
            }
          }
        );

        scaleAnim.value = withTiming((animationPreset.exit as any).scale || 0.9, {
          duration: finalAnimationDuration,
          easing: animationPreset.easing,
        });

        translateYAnim.value = withTiming((animationPreset.exit as any).translateY || 0, {
          duration: finalAnimationDuration,
          easing: animationPreset.easing,
        });
      }
    }, [visible, fadeAnim, scaleAnim, translateYAnim, finalAnimationDuration, animationPreset]);

    // Handle backdrop press
    const handleBackdropPress = () => {
      if (closeOnBackdropPress && onClose) {
        onClose();
      }
    };

    // Animated styles
    const backdropAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: fadeAnim.value * backdropOpacity,
        backgroundColor: 'black',
      };
    });

    const contentAnimatedStyle = useAnimatedStyle(() => {
      const transforms = [];

      if (scaleAnim.value !== 1) {
        transforms.push({ scale: scaleAnim.value });
      }

      if (translateYAnim.value !== 0) {
        transforms.push({ translateY: translateYAnim.value });
      }

      return {
        opacity: fadeAnim.value,
        transform: transforms,
      };
    });

    // Memoize container style based on variant
    const containerStyle = overlayUtils.getContainerStyle(variant);

    // Memoize content style based on variant and size
    const baseContentStyle = overlayUtils.mergeContentStyle(variant, size, contentContainerStyle);

    // Add default styling for better visibility in dark mode
    const defaultOverlayStyle = {
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    };

    const mergedContentStyle = [defaultOverlayStyle, baseContentStyle];

    // Lazy loading support
    const renderContent = () => {
      if (lazy && !modalVisible) {
        return null;
      }
      return children;
    };

    return (
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={onClose}
        statusBarTranslucent
        animationType="none"
      >
        <View style={[containerStyle, style]} {...rest}>
          <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
            <Pressable
              style={styles.backdropPressable}
              onPress={handleBackdropPress}
              accessibilityRole="button"
              accessibilityLabel="Close overlay"
              accessibilityHint="Closes the overlay when pressed"
            />
          </Animated.View>

          <Animated.View
            ref={ref}
            style={[styles.content, { backgroundColor }, mergedContentStyle, contentAnimatedStyle]}
          >
            {renderContent()}
          </Animated.View>
        </View>
      </Modal>
    );
  }
);

ThemedOverlayComponent.displayName = 'ThemedOverlay';

// Memoize the component to prevent unnecessary re-renders
export const ThemedOverlay = memo(ThemedOverlayComponent);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropPressable: {
    flex: 1,
  },
  content: {
    // Base styles - specific styles are merged from variant and size configs
  },
});
