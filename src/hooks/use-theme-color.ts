/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useTheme } from '@tamagui/core';
import type { ThemeValueFallback } from '@tamagui/core';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Legacy color names for backward compatibility
export type LegacyColorName =
  | 'text'
  | 'background'
  | 'tint'
  | 'icon'
  | 'tabIconDefault'
  | 'tabIconSelected'
  | 'placeholder';

// Map legacy color names to Tamagui theme tokens
const legacyMapping: Record<LegacyColorName, string> = {
  text: 'color',
  background: 'background',
  tint: 'primary',
  icon: 'color',
  tabIconDefault: 'tabIconDefault',
  tabIconSelected: 'tabIconSelected',
  placeholder: 'placeholderColor',
};

// Semantic token aliases for better DX
export const semanticTokens = {
  // Text colors
  text: 'color',
  textSubtle: 'textSubtle',
  textMuted: 'textMuted',
  textDisabled: 'textDisabled',

  // Background colors
  background: 'background',
  backgroundHover: 'backgroundHover',
  backgroundPress: 'backgroundPress',
  backgroundFocus: 'backgroundFocus',
  backgroundStrong: 'backgroundStrong',
  bgSecondary: 'bgSecondary',
  bgTertiary: 'bgTertiary',
  bgDisabled: 'bgDisabled',

  // Border colors
  border: 'borderColor',
  borderHover: 'borderColorHover',
  borderFocus: 'borderColorFocus',
  borderPress: 'borderColorPress',
  borderSubtle: 'borderSubtle',
  borderStrong: 'borderStrong',

  // Brand colors
  primary: 'primary',
  primaryLight: 'primaryLight',
  primaryDark: 'primaryDark',

  // Semantic colors
  success: 'success',
  successLight: 'successLight',
  successDark: 'successDark',
  warning: 'warning',
  warningLight: 'warningLight',
  warningDark: 'warningDark',
  error: 'error',
  errorLight: 'errorLight',
  errorDark: 'errorDark',
  info: 'info',
  infoLight: 'infoLight',
  infoDark: 'infoDark',

  // Component specific
  tabIconDefault: 'tabIconDefault',
  tabIconSelected: 'tabIconSelected',
  placeholder: 'placeholderColor',

  // Shadow colors
  shadow: 'shadowColor',
  shadowHover: 'shadowColorHover',
  shadowPress: 'shadowColorPress',
  shadowFocus: 'shadowColorFocus',
} as const;

export type SemanticTokenName = keyof typeof semanticTokens;
export type ThemeTokenName = SemanticTokenName | LegacyColorName | string;

/**
 * Hook to get theme colors from Tamagui theme
 * Supports both legacy names and new semantic tokens
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeTokenName
): string {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = useTheme();
  const colorFromProps = props[colorScheme];

  // If custom color is provided, use it
  if (colorFromProps) {
    return colorFromProps;
  }

  // Check if it's a legacy name and map it
  let tokenName = colorName;
  if (colorName in legacyMapping) {
    tokenName = legacyMapping[colorName as LegacyColorName];
  } else if (colorName in semanticTokens) {
    tokenName = semanticTokens[colorName as SemanticTokenName];
  }

  // Get color from Tamagui theme
  const themeValue = theme[tokenName as keyof typeof theme] as ThemeValueFallback | undefined;

  if (themeValue) {
    // Handle Tamagui theme variable
    if (typeof themeValue === 'object' && 'val' in themeValue) {
      return themeValue.val as string;
    }
    // Handle direct string value
    if (typeof themeValue === 'string') {
      return themeValue;
    }
  }

  // Fallback to theme.color if token not found
  const fallbackColor = theme.color;
  if (fallbackColor && typeof fallbackColor === 'object' && 'val' in fallbackColor) {
    return fallbackColor.val as string;
  }

  // Last resort fallback
  return colorScheme === 'dark' ? '#ECEDEE' : '#11181C';
}

/**
 * Direct access to theme tokens without props override
 * Use this when you need raw theme values
 */
export function useThemeToken(tokenName: ThemeTokenName): string {
  return useThemeColor({}, tokenName);
}
