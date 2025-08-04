import { MMKVAdapter } from './mmkv-adapter';
import type { IStorageWithTTL, StorageEntry } from './types';

export class CacheStorage extends MMKVAdapter implements IStorageWithTTL {
  private static instance: CacheStorage | null = null;
  private readonly TTL_KEY_PREFIX = '_ttl_';

  constructor() {
    super({
      id: 'cache',
    });
  }

  static getInstance(): CacheStorage {
    if (!CacheStorage.instance) {
      CacheStorage.instance = new CacheStorage();
    }
    return CacheStorage.instance;
  }

  setWithTTL<T>(key: string, value: T, ttlSeconds: number): void {
    const entry: StorageEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000, // Convert to milliseconds
    };

    try {
      const serialized = JSON.stringify(entry);
      this.setRawString(key, serialized);
    } catch (error) {
      console.error(`Failed to set cached value for key "${key}":`, error);
      throw error;
    }
  }

  get<T>(key: string): T | null;
  get<T>(key: string, defaultValue: T): T;
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const rawValue = this.getRawString(key);
      if (rawValue === undefined) {
        return defaultValue ?? null;
      }

      const entry = JSON.parse(rawValue) as StorageEntry<T>;

      // Check if entry has TTL and is expired
      if (entry.ttl !== undefined && entry.timestamp) {
        const now = Date.now();
        const expirationTime = entry.timestamp + entry.ttl;

        if (now > expirationTime) {
          // Entry is expired, delete it
          this.delete(key);
          return defaultValue ?? null;
        }
      }

      // If no TTL or not expired, return the value
      return entry.value ?? defaultValue ?? null;
    } catch (error) {
      console.error(`Failed to get cached value for key "${key}":`, error);
      throw error;
    }
  }

  set<T>(key: string, value: T): void {
    // Default set without TTL - store as regular entry
    const entry: StorageEntry<T> = {
      value,
      timestamp: Date.now(),
    };

    try {
      const serialized = JSON.stringify(entry);
      this.setRawString(key, serialized);
    } catch (error) {
      console.error(`Failed to set cached value for key "${key}":`, error);
      throw error;
    }
  }

  clearExpired(): void {
    const keys = this.getAllKeys();
    const now = Date.now();

    keys.forEach((key) => {
      try {
        const rawValue = this.getRawString(key);
        if (rawValue) {
          const entry = JSON.parse(rawValue) as StorageEntry<unknown>;

          if (entry.ttl !== undefined && entry.timestamp) {
            const expirationTime = entry.timestamp + entry.ttl;
            if (now > expirationTime) {
              this.delete(key);
            }
          }
        }
      } catch (error) {
        console.error(`Failed to check expiration for key "${key}":`, error);
      }
    });
  }

  getExpiration(key: string): number | null {
    try {
      const rawValue = this.getRawString(key);
      if (rawValue === undefined) {
        return null;
      }

      const entry = JSON.parse(rawValue) as StorageEntry<unknown>;

      if (entry.ttl !== undefined && entry.timestamp) {
        return entry.timestamp + entry.ttl;
      }

      return null;
    } catch (error) {
      console.error(`Failed to get expiration for key "${key}":`, error);
      return null;
    }
  }

  // Utility method to get remaining TTL in seconds
  getRemainingTTL(key: string): number | null {
    const expiration = this.getExpiration(key);
    if (expiration === null) {
      return null;
    }

    const remaining = expiration - Date.now();
    return remaining > 0 ? Math.floor(remaining / 1000) : 0;
  }

  // LRU eviction when storage is full
  evictOldest(maxSize: number = 20 * 1024 * 1024): void {
    // 20MB default
    const currentSize = this.getSize();

    if (currentSize <= maxSize) {
      return;
    }

    const entries: { key: string; timestamp: number }[] = [];
    const keys = this.getAllKeys();

    keys.forEach((key) => {
      try {
        const rawValue = this.getRawString(key);
        if (rawValue) {
          const entry = JSON.parse(rawValue) as StorageEntry<unknown>;
          entries.push({ key, timestamp: entry.timestamp });
        }
      } catch (error) {
        console.error(`Failed to parse entry for eviction: ${key}`, error);
      }
    });

    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a.timestamp - b.timestamp);

    // Remove oldest entries until under max size
    let sizeReduced = 0;
    for (const { key } of entries) {
      if (currentSize - sizeReduced <= maxSize) {
        break;
      }

      const entrySize = this.getRawString(key)?.length ?? 0;
      this.delete(key);
      sizeReduced += entrySize;
    }
  }
}
