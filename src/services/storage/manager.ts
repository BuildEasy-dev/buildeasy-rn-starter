import type { IStorageManager } from './types';
import { InitializationError, EncryptionError } from './errors';
import { PreferencesStorage } from './preferences';
import { CacheStorage } from './cache';
import { SecureStorage } from './secure';
import { TempStorage } from './temp';

export class StorageManager implements IStorageManager {
  private static instance: StorageManager | null = null;
  private static initializationPromise: Promise<StorageManager> | null = null;

  public readonly preferences: PreferencesStorage;
  public readonly cache: CacheStorage;
  public readonly secure: SecureStorage;
  public readonly temp: TempStorage;

  private constructor(secureStorage: SecureStorage) {
    this.preferences = PreferencesStorage.getInstance();
    this.cache = CacheStorage.getInstance();
    this.secure = secureStorage;
    this.temp = TempStorage.getInstance();
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      throw new Error('StorageManager not initialized. Call StorageManager.initialize() first.');
    }
    return StorageManager.instance;
  }

  static async initialize(): Promise<StorageManager> {
    if (!StorageManager.instance) {
      if (!StorageManager.initializationPromise) {
        StorageManager.initializationPromise = StorageManager.createInstance();
      }
      StorageManager.instance = await StorageManager.initializationPromise;
    }
    return StorageManager.instance;
  }

  private static async createInstance(): Promise<StorageManager> {
    let secureStorage: SecureStorage;

    try {
      secureStorage = await SecureStorage.getInstance();
    } catch (error) {
      if (error instanceof EncryptionError) {
        throw new InitializationError(
          'Failed to initialize SecureStorage due to encryption key management failure.',
          {
            tier: 'manager',
            cause: error,
          }
        );
      }
      // Re-throw any other errors as initialization errors
      throw new InitializationError('Failed to initialize SecureStorage due to unknown error.', {
        tier: 'manager',
        cause: error as Error,
      });
    }

    return new StorageManager(secureStorage);
  }

  /**
   * Perform storage cleanup on app startup
   * - Clears temporary storage
   * - Removes expired cache entries
   */
  performStartupCleanup(): void {
    console.log('Initializing storage...');

    // Clear all temporary storage
    this.temp.initialize();

    // Clear expired cache entries
    this.cache.clearExpired();

    // Check cache size and evict if necessary
    this.cache.evictOldest();

    console.log('Storage cleanup completed successfully');
  }

  /**
   * Clear all storage (factory reset)
   */
  clearAll(): void {
    this.preferences.clear();
    this.cache.clear();
    this.secure.clear();
    this.temp.clear();
  }

  /**
   * Clear user data (logout)
   * Keeps preferences but clears secure and user-specific cache
   */
  clearUserData(): void {
    this.secure.clear();

    // Clear user-specific cache entries
    const cacheKeys = this.cache.getAllKeys();
    cacheKeys.forEach((key) => {
      if (key.startsWith('user_') || key.startsWith('auth_')) {
        this.cache.delete(key);
      }
    });

    // Clear temp storage
    this.temp.clear();
  }

  /**
   * Get storage sizes for monitoring
   */
  getStorageSizes(): Record<string, number> {
    return {
      preferences: this.preferences.getSize(),
      cache: this.cache.getSize(),
      secure: this.secure.getSize(),
      temp: this.temp.getSize(),
      total: this.getTotalSize(),
    };
  }

  /**
   * Get total storage size
   */
  getTotalSize(): number {
    return (
      this.preferences.getSize() +
      this.cache.getSize() +
      this.secure.getSize() +
      this.temp.getSize()
    );
  }

  /**
   * Check if storage is approaching limits
   */
  isStorageFull(threshold: number = 50 * 1024 * 1024): boolean {
    // 50MB default
    return this.getTotalSize() > threshold;
  }

  /**
   * Perform storage maintenance
   * - Clear expired cache
   * - Evict old cache entries if needed
   * - Log storage sizes
   */
  performMaintenance(): void {
    console.log('Performing storage maintenance...');

    // Clear expired cache
    this.cache.clearExpired();

    // Check and evict if necessary
    if (this.isStorageFull()) {
      console.warn('Storage approaching limit, evicting old cache entries');
      this.cache.evictOldest();
    }

    // Log current sizes
    const sizes = this.getStorageSizes();
    console.log('Storage sizes:', {
      preferences: `${(sizes.preferences / 1024).toFixed(2)} KB`,
      cache: `${(sizes.cache / 1024).toFixed(2)} KB`,
      secure: `${(sizes.secure / 1024).toFixed(2)} KB`,
      temp: `${(sizes.temp / 1024).toFixed(2)} KB`,
      total: `${(sizes.total / 1024).toFixed(2)} KB`,
    });
  }

  /**
   * Export all data (for debugging or backup)
   */
  exportAllData(): Record<string, any> {
    const exportData: Record<string, any> = {
      preferences: {},
      cache: {},
      secure: {},
      temp: {},
    };

    // Export preferences
    this.preferences.getAllKeys().forEach((key) => {
      exportData.preferences[key] = this.preferences.get(key);
    });

    // Export cache (without expired entries)
    this.cache.getAllKeys().forEach((key) => {
      const value = this.cache.get(key);
      if (value !== null) {
        exportData.cache[key] = value;
      }
    });

    // Note: Secure storage is included but should be handled carefully
    this.secure.getAllKeys().forEach((key) => {
      exportData.secure[key] = '***REDACTED***';
    });

    // Export temp
    this.temp.getAllKeys().forEach((key) => {
      exportData.temp[key] = this.temp.get(key);
    });

    return exportData;
  }

  /**
   * Get storage statistics
   */
  getStatistics(): {
    itemCounts: Record<string, number>;
    sizes: Record<string, number>;
    oldestCacheEntry: number | null;
  } {
    const cacheKeys = this.cache.getAllKeys();
    let oldestTimestamp: number | null = null;

    cacheKeys.forEach((key) => {
      const expiration = this.cache.getExpiration(key);
      if (expiration && (!oldestTimestamp || expiration < oldestTimestamp)) {
        oldestTimestamp = expiration;
      }
    });

    return {
      itemCounts: {
        preferences: this.preferences.getAllKeys().length,
        cache: this.cache.getAllKeys().length,
        secure: this.secure.getAllKeys().length,
        temp: this.temp.getAllKeys().length,
      },
      sizes: this.getStorageSizes(),
      oldestCacheEntry: oldestTimestamp,
    };
  }
}
