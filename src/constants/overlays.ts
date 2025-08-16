import { ViewStyle, DimensionValue } from 'react-native';

/**
 * Overlay component related constants and configurations
 */

export type OverlayVariant = 'center' | 'bottom' | 'top' | 'fullscreen' | 'alert';
export type OverlaySize = 'small' | 'medium' | 'large' | 'auto';

/**
 * Overlay variant configurations
 */
export const overlayVariants: Record<
  OverlayVariant,
  {
    justifyContent: ViewStyle['justifyContent'];
    alignItems: ViewStyle['alignItems'];
    contentStyle: ViewStyle;
    animationPreset: string;
  }
> = {
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    contentStyle: {
      borderRadius: 12,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    animationPreset: 'dialog',
  },
  bottom: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    contentStyle: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: '100%',
      elevation: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    animationPreset: 'bottomSheet',
  },
  top: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    contentStyle: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      width: '100%',
      elevation: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    animationPreset: 'notification',
  },
  fullscreen: {
    justifyContent: 'center',
    alignItems: 'stretch',
    contentStyle: {
      borderRadius: 0,
      width: '100%',
      height: '100%',
      padding: 0,
      elevation: 0,
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    animationPreset: 'fullscreen',
  },
  alert: {
    justifyContent: 'center',
    alignItems: 'center',
    contentStyle: {
      borderRadius: 8,
      elevation: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
    },
    animationPreset: 'alert',
  },
};

/**
 * Overlay size configurations
 */
export const overlaySizes: Record<
  OverlaySize,
  {
    minWidth: DimensionValue;
    maxWidth: DimensionValue;
    padding: number;
  }
> = {
  small: {
    minWidth: '60%',
    maxWidth: '70%',
    padding: 16,
  },
  medium: {
    minWidth: '80%',
    maxWidth: '90%',
    padding: 20,
  },
  large: {
    minWidth: '90%',
    maxWidth: '95%',
    padding: 24,
  },
  auto: {
    minWidth: 'auto',
    maxWidth: '90%',
    padding: 20,
  },
};

/**
 * Default configurations
 */
export const overlayDefaults = {
  variant: 'center' as OverlayVariant,
  size: 'medium' as OverlaySize,
  animationSpeed: 'normal' as 'fast' | 'normal' | 'slow',
  backdropOpacity: 0.5,
  closeOnBackdropPress: true,
  lazy: false,
} as const;

/**
 * Background backdrop configuration
 */
export const backdropConfig = {
  opacity: 0.5,
  color: 'black',
  blurRadius: 0,
} as const;

/**
 * Utility functions
 */
export const overlayUtils = {
  /**
   * Get variant configuration
   */
  getVariantConfig: (variant: OverlayVariant) => {
    return overlayVariants[variant];
  },

  /**
   * Get size configuration
   */
  getSizeConfig: (size: OverlaySize) => {
    return overlaySizes[size];
  },

  /**
   * Merge content styles
   */
  mergeContentStyle: (
    variant: OverlayVariant,
    size: OverlaySize,
    customStyle?: ViewStyle
  ): ViewStyle => {
    const variantConfig = overlayVariants[variant];
    const sizeConfig = overlaySizes[size];

    // These variants should ignore size configuration width constraints
    const shouldIgnoreWidthConstraints = ['bottom', 'top', 'fullscreen'].includes(variant);

    const mergedStyle: ViewStyle = {
      ...variantConfig.contentStyle,
      padding: sizeConfig.padding,
      ...customStyle,
    };

    // Only add width constraints for variants that need size constraints
    if (!shouldIgnoreWidthConstraints) {
      mergedStyle.minWidth = sizeConfig.minWidth;
      mergedStyle.maxWidth = sizeConfig.maxWidth;
    }

    return mergedStyle;
  },

  /**
   * Get container style
   */
  getContainerStyle: (variant: OverlayVariant): ViewStyle => {
    const config = overlayVariants[variant];
    return {
      flex: 1,
      justifyContent: config.justifyContent,
      alignItems: config.alignItems,
    };
  },
};

export default {
  variants: overlayVariants,
  sizes: overlaySizes,
  defaults: overlayDefaults,
  backdrop: backdropConfig,
  utils: overlayUtils,
};
