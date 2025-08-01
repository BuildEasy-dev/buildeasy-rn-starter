import { MMKV } from 'react-native-mmkv';
import type { IStorage, StorageOptions } from './types';

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
      this.mmkv.set(key, serialized);
    } catch (error) {
      console.error(`Failed to set value for key "${key}":`, error);
      throw error;
    }
  }

  get<T>(key: string): T | null;
  get<T>(key: string, defaultValue: T): T;
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const value = this.mmkv.getString(key);
      if (value === undefined) {
        return defaultValue ?? null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Failed to get value for key "${key}":`, error);
      return defaultValue ?? null;
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
