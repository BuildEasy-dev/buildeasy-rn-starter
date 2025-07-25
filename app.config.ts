import { ExpoConfig, ConfigContext } from "expo/config";
import packageJson from "./package.json";
import { BUILD_CONFIG } from "./build.config.js";

export default ({ config }: ConfigContext): ExpoConfig => {
  const IS_DEV = process.env.EXPO_PUBLIC_ENV === "development";
  const IS_PREVIEW = process.env.EXPO_PUBLIC_ENV === "preview";

  const withEnvSuffix = (value: string): string => {
    if (IS_DEV) return `${value}.dev`;
    if (IS_PREVIEW) return `${value}.preview`;
    return value;
  };

  const getUniqueIdentifier = (): string => {
    return withEnvSuffix(BUILD_CONFIG.BUNDLE_ID);
  };

  const getAppName = (): string => {
    const baseName = packageJson.name;
    if (IS_DEV) return `${baseName} (Dev)`;
    if (IS_PREVIEW) return `${baseName} (Preview)`;
    return baseName;
  };

  const getScheme = (): string => {
    return withEnvSuffix(BUILD_CONFIG.SCHEME);
  };

  return {
    ...config,
    name: getAppName(),
    slug: BUILD_CONFIG.SLUG,
    version: packageJson.version,
    owner: BUILD_CONFIG.OWNER,
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: getScheme(),
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: getUniqueIdentifier(),
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: getUniqueIdentifier(),
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
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
      env: process.env.EXPO_PUBLIC_ENV || "development",

      // API & Features
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
      enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === "true",
      enableLogging: process.env.EXPO_PUBLIC_ENABLE_LOGGING === "true",

      // Build config
      bundleId: getUniqueIdentifier(),
      scheme: getScheme(),
      iosStoreUrl: BUILD_CONFIG.IOS_STORE_URL,
      androidStoreUrl: BUILD_CONFIG.ANDROID_STORE_URL,
      universalLinks: BUILD_CONFIG.UNIVERSAL_LINKS,

      // Website & Social Media
      websiteUrl: BUILD_CONFIG.WEBSITE_URL,
      supportEmail: BUILD_CONFIG.SUPPORT_EMAIL,
      twitterUrl: BUILD_CONFIG.TWITTER_URL,
      githubUrl: BUILD_CONFIG.GITHUB_URL,

      // Legal
      copyright: BUILD_CONFIG.COPYRIGHT,
      privacyUrl: BUILD_CONFIG.PRIVACY_URL,
      termsUrl: BUILD_CONFIG.TERMS_URL,
    },
  };
};
