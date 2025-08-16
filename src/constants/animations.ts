import { Easing } from 'react-native-reanimated';

/**
 * Unified animation system configuration
 *
 * Provides consistent animation parameters for the entire app to ensure a cohesive user experience
 */

export const animations = {
  /**
   * Animation durations (milliseconds)
   *
   * - fast: Quick animations for simple state changes
   * - normal: Standard animations for most scenarios
   * - slow: Slow animations for complex or important animations
   */
  durations: {
    fast: 200,
    normal: 250,
    slow: 350,
  },

  /**
   * Easing functions
   *
   * Based on Material Design and iOS design guidelines
   */
  easings: {
    // Standard easing, balanced entry and exit speeds
    easeInOut: Easing.bezier(0.4, 0.0, 0.2, 1),
    // Fast entry, slow exit - suitable for appear animations
    easeOut: Easing.bezier(0.0, 0.0, 0.2, 1),
    // Slow entry, fast exit - suitable for disappear animations
    easeIn: Easing.bezier(0.4, 0.0, 1, 1),
    // iOS style easing - more natural
    easeInOutQuart: Easing.bezier(0.77, 0, 0.175, 1),
    // Elastic effect - reduced elasticity
    easeOutBack: Easing.bezier(0.175, 0.885, 0.32, 1.275),
    // Added: Quick response easing
    easeOutQuart: Easing.bezier(0.25, 1, 0.5, 1),
    // Added: Smooth entry
    easeInQuart: Easing.bezier(0.5, 0, 0.75, 0),
  },

  /**
   * Predefined transform configurations
   *
   * Provides standardized animation parameters for different scenarios
   */
  transforms: {
    // Overlay animations
    overlay: {
      enter: {
        opacity: 1,
        scale: 1,
        translateY: 0,
      },
      exit: {
        opacity: 0,
        scale: 0.9,
        translateY: 0,
      },
    },
    // Modal animations
    modal: {
      enter: {
        opacity: 1,
        scale: 1,
        translateY: 0,
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        translateY: 20,
      },
    },
    // Bottom slide up animations
    slideUp: {
      enter: {
        opacity: 1,
        translateY: 0,
      },
      exit: {
        opacity: 0,
        translateY: 100,
      },
    },
    // Top slide down animations
    slideDown: {
      enter: {
        opacity: 1,
        translateY: 0,
      },
      exit: {
        opacity: 0,
        translateY: -100,
      },
    },
    // Fade in/out animations
    fade: {
      enter: {
        opacity: 1,
      },
      exit: {
        opacity: 0,
      },
    },
    // Scale animations
    scale: {
      enter: {
        opacity: 1,
        scale: 1,
      },
      exit: {
        opacity: 0,
        scale: 0.8,
      },
    },
  },

  /**
   * Animation configuration presets
   *
   * Provides complete animation configurations based on different component types and usage scenarios
   */
  presets: {
    // Dialog animations - quick response
    dialog: {
      duration: 250,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      enter: {
        opacity: 1,
        scale: 1,
        translateY: 0,
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        translateY: 8,
      },
    },
    // Bottom sheet animations - smooth and fast
    bottomSheet: {
      duration: 280,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
      enter: {
        opacity: 1,
        translateY: 0,
      },
      exit: {
        opacity: 0,
        translateY: 100,
      },
    },
    // Fullscreen modal animations - smooth transition
    fullscreen: {
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      enter: {
        opacity: 1,
        scale: 1,
      },
      exit: {
        opacity: 0,
        scale: 0.97,
      },
    },
    // Alert animations - quick with slight elasticity
    alert: {
      duration: 220,
      easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
      enter: {
        opacity: 1,
        scale: 1,
      },
      exit: {
        opacity: 0,
        scale: 0.92,
      },
    },
    // Notification animations - quick slide
    notification: {
      duration: 250,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
      enter: {
        opacity: 1,
        translateY: 0,
      },
      exit: {
        opacity: 0,
        translateY: -40,
      },
    },
  },

  /**
   * Background backdrop animation configuration
   */
  backdrop: {
    duration: 200,
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    enter: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  },
} as const;

/**
 * Animation utility functions
 */
export const animationUtils = {
  /**
   * Get duration based on animation speed
   */
  getDuration: (speed: 'fast' | 'normal' | 'slow' = 'normal') => {
    return animations.durations[speed];
  },

  /**
   * Get easing function based on animation type
   */
  getEasing: (type: keyof typeof animations.easings = 'easeInOut') => {
    return animations.easings[type];
  },

  /**
   * Get animation configuration based on preset
   */
  getPreset: (preset: keyof typeof animations.presets) => {
    return animations.presets[preset];
  },

  /**
   * Get transform configuration based on transform type
   */
  getTransform: (transform: keyof typeof animations.transforms) => {
    return animations.transforms[transform];
  },
};

export default animations;
