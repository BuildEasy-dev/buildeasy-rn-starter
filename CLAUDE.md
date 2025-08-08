# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `pnpm start` - Start Expo development server
- `pnpm android` - Run on Android device/emulator
- `pnpm ios` - Run on iOS simulator
- `pnpm web` - Run in web browser
- `pnpm lint` - Run ESLint to check code quality
- `npx create-expo-module --local` - Create native modules

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
- Dynamic routes use `[param]` syntax
- Stack navigation is automatic based on nesting

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

## Project Structure

```
src/              # Source code directory
  app/            # Application screens and navigation
    (tabs)/       # Tab navigation screens
    _layout.tsx   # Root layout with theme provider
  components/     # Reusable components
    themed/       # Themed wrapper components (use these instead of RN components)
    ui/           # UI-specific components
  constants/      # App constants
  hooks/          # Custom React hooks
  tamagui.config.ts  # Tamagui theme configuration
assets/           # Images, fonts, and static files (root level)
docs/             # Documentation
  theme-guide.md  # Comprehensive theming guide
  testing-guide.md # Testing patterns and examples
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
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate coverage report
- `pnpm test:ci` - Run tests in CI mode

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

### Commit Message Validation

This project uses commitlint to automatically validate commit messages:

- **Automatic validation**: Git hooks check every commit message
- **Manual validation**: Run `pnpm commitlint` to check the last commit
- **Check multiple commits**: Run `pnpm commitlint:last` to check the last 10 commits

If a commit is rejected:

1. The message must follow the format: `<type>: <subject>`
2. Type must be one of the allowed types above
3. Subject cannot be empty and must start with lowercase
4. Fix the message and try again

### Git Add Guidelines

**NEVER use `git add .` to add all files:**

- Always specify individual files: `git add src/component.tsx`
- Add multiple specific files: `git add file1.tsx file2.ts`
- Review changes before staging: `git status` and `git diff`

This ensures intentional commits and prevents accidentally staging unrelated files.

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
