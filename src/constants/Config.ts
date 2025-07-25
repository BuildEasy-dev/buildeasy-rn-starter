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
  iosStoreUrl: string;
  androidStoreUrl: string;
  universalLinks: string[];
  
  // Website & Social Media
  websiteUrl: string;
  supportEmail: string;
  twitterUrl: string;
  githubUrl: string;
  
  // Legal
  copyright: string;
  privacyUrl: string;
  termsUrl: string;
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
  IOS_STORE_URL: extra?.iosStoreUrl || '',
  ANDROID_STORE_URL: extra?.androidStoreUrl || '',
  UNIVERSAL_LINKS: extra?.universalLinks || [],
  
  // Website & Social Media
  WEBSITE_URL: extra?.websiteUrl || 'https://buildeasy.dev',
  SUPPORT_EMAIL: extra?.supportEmail || 'support@buildeasy.dev',
  TWITTER_URL: extra?.twitterUrl || '',
  GITHUB_URL: extra?.githubUrl || '',
  
  // Legal
  COPYRIGHT: extra?.copyright || `© ${new Date().getFullYear()} BuildEasy. All rights reserved.`,
  PRIVACY_URL: extra?.privacyUrl || '',
  TERMS_URL: extra?.termsUrl || '',
  
  // Platform Info
  PLATFORM: Constants.platform,
  IS_IOS: Constants.platform?.ios !== undefined,
  IS_ANDROID: Constants.platform?.android !== undefined,
  IS_WEB: Constants.platform?.web !== undefined,
} as const;

// Type-safe config access
export type ConfigType = typeof Config;