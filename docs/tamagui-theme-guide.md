# Tamagui Theme Integration Guide

This guide explains how to use the Tamagui theme system with semantic tokens in your React Native app.

## Overview

Our theme system is built on Tamagui's theming engine with additional semantic tokens for better developer experience. It provides:

- ✅ Automatic light/dark mode support
- ✅ Semantic token names for better code readability
- ✅ Full TypeScript support
- ✅ Backward compatibility with existing components
- ✅ Access to Tamagui's complete color palette

## Available Tokens

### Core Tamagui Tokens

All standard Tamagui tokens are available with `$` prefix:

```tsx
// Color scales (1-12, lightest to darkest)
<Text color="$color1">Very light text</Text>
<Text color="$color12">Very dark text</Text>

// Semantic colors
<View backgroundColor="$background" />
<Text color="$color" />
<View borderColor="$borderColor" />

// Color palette (blue, gray, green, orange, pink, purple, red, yellow)
<Text color="$blue9">Blue text</Text>
<View backgroundColor="$gray2" />
```

### Enhanced Semantic Tokens

We've added semantic token aliases for better DX:

```tsx
// Text colors
<Text color="text">Default text</Text>
<Text color="textSubtle">Subtle text</Text>
<Text color="textMuted">Muted text</Text>
<Text color="textDisabled">Disabled text</Text>

// Background colors
<View backgroundColor="background" />
<View backgroundColor="bgSecondary" />
<View backgroundColor="bgTertiary" />

// Border colors
<View borderColor="border" />
<View borderColor="borderSubtle" />
<View borderColor="borderStrong" />

// Brand colors
<Text color="primary">Primary brand color</Text>
<Text color="primaryLight">Light brand color</Text>

// Semantic colors
<Text color="success">Success text</Text>
<Text color="warning">Warning text</Text>
<Text color="error">Error text</Text>
<Text color="info">Info text</Text>
```

## Using the Theme System

### 1. With Direct Tamagui Components

Use Tamagui components directly with theme tokens:

```tsx
import { Stack, Text, Button } from '@tamagui/core';

function MyComponent() {
  return (
    <Stack backgroundColor="$bgSecondary" padding="$4">
      <Text color="$primary" fontSize="$6" fontWeight="$7">
        Direct Tamagui Usage
      </Text>
      <Button backgroundColor="$primary" color="$background">
        Primary Button
      </Button>
    </Stack>
  );
}
```

### 2. With useThemeColor Hook

Access theme colors programmatically:

```tsx
import { useThemeColor, useThemeToken } from '@/hooks/use-theme-color';

function MyComponent() {
  // With custom light/dark overrides
  const textColor = useThemeColor({ light: '#333', dark: '#fff' }, 'text');

  // Direct token access
  const primaryColor = useThemeToken('primary');
  const borderColor = useThemeToken('$borderColor');

  return (
    <View style={{ borderColor, borderWidth: 1 }}>
      <Text style={{ color: textColor }}>Themed text</Text>
    </View>
  );
}
```

### 3. With Existing Themed Components

Continue using the existing themed components with improved theme integration:

```tsx
import { ThemedText, ThemedView } from '@/components/base/themed-text';

function MyComponent() {
  return (
    <ThemedView>
      <ThemedText type="title">Title using theme colors</ThemedText>
      <ThemedText type="link">Link with primary color</ThemedText>
      <ThemedText>Regular text</ThemedText>
    </ThemedView>
  );
}
```

## Theme Configuration

### Customizing Colors

Edit `src/tamagui.config.ts` to customize theme colors:

```tsx
const customThemes = {
  ...config.themes,

  light: {
    ...config.themes.light,
    // Override brand colors
    primary: '#your-brand-color',
    primaryLight: '#lighter-variant',
    primaryDark: '#darker-variant',

    // Add custom semantic tokens
    customColor: config.themes.light.purple9,
  },

  dark: {
    // Same structure for dark theme
  },
};
```

### Adding New Semantic Tokens

Update the `semanticTokens` object in `src/hooks/use-theme-color.ts`:

```tsx
export const semanticTokens = {
  // ... existing tokens

  // Add new semantic tokens
  brandSecondary: 'purple9',
  accentColor: 'orange9',
  customBg: 'gray1',
} as const;
```

## Migration Guide

### Using Enhanced Theme System

Components in `@/components/base` now use the enhanced theme system:

```tsx
// Existing components work with improved theme integration
import { ThemedText, ThemedView } from '@/components/base/themed-text';

<ThemedText type="title">Title</ThemedText>
<ThemedText type="link">Link with primary theme color</ThemedText>
```

### Token Migration

```tsx
// Old hardcoded colors
color: '#0a7ea4';
backgroundColor: '#ffffff';

// New semantic tokens
color: '$primary';
backgroundColor: '$background';

// Or with useThemeColor hook
const primaryColor = useThemeToken('primary');
const bgColor = useThemeToken('background');
```

## TypeScript Support

Full TypeScript support with autocomplete:

```tsx
import type { SemanticTokenName, ThemeTokenName } from '@/hooks/use-theme-color';

// Type-safe token usage
const myColor: SemanticTokenName = 'primary';
const themeToken: ThemeTokenName = '$blue9';
```

## Best Practices

1. **Use semantic tokens** over direct color values for consistency
2. **Use direct Tamagui components** for maximum flexibility and performance
3. **Test in both light and dark modes** during development
4. **Use Tamagui's responsive props** for adaptive layouts
5. **Leverage the color scale system** (1-12) for proper contrast

## Examples

### Complete Component Example

```tsx
import { Stack, Text, Button } from '@tamagui/core';
import { useThemeToken } from '@/hooks/use-theme-color';

export function ExampleCard() {
  return (
    <Stack
      backgroundColor="$bgSecondary"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderSubtle"
      padding="$4"
      marginVertical="$3"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
    >
      <Text color="$primary" fontSize="$6" fontWeight="$7" marginBottom="$2">
        Card Title
      </Text>

      <Text color="$textSubtle" fontSize="$4" marginBottom="$4">
        This is a card description using semantic tokens for consistent theming.
      </Text>

      <Stack flexDirection="row" gap="$3">
        <Button flex={1} backgroundColor="$primary" color="$background">
          Primary Action
        </Button>
        <Button
          flex={1}
          backgroundColor="$bgSecondary"
          color="$color"
          borderWidth={1}
          borderColor="$borderColor"
        >
          Secondary Action
        </Button>
      </Stack>
    </Stack>
  );
}
```

This setup provides a robust, type-safe theming system that scales with your application while maintaining the flexibility and power of Tamagui's theming engine.

## Summary

The theme system now provides:

1. **Enhanced Tamagui configuration** with semantic tokens
2. **Improved useThemeColor hook** with better TypeScript support
3. **Backward compatibility** with existing components
4. **Direct Tamagui component usage** for maximum performance
5. **Comprehensive documentation** and examples

Use semantic tokens like `$primary`, `$textSubtle`, `$bgSecondary` for consistent theming, or access them programmatically with the `useThemeColor` hook.
