/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useTheme } from '@tamagui/core';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Supported color names that map to Tamagui theme tokens
export type ThemeColorName =
  | 'text'
  | 'background'
  | 'tint'
  | 'icon'
  | 'tabIconDefault'
  | 'tabIconSelected'
  | 'placeholder';

// Map legacy color names to Tamagui theme tokens
const colorMapping: Record<ThemeColorName, string> = {
  text: 'color',
  background: 'background',
  tint: 'primary',
  icon: 'color',
  tabIconDefault: 'color',
  tabIconSelected: 'primary',
  placeholder: 'placeholderColor',
};

// Fallback colors when Tamagui theme is not available
const fallbackColors = {
  light: {
    text: '#11181C',
    background: '#ffffff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
    placeholder: '#8E8E93',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#ffffff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#ffffff',
    placeholder: '#636366',
  },
};

export function useThemeColor(props: { light?: string; dark?: string }, colorName: ThemeColorName) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = useTheme();
  const colorFromProps = props[colorScheme];

  // If custom color is provided, use it
  if (colorFromProps) {
    return colorFromProps;
  }

  // Try to get color from Tamagui theme
  try {
    const tamaguiToken = colorMapping[colorName];
    const themeColor = theme[tamaguiToken as keyof typeof theme];

    if (themeColor && typeof themeColor === 'object' && 'val' in themeColor) {
      return themeColor.val as string;
    }
  } catch {
    // Fallback if Tamagui theme is not available
  }

  // Fallback to static colors for compatibility
  return fallbackColors[colorScheme][colorName];
}
