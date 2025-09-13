import { ExpoConfig, ConfigContext } from 'expo/config';
import packageJson from './package.json';

// Build configuration constants
const BUILD_CONFIG = {
  // Expo Configuration
  OWNER: 'buildeasy',
  PROJECT_ID: '12345678-abcd-1234-abcd-123456789abc',
  SLUG: 'buildeasyrnstarter',

  // App Identity - Base values for environment-specific generation
  BUNDLE_ID_BASE: 'dev.buildeasy.rnstarter',
  SCHEME_BASE: 'buildeasyrnstarter',

  // Universal Links configuration
  // Add your domains here to enable HTTPS deep linking (e.g., ['example.com', 'www.example.com'])
  // Leave empty to use only custom scheme deep linking
  UNIVERSAL_LINKS: [] as string[],

  // Build numbers (auto-incremented by EAS for production)
  IOS_BUILD_NUMBER: '1',
  ANDROID_VERSION_CODE: 1,
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const IS_DEV = process.env.EXPO_PUBLIC_ENV === 'development';
  const IS_PREVIEW = process.env.EXPO_PUBLIC_ENV === 'preview';

  const withEnvSuffix = (value: string): string => {
    if (IS_DEV) return `${value}.dev`;
    if (IS_PREVIEW) return `${value}.preview`;
    return value;
  };

  const getUniqueIdentifier = (): string => {
    return withEnvSuffix(BUILD_CONFIG.BUNDLE_ID_BASE);
  };

  const getAppName = (): string => {
    const baseName = packageJson.name;
    if (IS_DEV) return `${baseName} (Dev)`;
    if (IS_PREVIEW) return `${baseName} (Preview)`;
    return baseName;
  };

  const getScheme = (): string => {
    return withEnvSuffix(BUILD_CONFIG.SCHEME_BASE);
  };

  return {
    ...config,
    name: getAppName(),
    slug: BUILD_CONFIG.SLUG,
    version: packageJson.version,
    owner: BUILD_CONFIG.OWNER,
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: getScheme(),
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: getUniqueIdentifier(),
      ...(BUILD_CONFIG.UNIVERSAL_LINKS.length > 0 && {
        associatedDomains: BUILD_CONFIG.UNIVERSAL_LINKS.map((domain) => `applinks:${domain}`),
      }),
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: getUniqueIdentifier(),
      ...(BUILD_CONFIG.UNIVERSAL_LINKS.length > 0 && {
        intentFilters: BUILD_CONFIG.UNIVERSAL_LINKS.map((domain) => ({
          action: 'VIEW',
          autoVerify: true,
          data: { scheme: 'https', host: domain },
          category: ['BROWSABLE', 'DEFAULT'],
        })),
      }),
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-secure-store',
      'expo-web-browser',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      './plugins/mmkv-backup.js',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      // EAS Configuration
      eas: {
        projectId: BUILD_CONFIG.PROJECT_ID,
      },

      // Environment
      env: process.env.EXPO_PUBLIC_ENV || 'development',

      // API & Features
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
      enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
      enableLogging: process.env.EXPO_PUBLIC_ENABLE_LOGGING === 'true',

      // Build config
      bundleId: getUniqueIdentifier(),
      scheme: getScheme(),
      universalLinks: BUILD_CONFIG.UNIVERSAL_LINKS,

      // Build time
      buildTime: new Date().toISOString(),
    },
  };
};
