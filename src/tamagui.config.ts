import { createTamagui } from '@tamagui/core';
import { config } from '@tamagui/config';
import { createInterFont } from '@tamagui/font-inter';

// Use Tamagui default theme with optional brand customization
const customThemes = {
  ...config.themes,

  // Optional: Add brand-specific theme variants
  light_brand: {
    ...config.themes.light,
    primary: '#0a7ea4', // Keep your brand color
    primaryHover: '#0891b2',
  },

  dark_brand: {
    ...config.themes.dark,
    primary: '#ffffff',
    primaryHover: '#e5e7eb',
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
