export interface IStorage {
  set<T>(key: string, value: T): void;
  get<T>(key: string): T | null;
  get<T>(key: string, defaultValue: T): T;
  delete(key: string): void;
  clear(): void;
  getAllKeys(): string[];
  contains(key: string): boolean;
}

export interface IStorageWithTTL extends IStorage {
  setWithTTL<T>(key: string, value: T, ttlSeconds: number): void;
  clearExpired(): void;
  getExpiration(key: string): number | null;
}

export interface ISecureStorage extends IStorage {
  setSecure<T>(key: string, value: T): void;
  getSecure<T>(key: string): T | null;
  getSecure<T>(key: string, defaultValue: T): T;
  // TODO: Key rotation to be implemented in future release
  // rotateEncryptionKey(): Promise<void>;
}

export interface StorageEntry<T> {
  value: T;
  timestamp: number;
  ttl?: number;
}

export interface StorageOptions {
  id: string;
  path?: string;
  encryptionKey?: string;
}

export interface IStorageManager {
  preferences: IStorage;
  cache: IStorageWithTTL;
  secure: ISecureStorage;
  temp: IStorage;
  clearAll(): void;
  getStorageSizes(): Record<string, number>;
}

// Export error types
export {
  StorageError,
  InitializationError,
  EncryptionError,
  SerializationError,
  DeserializationError,
  IOError,
} from './errors';
