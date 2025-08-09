# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

```
Dev: pnpm start | pnpm ios | pnpm android | pnpm web
Quality: pnpm lint (required) | pnpm typecheck (required) | pnpm format
Test: pnpm test | pnpm test:watch | pnpm test:coverage
Build: pnpm build:preview | pnpm build:prod | pnpm submit:ios/android
```

## Commands

### Development

- `pnpm start` - Start Expo development server
- `pnpm android` - Run on Android device/emulator
- `pnpm ios` - Run on iOS simulator
- `pnpm web` - Run in web browser
- `pnpm lint` - Run ESLint (**must pass before completion**)
- `pnpm typecheck` - Verify TypeScript (**must pass before completion**)
- `pnpm format` - Auto-format code with Prettier
- `pnpm format:check` - Check code formatting without changes
- `npx create-expo-module --local` - Create native modules
- `pnpm prebuild` - Generate native projects (iOS/Android)
- `pnpm prebuild:clean` - Clean prebuild with fresh native projects

**Note:** Run development servers in background when needed to maintain productivity during long-running processes.

### Package Management

This project uses **pnpm** as the package manager. For Expo-compatible packages, use:

- `npx expo install [package]` - Install Expo-compatible packages (recommended)
- `pnpm install` - Install all dependencies
- `pnpm add [package]` - Add non-Expo packages
- `pnpm add -D [package]` - Add dev dependency

## Architecture

### File-based Routing (Expo Router)

- Routes are defined by file structure in the `src/app/` directory
- `_layout.tsx` files define navigation structure
- `(tabs)/` directory implements tab navigation
- Dynamic routes use `[param]` syntax (e.g., `[id].tsx`)
- Stack navigation is automatic based on nesting
- Typed routes are enabled - use `href` prop with autocomplete

### Theming System

**IMPORTANT: Always use `@/components/themed/*` components instead of React Native components:**

- `ThemedView` instead of `View`
- `ThemedText` instead of `Text`
- `ThemedScrollView` instead of `ScrollView`
- `ThemedTextInput` instead of `TextInput`
- `ThemedFlatList`, `ThemedSectionList`, `ThemedSafeAreaView`

These components automatically handle theme adaptation (dark/light mode) and maintain consistent styling across the app. Only use React Native components directly when absolutely necessary.

For detailed theming patterns and configuration, see **[docs/theme-guide.md](docs/theme-guide.md)**.

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
- **UI Framework**: Tamagui for theming and styled components
- **Animations**: react-native-reanimated v3
- **Keyboard**: react-native-keyboard-controller for advanced input
- **Storage**: react-native-mmkv for fast key-value storage
- **Gestures**: react-native-gesture-handler v2

## Project Structure

```
src/
  app/              # Screens & navigation (file-based routing)
  components/       # Reusable components (themed/, ui/, layout/)
  hooks/            # Custom React hooks
  constants/        # App constants & config
  tamagui.config.ts # Theme configuration
docs/               # Guides: theme, testing, storage, layout, EAS
```

## Conventions

- **TypeScript**: Strict mode, `@/*` → `src/*` path alias
- **File naming**: kebab-case only (e.g., `user-profile.tsx`, `auth-context.tsx`)
- **Components**: Always use typed props

## Testing

- **Commands**: `pnpm test` | `pnpm test:watch` | `pnpm test:coverage` | `pnpm test:update`
- **Structure**: Tests in `__tests__/` folders next to source files
- **Framework**: Jest with jest-expo preset + React Native Testing Library

For patterns, debugging, and examples, see **[docs/testing-guide.md](docs/testing-guide.md)**.

## Git Standards

### Commit Format

- **Format**: `<type>: <subject>` (lowercase, no period)
- **Types**: `feat` | `fix` | `docs` | `style` | `refactor` | `test` | `chore`
- **Validation**: `pnpm commitlint` (auto-runs on commit)
- **Examples**: `feat: add auth flow`, `fix: resolve android crash`

### Important Rules

- **No AI attribution** - Write human-like commits without Claude/AI mentions
- **No `git add .`** - Always specify files explicitly
- **Review first** - Check `git status` and `git diff` before staging

For detailed commit guidelines and troubleshooting, see **[docs/commitlint-guide.md](docs/commitlint-guide.md)**.

## Build & Deployment

### Quick Commands

- **Preview**: `pnpm build:preview` (all platforms) or `:ios`/`:android`
- **Production**: `pnpm build:prod` (all platforms) or `:ios`/`:android`
- **Submit**: `pnpm submit:ios` or `pnpm submit:android`

### Environments

- `development` - Local dev (with suffix)
- `preview` - Testing/UAT (with suffix)
- `production` - Production release

For complete build scripts see `package.json`. For EAS setup and configuration, see **[docs/eas-integration-design.md](docs/eas-integration-design.md)**.
