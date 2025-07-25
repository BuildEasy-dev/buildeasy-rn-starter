/**
 * Build Configuration Constants
 * 
 * This file contains all build-time configuration constants that are used
 * across the project. These values are typically set once and rarely change.
 * 
 * Usage:
 * - Import in app.config.ts for build-time configuration
 * - Injected into app via expo-constants for runtime access
 * 
 * When to update:
 * - When changing app identity (bundle ID, scheme, etc.)
 * - When updating store URLs or social media links
 * - When modifying legal information
 */

const BUILD_CONFIG = {
  // Expo Configuration
  OWNER: 'buildeasy', // Your Expo account username/organization
  PROJECT_ID: '12345678-abcd-1234-abcd-123456789abc', // EAS Project ID (get from: npx eas project)
  
  // App Identity - Used to generate environment-specific bundle IDs
  BUNDLE_ID: 'com.buildeasy.rnstarter',
  SCHEME: 'buildeasyrnstarter',
  SLUG: 'buildeasyrnstarter',
  
  // App Store Links - Update when app is published
  IOS_STORE_URL: 'https://apps.apple.com/app/buildeasy-rn-starter',
  ANDROID_STORE_URL: 'https://play.google.com/store/apps/details?id=com.buildeasy.rnstarter',
  
  // Deep linking configuration
  UNIVERSAL_LINKS: ['buildeasy.dev'],
  
  // Build numbers (auto-incremented by EAS for production builds)
  IOS_BUILD_NUMBER: '1',
  ANDROID_VERSION_CODE: 1,
  
  // Website & Social Media
  WEBSITE_URL: 'https://buildeasy.dev',
  SUPPORT_EMAIL: 'support@buildeasy.dev',
  TWITTER_URL: 'https://twitter.com/buildeasy',
  GITHUB_URL: 'https://github.com/buildeasy-dev',
  
  // Legal
  COPYRIGHT: `© ${new Date().getFullYear()} BuildEasy. All rights reserved.`,
  PRIVACY_URL: 'https://buildeasy.dev/privacy',  
  TERMS_URL: 'https://buildeasy.dev/terms',
};

// Support both CommonJS and ES modules
module.exports = { BUILD_CONFIG };
module.exports.BUILD_CONFIG = BUILD_CONFIG;