import { createTamagui } from '@tamagui/core';
import { config } from '@tamagui/config';
import { createInterFont } from '@tamagui/font-inter';

// Color constants
const COLORS = {
  BRAND_PRIMARY: '#007AFF',
  ERROR: '#FF3B30',
  SUCCESS: '#34C759',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
} as const;

// Extend themes with semantic tokens while preserving all default tokens
const customThemes = {
  ...config.themes,

  // Extend light theme with semantic tokens
  light: {
    ...config.themes.light,
    // Brand colors
    primary: COLORS.BRAND_PRIMARY,
    error: COLORS.ERROR,
    success: COLORS.SUCCESS,
    // Text/icon color - consistent across platforms
    color: COLORS.BLACK,
    // Switch colors
    switchThumb: COLORS.WHITE,
    switchTrackActive: COLORS.BRAND_PRIMARY,
    switchTrackInactive: config.themes.light.gray6,
  },

  // Extend dark theme with semantic tokens
  dark: {
    ...config.themes.dark,
    // Brand colors
    primary: COLORS.BRAND_PRIMARY,
    error: COLORS.ERROR,
    success: COLORS.SUCCESS,
    // Text/icon color - consistent across platforms
    color: COLORS.WHITE,
    // Switch colors
    switchThumb: COLORS.WHITE,
    switchTrackActive: COLORS.BRAND_PRIMARY,
    switchTrackInactive: config.themes.dark.gray6,
  },
};

const interFont = createInterFont();

export const tamaguiConfig = createTamagui({
  ...config,
  themes: customThemes,
  fonts: {
    ...config.fonts,
    body: interFont,
    heading: interFont,
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;
declare module '@tamagui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends Conf {}
}
