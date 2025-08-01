import { StorageManager } from './manager';

// Export the singleton instance
export const Storage = StorageManager.getInstance();

// Export types
export type {
  IStorage,
  IStorageWithTTL,
  ISecureStorage,
  IStorageManager,
  StorageEntry,
  StorageOptions,
} from './types';

// Export individual storage classes if needed
export { PreferencesStorage } from './preferences';
export { CacheStorage } from './cache';
export { SecureStorage } from './secure';
export { TempStorage } from './temp';
export { StorageManager } from './manager';

// Initialize storage on app startup
export function initializeStorage(): void {
  Storage.initialize();
}

// Convenience exports for common operations
export const preferences = Storage.preferences;
export const cache = Storage.cache;
export const secure = Storage.secure;
export const temp = Storage.temp;
