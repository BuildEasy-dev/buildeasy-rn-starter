# Drawer Header Components - Usage Examples

This document demonstrates the clean, minimalist drawer header system that separates layout infrastructure from business content.

## Architecture Overview

### 1. Pure Layout Component

- `DrawerHeader` - Minimal container (80px height, optimized spacing)
- Provides background styling and layout structure only
- No business logic or user interactions
- Content composition via `children` prop

### 2. Business Display Components

- `AppBrandDrawerHeader` - Clean text-only app branding (included)
- Custom components - Create your own for specific business needs
- All business components are pure display (no interactions)

## Usage Patterns

### Pattern 1: App Branding Header

```tsx
import { AppBrandDrawerHeader } from './app-brand-drawer-header';

// Basic text-only branding
<DrawerContent
  headerContent={
    <AppBrandDrawerHeader
      appName="BuildEasy"
      tagline="React Native Starter"
    />
  }
/>

// App name only (minimal)
<DrawerContent
  headerContent={
    <AppBrandDrawerHeader appName="My App" />
  }
/>

// With custom header background
<DrawerContent
  headerProps={{ backgroundColor: '#1e40af' }}
  headerContent={
    <AppBrandDrawerHeader
      appName="BuildEasy"
      tagline="Professional Edition"
    />
  }
/>
```

### Pattern 2: Custom Business Component

```tsx
import { View } from 'react-native';
import { ThemedText } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';

// Create your own pure display component
function CompanyDrawerHeader({ companyName, department, role }) {
  const textColor = useThemeColor('text');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          color: textColor,
          marginBottom: 2,
        }}
      >
        {companyName}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: 14,
          opacity: 0.7,
          textAlign: 'center',
          color: textColor,
        }}
      >
        {department} - {role}
      </ThemedText>
    </View>
  );
}

// Use with DrawerHeader container
<DrawerContent
  headerProps={{ backgroundColor: '#7c3aed' }}
  headerContent={
    <CompanyDrawerHeader companyName="Acme Corp" department="Engineering" role="Senior Developer" />
  }
/>;
```

### Pattern 3: Minimal Custom Content

```tsx
import { View } from 'react-native';
import { ThemedText } from '@/components/themed';

// Simple text-only header
<DrawerContent
  headerContent={
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>
        Dashboard
      </ThemedText>
    </View>
  }
/>

// With background image and custom text color
<DrawerContent
  headerProps={{
    backgroundImage: require('@/assets/images/header-bg.jpg'),
  }}
  headerContent={
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
      }}>
        Welcome Back
      </ThemedText>
    </View>
  }
/>
```

## Migration from Legacy API

### Before (Legacy - Mixed Concerns)

```tsx
// Old approach - business logic mixed with layout
<DrawerContent
  headerProps={{
    avatar: { uri: 'avatar.jpg' },
    title: 'John Doe',
    subtitle: 'john@example.com',
    onPress: () => navigate('Profile'), // Business logic in base component
    backgroundColor: '#1e40af',
  }}
/>
```

### After (Current - Clean Separation)

```tsx
// New approach - pure separation of concerns
<DrawerContent
  headerProps={{
    backgroundColor: '#1e40af', // Layout concerns only
  }}
  headerContent={
    <AppBrandDrawerHeader // Business display component
      appName="My App"
      tagline="Version 1.0"
    /> // No interactions (pure display)
  }
/>
```

## Component Customization

### Extending Business Components

```tsx
// Extend existing business component
function CustomAppBrand({ showVersion, ...props }) {
  return (
    <ThemedView style={{ flex: 1 }}>
      <AppBrandDrawerHeader {...props} />
      {showVersion && (
        <ThemedView style={{ marginTop: 8, alignItems: 'center' }}>
          <ThemedText style={{ fontSize: 10, opacity: 0.5 }}>Built with React Native</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}
```

### Custom Layouts

```tsx
// Horizontal layout variant
function HorizontalAppBrand({ logo, appName, onPress }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      {logo && <Image source={logo} style={{ width: 32, height: 32, marginRight: 12 }} />}
      <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>{appName}</ThemedText>
    </Pressable>
  );
}
```

## Best Practices

### 1. Pure Separation of Concerns

- Use `DrawerHeader` only for layout (background, spacing, sizing)
- Create business components for content display only
- No user interactions in business components (pure display)
- Keep all styling logic separate from layout logic

### 2. Minimalist Design Philosophy

- Prefer text-only designs over complex graphics
- Use native `View` components to inherit theme colors
- Optimize for compact space usage (80px height default)
- Focus on typography and spacing over decorations

### 3. Naming Convention

- Layout: `DrawerHeader` (pure container)
- Business: `[Purpose]DrawerHeader` (e.g., `AppBrandDrawerHeader`)
- Custom: `[Context]Header` (e.g., `CompanyHeader`, `WelcomeHeader`)

### 4. Component Design Rules

```tsx
// ✅ Good: Pure display component
interface AppBrandDrawerHeaderProps {
  appName?: string;
  tagline?: string;
  // No onPress, no interactions
}

// ❌ Avoid: Mixing display with interactions
interface BadHeaderProps {
  title: string;
  onPress: () => void; // Don't mix concerns
  backgroundColor: string; // Layout concern
}
```

### 5. Theme Integration

- Always use `useThemeColor` for text colors
- Let container backgrounds handle theme adaptation
- Use native `View` instead of `ThemedView` for transparent containers
- Maintain consistency with app-wide theme system

This minimalist approach ensures maximum flexibility, better performance, and easier maintenance while keeping the codebase clean and focused.
