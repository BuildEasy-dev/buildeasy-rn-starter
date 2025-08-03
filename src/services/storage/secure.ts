import { MMKVAdapter } from './mmkv-adapter';
import type { ISecureStorage } from './types';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

export class SecureStorage extends MMKVAdapter implements ISecureStorage {
  private static instance: SecureStorage | null = null;
  private static initializationPromise: Promise<SecureStorage> | null = null;
  private encryptionKey: string;
  private static readonly ENCRYPTION_KEY_NAME = 'mmkv_encryption_key';

  private constructor(encryptionKey: string) {
    super({
      id: 'secure',
      encryptionKey,
    });

    this.encryptionKey = encryptionKey;
  }

  static async getInstance(): Promise<SecureStorage> {
    if (!SecureStorage.instance) {
      if (!SecureStorage.initializationPromise) {
        SecureStorage.initializationPromise = SecureStorage.initialize();
      }
      SecureStorage.instance = await SecureStorage.initializationPromise;
    }
    return SecureStorage.instance;
  }

  private static async initialize(): Promise<SecureStorage> {
    const encryptionKey = await SecureStorage.getOrCreateEncryptionKey();
    return new SecureStorage(encryptionKey);
  }

  private static async getOrCreateEncryptionKey(): Promise<string> {
    try {
      // Try to retrieve existing key from secure storage
      const existingKey = await SecureStore.getItemAsync(SecureStorage.ENCRYPTION_KEY_NAME);

      if (existingKey) {
        return existingKey;
      }

      // Generate a new cryptographically secure key
      // Using 32 bytes (256 bits) for AES-256 strength
      const randomBytes = await Crypto.getRandomBytesAsync(32);
      const newKey = btoa(String.fromCharCode(...randomBytes));

      // Store the key securely
      await SecureStore.setItemAsync(SecureStorage.ENCRYPTION_KEY_NAME, newKey, {
        // Use the most secure accessibility option
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });

      return newKey;
    } catch (error) {
      console.error('Failed to manage encryption key:', error);
      // Fallback to generating a temporary key if secure storage fails
      // This ensures the app can still function, but data won't persist across app restarts
      console.warn('Using temporary encryption key. Data will not persist across app restarts.');
      return Crypto.randomUUID();
    }
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

  /**
   * Rotate encryption key (creates new key and re-encrypts all data)
   *
   * TODO: Implement key rotation functionality in future release
   *
   * Implementation requirements:
   * 1. Generate new 256-bit encryption key using expo-crypto
   * 2. Create temporary MMKV instance with new key
   * 3. Migrate all data from current instance to new instance
   * 4. Update key in expo-secure-store
   * 5. Replace current MMKV instance with new one
   * 6. Handle errors gracefully with rollback capability
   *
   * Security considerations:
   * - Ensure atomic operation (all or nothing)
   * - Validate data integrity after migration
   * - Clear old encrypted data securely
   * - Log rotation event for audit purposes
   *
   * Performance considerations:
   * - May take time for large datasets
   * - Consider showing progress indicator
   * - Run in background if possible
   *
   * Use cases:
   * - Scheduled security maintenance (e.g., every 90 days)
   * - Response to security incidents
   * - Compliance requirements (PCI-DSS, HIPAA)
   * - User-requested security enhancement
   *
   * @throws {Error} If key rotation fails
   */
  async rotateEncryptionKey(): Promise<void> {
    // TODO: Implement key rotation in future release
    throw new Error(
      'Key rotation is not yet implemented. This feature will be available in a future release.'
    );
  }
}
