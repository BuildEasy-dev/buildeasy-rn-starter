/**
 * UI and UX settings configuration
 *
 * This file contains app-wide UI/UX preferences and feature flags
 * that can be used to customize the appearance and behavior of components.
 */

export const SettingsConfig = {
  // UI Preferences
  UI: {
    // Enable card-style design for setting sections
    // When true, all SettingSection components will use card style by default
    // When false, all SettingSection components will use the traditional flat style
    USE_CARD_STYLE: true,

    // Card style properties
    CARD_BORDER_RADIUS: 12,
    CARD_MARGIN_HORIZONTAL: 12, // Reduced from 16 to work with smaller page padding

    // Page layout adjustments for card style
    // When card style is enabled, use smaller horizontal padding to give cards more space
    PAGE_PADDING_HORIZONTAL: 8, // For card style (reduced from typical 16)
    PAGE_PADDING_HORIZONTAL_DEFAULT: 16, // For default style
  },

  // Animation preferences
  ANIMATIONS: {
    ENABLE_TRANSITIONS: true,
    TRANSITION_DURATION: 200,
  },
} as const;

export type SettingsConfigType = typeof SettingsConfig;
