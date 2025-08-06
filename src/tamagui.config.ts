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
    primaryLight: config.themes.light.blue6,
    primaryDark: config.themes.light.blue11,

    // Semantic colors
    success: config.themes.light.green9,
    successLight: config.themes.light.green6,
    successDark: config.themes.light.green11,

    warning: config.themes.light.yellow9,
    warningLight: config.themes.light.yellow6,
    warningDark: config.themes.light.yellow11,

    error: config.themes.light.red9,
    errorLight: config.themes.light.red6,
    errorDark: config.themes.light.red11,

    info: config.themes.light.blue9,
    infoLight: config.themes.light.blue6,
    infoDark: config.themes.light.blue11,

    // Component-specific tokens (used by semantic tokens)
    placeholderColor: config.themes.light.gray9,
  },

  // Extend dark theme with semantic tokens
  dark: {
    ...config.themes.dark,
    // Brand colors
    primary: config.themes.dark.blue9,
    primaryLight: config.themes.dark.blue6,
    primaryDark: config.themes.dark.blue11,

    // Semantic colors
    success: config.themes.dark.green9,
    successLight: config.themes.dark.green6,
    successDark: config.themes.dark.green11,

    warning: config.themes.dark.yellow9,
    warningLight: config.themes.dark.yellow6,
    warningDark: config.themes.dark.yellow11,

    error: config.themes.dark.red9,
    errorLight: config.themes.dark.red6,
    errorDark: config.themes.dark.red11,

    info: config.themes.dark.blue9,
    infoLight: config.themes.dark.blue6,
    infoDark: config.themes.dark.blue11,

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
