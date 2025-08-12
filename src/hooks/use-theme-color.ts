/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useTheme } from '@tamagui/core';
import type { ThemeValueFallback } from '@tamagui/core';

import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Available theme tokens from Tamagui v4 themes
 * Docs: https://tamagui.dev/docs/core/theme
 *
 * Core tokens:
 * - color, color1-12: Main text/content colors
 * - background, background0-08: Background colors
 * - borderColor, borderColorHover, borderColorPress, borderColorFocus
 * - placeholderColor: Input placeholder text
 * - outlineColor: Focus outline color
 *
 * Interactive states:
 * - colorHover, colorPress, colorFocus
 * - backgroundHover, backgroundPress, backgroundFocus
 *
 * Accent colors:
 * - accentBackground, accentColor
 *
 * Color palettes (each has 1-12 scale):
 * - blue1-12, gray1-12, green1-12, orange1-12
 * - pink1-12, purple1-12, red1-12, yellow1-12
 * - black1-12, white1-12
 *
 * Shadows:
 * - shadow1-10: Shadow intensity levels
 *
 * Custom tokens (added in tamagui.config.ts):
 * - primary: Primary brand color (custom)
 *
 * Semantic aliases (defined below):
 * - text → color
 * - tint → primary
 * - icon → color
 * - placeholder → placeholderColor
 * - separator → gray4
 */

// Get theme token names from Tamagui config
type TamaguiThemeKeys = keyof ReturnType<typeof useTheme>;

// Semantic token aliases for better DX
export const semanticTokens = {
  // Actually used tokens only
  text: 'color',
  tint: 'primary',
  icon: 'color',
  placeholder: 'placeholderColor',
  separator: 'gray4',
} as const;

type SemanticTokenName = keyof typeof semanticTokens;
// Combine semantic tokens with Tamagui theme tokens (no $ prefix needed)
export type ThemeTokenName = SemanticTokenName | TamaguiThemeKeys;

/**
 * Hook to get theme colors from Tamagui theme
 * Supports both legacy names and new semantic tokens
 */
export function useThemeColor(
  colorName: ThemeTokenName,
  props?: { light?: string; dark?: string }
): string {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = useTheme();
  if (props) {
    const colorFromProps = props[colorScheme];

    // If custom color is provided, use it
    if (colorFromProps) {
      return colorFromProps;
    }
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
