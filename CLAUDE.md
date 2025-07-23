# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm start` - Start Expo development server
- `pnpm android` - Run on Android device/emulator
- `pnpm ios` - Run on iOS simulator
- `pnpm web` - Run in web browser
- `pnpm lint` - Run ESLint to check code quality
- `pnpm reset-project` - Reset to blank Expo template (destructive)

### Package Management
This project uses **pnpm** as the package manager. For Expo-compatible packages, use:
- `npx expo install [package]` - Install Expo-compatible packages (recommended)
- `pnpm install` - Install all dependencies
- `pnpm add [package]` - Add non-Expo packages
- `pnpm add -D [package]` - Add dev dependency

## Architecture

### File-based Routing (Expo Router)
- Routes are defined by file structure in the `app/` directory
- `_layout.tsx` files define navigation structure
- `(tabs)/` directory implements tab navigation
- Dynamic routes use `[param]` syntax
- Stack navigation is automatic based on nesting

### Theming System
- All UI components should use themed wrappers (`ThemedView`, `ThemedText`)
- Colors are defined in `constants/Colors.ts` with light/dark variants
- Use `useThemeColor` hook to access theme-aware colors
- Components automatically adapt to system theme changes

### Component Patterns
```typescript
// Example themed component structure
import { useThemeColor } from '@/hooks/useThemeColor';

export function MyComponent({ lightColor, darkColor, ...props }) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  // component implementation
}
```

### Platform-specific Code
- Use `.ios.tsx` or `.android.tsx` file extensions for platform-specific components
- Access platform via `Platform.OS` when needed
- IconSymbol component handles iOS SF Symbols vs Material Icons automatically

## Key Technologies
- **React Native**: 0.79.5 with New Architecture enabled
- **React**: 19.0.0
- **Expo SDK**: 53.0.20
- **TypeScript**: Strict mode enabled
- **Navigation**: Expo Router v5 (file-based)
- **Animations**: react-native-reanimated v3

## Project Structure
```
app/              # Application screens and navigation
  (tabs)/         # Tab navigation screens
  _layout.tsx     # Root layout with theme provider
components/       # Reusable components
  ui/            # UI-specific components
constants/       # App constants (Colors, etc.)
hooks/          # Custom React hooks
assets/         # Images, fonts, and static files
```

## TypeScript Configuration
- Path alias: `@/*` maps to project root
- Strict mode is enabled
- All components should have proper TypeScript types

## Testing
No test framework is currently configured. When adding tests, consider:
- Jest for unit testing
- React Native Testing Library for component testing
- Detox or Maestro for E2E testing

## Git Commit Standards

### Important: Human-like Commits Only
**NEVER include Claude Code collaboration information in any Git operations:**
- NO "Generated with Claude Code" messages
- NO "Co-Authored-By: Claude" signatures
- NO AI/bot attribution in commits, PRs, tags, or releases
- Write commits as if they were human-written

### Commit Message Format
Keep messages concise while preserving key information:
```
<type>: <subject>

[optional body for complex changes]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code restructuring without feature changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
- `feat: add user authentication flow`
- `fix: resolve navigation crash on Android`
- `refactor: simplify theme provider implementation`
- `chore: update expo to v53`