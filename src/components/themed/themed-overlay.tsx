import { forwardRef, useState, useEffect, memo, useMemo, useCallback } from 'react';
import { Pressable, View, Modal, StyleSheet, type ViewProps, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    const insets = useSafeAreaInsets();

    // Memoize variant and animation configurations to prevent recalculation
    const variantConfig = useMemo(() => overlayUtils.getVariantConfig(variant), [variant]);
    const animationPreset = useMemo(
      () =>
        animationUtils.getPreset(variantConfig.animationPreset as keyof typeof animations.presets),
      [variantConfig.animationPreset]
    );

    // Memoize initial animation values
    const initialValues = useMemo(() => {
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

      return {
        translateY: getInitialTranslateY(),
        scale: (animationPreset.exit as any).scale || 0.9,
        opacity: 0,
      };
    }, [variant, animationPreset]);

    const fadeAnim = useSharedValue(initialValues.opacity);
    const scaleAnim = useSharedValue(initialValues.scale);
    const translateYAnim = useSharedValue(initialValues.translateY);

    // Get theme colors - use backgroundSecondary for overlays to provide proper visual separation
    const backgroundColor = useThemeColor('backgroundSecondary', {
      light: lightColor,
      dark: darkColor,
    });

    // Memoize animation duration calculation
    const finalAnimationDuration = useMemo(
      () => animationDuration || animationUtils.getDuration(animationSpeed),
      [animationDuration, animationSpeed]
    );

    // Handle visibility changes
    // Memoize animation target values
    const animationTargets = useMemo(
      () => ({
        enter: {
          opacity: (animationPreset.enter as any).opacity || 1,
          scale: (animationPreset.enter as any).scale || 1,
          translateY: (animationPreset.enter as any).translateY || 0,
        },
        exit: {
          opacity: (animationPreset.exit as any).opacity || 0,
          scale: (animationPreset.exit as any).scale || 0.9,
          translateY: (animationPreset.exit as any).translateY || 0,
        },
      }),
      [animationPreset]
    );

    // Memoize animation config
    const animationConfig = useMemo(
      () => ({
        duration: finalAnimationDuration,
        easing: animationPreset.easing,
      }),
      [finalAnimationDuration, animationPreset.easing]
    );

    // Stable close modal callback
    const closeModal = useCallback(() => {
      setModalVisible(false);
    }, []);

    useEffect(() => {
      if (visible) {
        setModalVisible(true);

        // Apply enter animation with memoized values
        fadeAnim.value = withTiming(animationTargets.enter.opacity, animationConfig);
        scaleAnim.value = withTiming(animationTargets.enter.scale, animationConfig);
        translateYAnim.value = withTiming(animationTargets.enter.translateY, animationConfig);
      } else {
        // Apply exit animation with memoized values
        fadeAnim.value = withTiming(animationTargets.exit.opacity, animationConfig, (finished) => {
          if (finished) {
            runOnJS(closeModal)();
          }
        });

        scaleAnim.value = withTiming(animationTargets.exit.scale, animationConfig);
        translateYAnim.value = withTiming(animationTargets.exit.translateY, animationConfig);
      }
    }, [
      visible,
      fadeAnim,
      scaleAnim,
      translateYAnim,
      animationTargets,
      animationConfig,
      closeModal,
    ]);

    // Stable backdrop press handler
    const handleBackdropPress = useCallback(() => {
      if (closeOnBackdropPress && onClose) {
        onClose();
      }
    }, [closeOnBackdropPress, onClose]);

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
    const containerStyle = useMemo(() => overlayUtils.getContainerStyle(variant), [variant]);

    // Memoize content style based on variant and size with safe area insets
    const baseContentStyle = useMemo(() => {
      const mergedStyle = overlayUtils.mergeContentStyle(variant, size, contentContainerStyle);

      // Apply safe area padding based on variant
      if (variant === 'bottom') {
        const currentPadding =
          typeof mergedStyle.paddingBottom === 'number' ? mergedStyle.paddingBottom : 0;
        return {
          ...mergedStyle,
          paddingBottom: currentPadding + (insets.bottom || 18),
        };
      } else if (variant === 'top') {
        const currentPadding =
          typeof mergedStyle.paddingTop === 'number' ? mergedStyle.paddingTop : 0;
        return {
          ...mergedStyle,
          paddingTop: currentPadding + (insets.top || 0),
        };
      } else if (variant === 'fullscreen') {
        // Apply safe area insets on all sides for fullscreen
        const currentPaddingTop =
          typeof mergedStyle.paddingTop === 'number' ? mergedStyle.paddingTop : 0;
        const currentPaddingBottom =
          typeof mergedStyle.paddingBottom === 'number' ? mergedStyle.paddingBottom : 0;
        const currentPaddingLeft =
          typeof mergedStyle.paddingLeft === 'number' ? mergedStyle.paddingLeft : 0;
        const currentPaddingRight =
          typeof mergedStyle.paddingRight === 'number' ? mergedStyle.paddingRight : 0;

        return {
          ...mergedStyle,
          paddingTop: currentPaddingTop + insets.top,
          paddingBottom: currentPaddingBottom + insets.bottom,
          paddingLeft: currentPaddingLeft + insets.left,
          paddingRight: currentPaddingRight + insets.right,
        };
      }

      return mergedStyle;
    }, [
      variant,
      size,
      contentContainerStyle,
      insets.bottom,
      insets.top,
      insets.left,
      insets.right,
    ]);

    // Memoize default styling
    const defaultOverlayStyle = useMemo(
      () => ({
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      }),
      []
    );

    // Memoize merged content style
    const mergedContentStyle = useMemo(
      () => [defaultOverlayStyle, baseContentStyle],
      [defaultOverlayStyle, baseContentStyle]
    );

    // Memoize lazy loading content rendering
    const renderContent = useMemo(() => {
      if (lazy && !modalVisible) {
        return null;
      }
      return children;
    }, [lazy, modalVisible, children]);

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
            {renderContent}
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
