# Theme Guide

This guide shows how to use and configure themes in this React Native application.

## Core Files

- `src/tamagui.config.ts` - Theme configuration
- `src/hooks/use-theme-color.ts` - Theme color hook
- `src/components/themed/` - Themed components

## Quick Start

### Using Themed Components

Use pre-built themed components for automatic light/dark adaptation:

```tsx
import { ThemedView, ThemedText } from '@/components/themed';

function MyScreen() {
  return (
    <ThemedView>
      <ThemedText type="title">Title</ThemedText>
      <ThemedText>Regular text</ThemedText>
      <ThemedText type="link">Link text (uses theme color)</ThemedText>
    </ThemedView>
  );
}
```

## Configuring Theme Colors

Edit `src/tamagui.config.ts` to modify or add theme colors:

```tsx
export const config = createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    light: {
      ...defaultConfig.themes.light,
      primary: '#007AFF', // Brand primary
      secondary: '#34C759', // Secondary color
      danger: '#FF3B30', // Danger color
    },
    dark: {
      ...defaultConfig.themes.dark,
      primary: '#0A84FF',
      secondary: '#30D158',
      danger: '#FF453A',
    },
  },
});
```

Then use in components:

```tsx
const primaryColor = useThemeColor('primary');
const secondaryColor = useThemeColor('secondary');
const dangerColor = useThemeColor('danger');
```

## Using Theme Colors

### Method 1: Themed Components (Recommended)

```tsx
import { ThemedView, ThemedText } from '@/components/themed';

function MyComponent() {
  return (
    <ThemedView>
      <ThemedText type="title">Title</ThemedText>
      <ThemedText type="subtitle">Subtitle</ThemedText>
      <ThemedText type="link">Link (theme color)</ThemedText>
      <ThemedText>Regular text</ThemedText>
    </ThemedView>
  );
}
```

**Available themed components:**

- `ThemedView` - Background adapts to theme
- `ThemedText` - Text color adapts to theme
- `ThemedTextInput` - Input colors adapt to theme
- `ThemedScrollView` - Scroll view
- `ThemedFlatList` - List component
- `ThemedSafeAreaView` - Safe area view

### Method 2: useThemeColor Hook

For custom components needing theme colors:

```tsx
import { useThemeColor } from '@/hooks/use-theme-color';
import { View, Text } from 'react-native';

function MyCustomComponent() {
  const primaryColor = useThemeColor('tint');
  const textColor = useThemeColor('text');
  const backgroundColor = useThemeColor('background');

  return (
    <View style={{ backgroundColor, padding: 20 }}>
      <Text style={{ color: primaryColor, fontSize: 18 }}>Themed text</Text>
      <Text style={{ color: textColor }}>Regular text</Text>
    </View>
  );
}
```

### Method 3: Custom Light/Dark Colors

For different colors in light/dark modes:

```tsx
function MyComponent() {
  const customColor = useThemeColor('text', { light: '#333333', dark: '#FFFFFF' });

  return <Text style={{ color: customColor }}>Custom themed text</Text>;
}
```

## Common Theme Color Names

### Semantic Aliases (Recommended)

| Name          | Maps to            | Purpose                  |
| ------------- | ------------------ | ------------------------ |
| `tint`        | `primary`          | Brand color for emphasis |
| `text`        | `color`            | Default text color       |
| `icon`        | `color`            | Icon color               |
| `placeholder` | `placeholderColor` | Input placeholders       |

### Tamagui Built-in Colors

| Name                           | Purpose              | Example           |
| ------------------------------ | -------------------- | ----------------- |
| `color`                        | Primary text         | Titles, body text |
| `background`                   | Default background   | Page backgrounds  |
| `borderColor`                  | Default borders      | Dividers, borders |
| `placeholderColor`             | Placeholder text     | Input hints       |
| `color1` ~ `color12`           | Text gradients       | Light to dark     |
| `background0` ~ `background08` | Background gradients | Layer backgrounds |

### Color Palettes (1-12 levels each)

| Palette                | Use Case                     |
| ---------------------- | ---------------------------- |
| `blue1` ~ `blue12`     | Blue tones, info alerts      |
| `gray1` ~ `gray12`     | Gray tones, neutral colors   |
| `green1` ~ `green12`   | Green tones, success states  |
| `red1` ~ `red12`       | Red tones, errors/warnings   |
| `orange1` ~ `orange12` | Orange tones, warnings       |
| `purple1` ~ `purple12` | Purple tones, emphasis       |
| `pink1` ~ `pink12`     | Pink tones, special emphasis |
| `yellow1` ~ `yellow12` | Yellow tones, highlights     |

## Testing Themes

Test light/dark themes by:

1. **Device/Simulator**: Toggle system theme in settings
2. **Dev Tools**: Use React Native dev tools to switch themes

## Best Practices

1. **Prefer themed components** - They handle theme adaptation automatically
2. **Use semantic names** - Use `tint`, `text` instead of specific color values
3. **Test both modes** - Ensure UI looks good in light and dark themes
4. **Use theme colors sparingly** - For emphasis, not everything
5. **Maintain contrast** - Ensure sufficient text/background contrast
