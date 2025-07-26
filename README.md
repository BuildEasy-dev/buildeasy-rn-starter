# BuildEasy React Native Starter

An AI-friendly React Native starter template built on Expo and Tamagui, designed for optimal human-AI collaboration.

## Features

- 🔐 **Full Authentication Flow** - Complete auth implementation ready to use
- 🎨 **Theming** - Built-in light/dark mode support with Tamagui
- 🌍 **i18n Support** - Internationalization ready
- 🔄 **State Management** - TanStack Query for server state & Zustand for client state
- 📝 **Forms & Validation** - React Hook Form with Zod schema validation
- 📚 **Component Documentation** - Storybook integration
- ✨ **Animations** - React Native Reanimated configured
- 🤖 **AI-Optimized Architecture** - Clean, understandable code structure for AI assistants

## Why This Starter?

The core goal is a clean architecture that AI assistants like Cursor and Claude Code can easily understand, making for better human-AI collaboration. Every architectural decision prioritizes clarity and maintainability.

## Tech Stack

- **Framework**: [Expo](https://expo.dev) (SDK 53)
- **UI Library**: [Tamagui](https://tamagui.dev)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Gestures**: [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- **Bottom Sheet**: [React Native Bottom Sheet](https://gorhom.github.io/react-native-bottom-sheet/)
- **Documentation**: [Storybook](https://storybook.js.org/)
- **Build & Deploy**: [Expo EAS](https://docs.expo.dev/eas/)
- **TypeScript**: Strict mode enabled

## Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the development server**

   ```bash
   pnpm start
   ```

3. **Run on your platform**

   In the output, you'll find options to open the app in a:

   - [Development build](https://docs.expo.dev/develop/development-builds/introduction/) - Full featured development app
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/) - Run on Android Virtual Device
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/) - Run on iOS Simulator (macOS only)
   - [Expo Go](https://expo.dev/go) - Limited sandbox for quick testing

   Or use these commands:

   ```bash
   pnpm ios      # iOS simulator
   pnpm android  # Android emulator
   pnpm web      # Web browser
   ```

4. **Configure EAS (Optional - for building and deployment)**
   
   Install EAS CLI:
   ```bash
   npm install -g @expo/eas-cli
   ```
   
   Login and configure:
   ```bash
   eas login
   eas build:configure
   ```
   
   Set up environment variables in `.env` file based on `.env.example`

## Build & Deploy

This project is configured with Expo Application Services (EAS) for building and deploying your app.

### Environment Setup
Copy `.env.example` to `.env` and configure your environment variables:
- Bundle identifiers for iOS/Android
- API URLs for different environments
- App metadata and configuration

### Building Your App
- **Preview builds**: For internal testing and UAT
- **Production builds**: For app store submission
- **Local builds**: Build on your machine (requires Xcode/Android Studio)

See the configuration guide at `docs/configuration-guide.md` for detailed setup instructions.

## Project Structure

```
src/              # Source code directory
  app/            # Application screens (file-based routing)
    (tabs)/       # Tab navigation screens
    _layout.tsx   # Root layout with providers
  components/     # Reusable components
    ui/          # UI components (Tamagui-based)
  constants/      # App constants
  hooks/         # Custom React hooks
  lib/           # Utilities and configurations
    api/         # API client setup
    auth/        # Authentication logic
    i18n/        # Internationalization
assets/          # Images, fonts, and static files (root level)
```

This project uses [file-based routing](https://docs.expo.dev/router/introduction) - start developing by editing files inside the **src/app** directory.

## AI Development Guidelines

This project includes a `CLAUDE.md` file with specific instructions for AI assistants. Key principles:

- Clear component patterns with TypeScript
- Consistent file naming and structure
- Comprehensive documentation in code
- Predictable state management patterns
- Themed components with light/dark support

## Available Scripts

### Development Scripts
- `pnpm start` - Start Expo development server
- `pnpm android` - Run on Android
- `pnpm ios` - Run on iOS
- `pnpm web` - Run on web
- `pnpm lint` - Run ESLint
- `pnpm storybook` - Launch Storybook
- `pnpm reset-project` - Reset to blank template (moves starter code to app-example/)

### Build & Deploy Scripts
- `pnpm build:preview` - Build for preview/testing (iOS + Android)
- `pnpm build:preview:ios` - Build for preview (iOS only)
- `pnpm build:preview:android` - Build for preview (Android only)
- `pnpm build:prod` - Build for production (iOS + Android)
- `pnpm build:prod:ios` - Build for production (iOS only)
- `pnpm build:prod:android` - Build for production (Android only)
- `pnpm build:local:preview` - Local build for preview
- `pnpm build:local:preview:ios` - Local build for preview (iOS only)
- `pnpm build:local:preview:android` - Local build for preview (Android only)
- `pnpm build:local:prod` - Local build for production
- `pnpm build:local:prod:ios` - Local build for production (iOS only)
- `pnpm build:local:prod:android` - Local build for production (Android only)
- `pnpm submit:ios` - Submit to App Store
- `pnpm submit:android` - Submit to Google Play

## Learn More

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web
- [Tamagui documentation](https://tamagui.dev/docs/intro/introduction): Learn about the universal UI system
- [EAS Build documentation](https://docs.expo.dev/build/introduction/): Learn about building and deploying with EAS
- [EAS Submit documentation](https://docs.expo.dev/submit/introduction/): Learn about submitting to app stores

## Contributing

This starter template is designed to evolve with community feedback. Contributions that improve AI-friendliness and developer experience are especially welcome.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Note: The MIT license applies to the template itself. Code you generate using this template belongs to you.

---

Built with ❤️ for the AI-assisted development era.