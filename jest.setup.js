// React Native Testing Library setup
// Note: The newer version has built-in matchers, no need to import extend-expect

// Global setup
global.__DEV__ = true;

// Mock metro
global.process.env.NODE_ENV = 'test';

// Mock expo modules
jest.mock('expo', () => ({
  ...jest.requireActual('expo'),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  default: {
    manifest: {
      extra: {},
    },
  },
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    MaterialIcons: ({ name, ...props }) =>
      React.createElement('Text', props, `MaterialIcon: ${name}`),
    Ionicons: ({ name, ...props }) => React.createElement('Text', props, `Ionicon: ${name}`),
  };
});

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'Light',
    Medium: 'Medium',
    Heavy: 'Heavy',
  },
}));

// Mock expo-linking
jest.mock('expo-linking', () => ({
  openURL: jest.fn(),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openSettings: jest.fn(),
}));

// Mock expo-web-browser
jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(() => Promise.resolve({ type: 'opened' })),
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  WHEN_UNLOCKED: 'WHEN_UNLOCKED',
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
  WHEN_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'WHEN_FIRST_UNLOCK_THIS_DEVICE_ONLY',
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 'WHEN_PASSCODE_SET_THIS_DEVICE_ONLY',
  ALWAYS: 'ALWAYS',
  ALWAYS_THIS_DEVICE_ONLY: 'ALWAYS_THIS_DEVICE_ONLY',
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported
// Note: This mock is handled by jest-expo preset
