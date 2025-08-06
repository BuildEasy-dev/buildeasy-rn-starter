import { createTamagui } from '@tamagui/core';
import { config } from '@tamagui/config';
import { createInterFont } from '@tamagui/font-inter';

// Extend themes with semantic tokens while preserving all default tokens
const customThemes = {
  ...config.themes,

  // Extend light theme with semantic tokens
  light: {
    ...config.themes.light,
    // Brand colors (using Tamagui's blue scale)
    primary: config.themes.light.blue9,

    // Component-specific tokens (used by semantic tokens)
    placeholderColor: config.themes.light.gray9,
  },

  // Extend dark theme with semantic tokens
  dark: {
    ...config.themes.dark,
    // Brand colors
    primary: config.themes.dark.blue9,
    // Component-specific tokens (used by semantic tokens)
    placeholderColor: config.themes.dark.gray9,
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
