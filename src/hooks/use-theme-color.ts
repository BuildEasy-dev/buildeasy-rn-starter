/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useTheme } from '@tamagui/core';
import type { ThemeValueFallback } from '@tamagui/core';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Semantic token aliases for better DX
export const semanticTokens = {
  // Actually used tokens only
  text: 'color',
  primary: 'primary',
  background: 'background',
  tint: 'primary',
  icon: 'color',
  placeholder: 'placeholderColor',
} as const;

export type SemanticTokenName = keyof typeof semanticTokens;
export type ThemeTokenName = SemanticTokenName | string;

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

  // Check if it's a semantic token name and map it
  let tokenName = colorName;
  if (colorName in semanticTokens) {
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
