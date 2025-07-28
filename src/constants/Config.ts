import Constants from 'expo-constants';

/**
 * Runtime configuration from EAS build environment and app.config.ts
 *
 * These values are injected during build time via:
 * - Environment variables (EXPO_PUBLIC_*)
 * - app.config.ts extra field
 * - expo-constants manifest
 */

interface ExtraConfig {
  // Environment
  env: 'development' | 'preview' | 'production';

  // API & Features
  apiUrl: string;
  enableAnalytics: boolean;
  enableLogging: boolean;

  // Build config
  bundleId: string;
  scheme: string;
  universalLinks: string[];

  // Build time
  buildTime?: string;
}

// Access runtime configuration from expo-constants
const extra = Constants.expoConfig?.extra as ExtraConfig | undefined;

export const Config = {
  // Environment
  ENV: extra?.env || 'development',
  IS_DEV: extra?.env === 'development',
  IS_PREVIEW: extra?.env === 'preview',
  IS_PROD: extra?.env === 'production',

  // API Configuration
  API_URL: extra?.apiUrl || 'http://localhost:3000',

  // Feature Flags
  ENABLE_ANALYTICS: extra?.enableAnalytics || false,
  ENABLE_LOGGING: extra?.enableLogging || false,

  // App Info from Constants
  APP_VERSION: Constants.expoConfig?.version || '1.0.0',
  BUILD_VERSION: Constants.nativeBuildVersion || '1',

  // Build Configuration
  BUNDLE_ID: extra?.bundleId || 'com.buildeasy.rnstarter',
  SCHEME: extra?.scheme || 'buildeasyrnstarter',
  IOS_STORE_URL: 'https://apps.apple.com/app/buildeasy-rn-starter',
  ANDROID_STORE_URL: 'https://play.google.com/store/apps/details?id=com.buildeasy.rnstarter',
  UNIVERSAL_LINKS: extra?.universalLinks || [],

  // Website & Social Media
  WEBSITE_URL: 'https://buildeasy.dev',
  SUPPORT_EMAIL: 'support@buildeasy.dev',
  TWITTER_URL: 'https://twitter.com/buildeasy',
  GITHUB_URL: 'https://github.com/buildeasy-dev/buildeasy-rn-starter',

  // Legal
  COPYRIGHT: `© ${new Date().getFullYear()} BuildEasy. All rights reserved.`,
  PRIVACY_URL: 'https://buildeasy.dev/privacy',
  TERMS_URL: 'https://buildeasy.dev/terms',

  // Platform Info
  PLATFORM: Constants.platform,
  IS_IOS: Constants.platform?.ios !== undefined,
  IS_ANDROID: Constants.platform?.android !== undefined,
  IS_WEB: Constants.platform?.web !== undefined,

  // Build Info
  BUILD_TIME: extra?.buildTime || new Date().toISOString(),
} as const;

// Type-safe config access
export type ConfigType = typeof Config;
