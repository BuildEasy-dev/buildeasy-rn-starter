import { MMKV } from 'react-native-mmkv';
import type { IStorage, StorageOptions } from './types';
import { SerializationError, DeserializationError, IOError } from './errors';

export abstract class MMKVAdapter implements IStorage {
  private _mmkv: MMKV | null = null;
  private options: StorageOptions;

  constructor(options: StorageOptions) {
    this.options = options;
  }

  public get mmkv(): MMKV {
    if (!this._mmkv) {
      this._mmkv = new MMKV(this.options);
    }
    return this._mmkv;
  }

  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      try {
        this.mmkv.set(key, serialized);
      } catch (mmkvError) {
        throw new IOError(
          `Failed to write to MMKV for key "${key}" in tier "${this.options.id}".`,
          {
            tier: this.options.id as any,
            operation: 'write',
            key,
            cause: mmkvError as Error,
          }
        );
      }
    } catch (error) {
      // If it's already one of our custom errors, re-throw it
      if (error instanceof IOError) {
        throw error;
      }
      // Otherwise, it's a serialization error
      throw new SerializationError(key, this.options.id as any, error as Error);
    }
  }

  get<T>(key: string): T | null;
  get<T>(key: string, defaultValue: T): T;
  get<T>(key: string, defaultValue?: T): T | null {
    let rawValue: string | undefined;

    try {
      rawValue = this.mmkv.getString(key);
    } catch (error) {
      throw new IOError(`Failed to read from MMKV for key "${key}" in tier "${this.options.id}".`, {
        tier: this.options.id as any,
        operation: 'read',
        key,
        cause: error as Error,
      });
    }

    // Key doesn't exist - return default value or null
    if (rawValue === undefined) {
      return defaultValue ?? null;
    }

    try {
      return JSON.parse(rawValue) as T;
    } catch (error) {
      throw new DeserializationError(key, this.options.id as any, error as Error);
    }
  }

  delete(key: string): void {
    this.mmkv.delete(key);
  }

  clear(): void {
    this.mmkv.clearAll();
  }

  getAllKeys(): string[] {
    return this.mmkv.getAllKeys();
  }

  contains(key: string): boolean {
    return this.mmkv.contains(key);
  }

  getSize(): number {
    return this.getAllKeys().reduce((total, key) => {
      const value = this.mmkv.getString(key);
      return total + (value?.length ?? 0);
    }, 0);
  }

  protected getRawString(key: string): string | undefined {
    return this.mmkv.getString(key);
  }

  protected setRawString(key: string, value: string): void {
    this.mmkv.set(key, value);
  }
}
