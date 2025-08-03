import { StorageManager } from './manager';

// Storage instance - will be initialized asynchronously
let _storage: StorageManager | null = null;

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
export async function initializeStorage(): Promise<StorageManager> {
  const storage = await StorageManager.initialize();
  _storage = storage;
  storage.performStartupCleanup();
  return storage;
}

// Get storage instance (throws if not initialized)
export function getStorage(): StorageManager {
  if (!_storage) {
    throw new Error('Storage not initialized. Call initializeStorage() on app startup.');
  }
  return _storage;
}

// Export a proxy object that provides access to storage
// This maintains backward compatibility while ensuring initialization
export const Storage = new Proxy({} as StorageManager, {
  get(target, prop) {
    const storage = getStorage();
    return storage[prop as keyof StorageManager];
  },
});

// Convenience exports that also check initialization
export const preferences = new Proxy({} as StorageManager['preferences'], {
  get(target, prop) {
    return getStorage().preferences[prop as keyof StorageManager['preferences']];
  },
});

export const cache = new Proxy({} as StorageManager['cache'], {
  get(target, prop) {
    return getStorage().cache[prop as keyof StorageManager['cache']];
  },
});

export const secure = new Proxy({} as StorageManager['secure'], {
  get(target, prop) {
    return getStorage().secure[prop as keyof StorageManager['secure']];
  },
});

export const temp = new Proxy({} as StorageManager['temp'], {
  get(target, prop) {
    return getStorage().temp[prop as keyof StorageManager['temp']];
  },
});
