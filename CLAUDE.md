# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `pnpm start` - Start Expo development server
- `pnpm android` - Run on Android device/emulator
- `pnpm ios` - Run on iOS simulator
- `pnpm web` - Run in web browser
- `pnpm lint` - Run ESLint to check code quality
- `pnpm typecheck` - Verify TypeScript types
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

- All pages should prioritize using components from `src/components/themed/` directory over React Native native components
- Theme colors configured in `src/tamagui.config.ts` with Tamagui system
- Use `useThemeColor` hook to access theme-aware colors
- Components automatically adapt to system theme changes
- Prefer themed components - They handle theme adaptation automatically
- Test both modes - Ensure UI looks good in light and dark themes

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
- **UI Framework**: Tamagui for styled components and theming
- **Animations**: react-native-reanimated v3
- **Keyboard Management**: react-native-keyboard-controller for advanced keyboard handling
- **Storage**: react-native-mmkv for fast key-value storage
- **Gesture Handling**: react-native-gesture-handler v2

## Project Structure

```
src/              # Source code directory
  app/            # Application screens and navigation
    (tabs)/       # Tab navigation screens
    _layout.tsx   # Root layout with theme provider
  components/     # Reusable components
    themed/       # Themed wrapper components (use these instead of RN components)
    ui/           # UI-specific components
    layout/       # Layout wrappers and templates
  constants/      # App constants
  hooks/          # Custom React hooks
  tamagui.config.ts  # Tamagui theme configuration
assets/           # Images, fonts, and static files (root level)
docs/             # Documentation
  theme-guide.md  # Comprehensive theming guide
  testing-guide.md # Testing patterns and examples
  storage-usage.md # MMKV storage patterns
  layout-guide.md # Layout system documentation
plugins/          # Expo config plugins
```

## TypeScript Configuration

- Path alias: `@/*` maps to `src/*` directory with fallback to project root
- Strict mode is enabled
- All components should have proper TypeScript types

## File Naming Conventions

- Use kebab-case for all file names
- Avoid capital letters in file names
- Examples: `user-profile.tsx`, `theme-provider.ts`, `auth-context.tsx`

## Testing

This project uses **Jest** with **React Native Testing Library** for comprehensive testing.

### Quick Commands

- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode (run in background by default)
- `pnpm test:coverage` - Generate coverage report
- `pnpm test:ci` - Run tests in CI mode
- `pnpm test:update` - Update test snapshots
- `pnpm test [pattern]` - Run tests matching pattern (e.g., `pnpm test button`)

### Framework Overview

- **Jest** with jest-expo preset for React Native compatibility
- **React Native Testing Library** for component and hook testing
- **TypeScript** support with path aliases (@/\* imports)
- **Automatic mocking** of Expo modules and React Native components
- **Coverage reporting** with configurable thresholds (80% default)

### Test Structure

Place tests in `__tests__` directories next to source files:

```
src/
  components/
    __tests__/
      my-component.test.tsx
    my-component.tsx
  hooks/
    __tests__/
      use-my-hook.test.ts
    use-my-hook.ts
```

For detailed testing patterns, best practices, debugging tips, and comprehensive examples, see **[docs/testing-guide.md](docs/testing-guide.md)**.

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

## Development Workflow

### Planning Before Implementation

**Always present your implementation plan before making changes:**

- Outline the steps you'll take to complete the task
- Describe the files and components you'll create or modify
- Explain the reasoning behind your approach
- Wait for user confirmation before proceeding

This ensures alignment with user expectations and prevents unnecessary work.

### Code Quality Checks

**After completing any code changes, always run:**

- `pnpm lint` - Check code quality and style
- `pnpm typecheck` - Verify TypeScript types are correct

These commands must pass before considering the task complete.

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
