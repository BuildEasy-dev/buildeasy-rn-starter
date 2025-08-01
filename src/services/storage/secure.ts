import { MMKV } from 'react-native-mmkv';
import { MMKVAdapter } from './mmkv-adapter';
import type { ISecureStorage } from './types';
import * as Crypto from 'expo-crypto';

export class SecureStorage extends MMKVAdapter implements ISecureStorage {
  private static instance: SecureStorage | null = null;
  private encryptionKey: string;

  constructor() {
    // Generate or retrieve encryption key
    const encryptionKey = SecureStorage.getOrCreateEncryptionKey();

    super({
      id: 'secure',
      path: './no-backup',
      encryptionKey,
    });

    this.encryptionKey = encryptionKey;
  }

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  private static getOrCreateEncryptionKey(): string {
    // For a production app, you'd want to store this key more securely
    // This is a simplified example

    // In a real app, consider using:
    // - iOS: Keychain Services
    // - Android: Android Keystore
    // For now, we'll use a UUID-based approach

    // This would ideally be stored in a more secure location
    const storedKey = global.mmkvEncryptionKey;

    if (storedKey) {
      return storedKey;
    }

    // Generate a new key
    const newKey = Crypto.randomUUID();
    global.mmkvEncryptionKey = newKey;

    return newKey;
  }

  setSecure<T>(key: string, value: T): void {
    // The MMKV instance is already configured with encryption
    // so we can use the regular set method
    this.set(key, value);
  }

  getSecure<T>(key: string): T | null;
  getSecure<T>(key: string, defaultValue: T): T;
  getSecure<T>(key: string, defaultValue?: T): T | null {
    // The MMKV instance handles decryption automatically
    return this.get(key, defaultValue as T);
  }

  // Additional secure storage methods

  setAuthToken(token: string): void {
    this.setSecure('authToken', token);
  }

  getAuthToken(): string | null {
    return this.getSecure<string>('authToken');
  }

  setRefreshToken(token: string): void {
    this.setSecure('refreshToken', token);
  }

  getRefreshToken(): string | null {
    return this.getSecure<string>('refreshToken');
  }

  setApiKey(key: string, value: string): void {
    this.setSecure(`apiKey_${key}`, value);
  }

  getApiKey(key: string): string | null {
    return this.getSecure<string>(`apiKey_${key}`);
  }

  setCredentials(username: string, password: string): void {
    this.setSecure('credentials', { username, password });
  }

  getCredentials(): { username: string; password: string } | null {
    return this.getSecure('credentials');
  }

  // Clear all authentication-related data
  clearAuth(): void {
    const authKeys = ['authToken', 'refreshToken', 'credentials'];
    const allKeys = this.getAllKeys();

    // Clear auth keys and API keys
    allKeys.forEach((key) => {
      if (authKeys.includes(key) || key.startsWith('apiKey_')) {
        this.delete(key);
      }
    });
  }

  // Rotate encryption key (requires migrating all data)
  async rotateEncryptionKey(): Promise<void> {
    // This is a complex operation that would:
    // 1. Generate new encryption key
    // 2. Create new MMKV instance with new key
    // 3. Copy all data from old instance to new
    // 4. Replace the instance
    //
    // For now, this is a placeholder
    console.warn('Encryption key rotation not yet implemented');
  }
}

// Global variable to store encryption key in memory
// In production, use proper key management
declare global {
  var mmkvEncryptionKey: string | undefined;
}
