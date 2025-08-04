import { SecureStorage } from '../secure';
import { EncryptionError } from '../errors';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
    getAllKeys: jest.fn().mockReturnValue([]),
    contains: jest.fn(),
  })),
  appGroupPath: '/mock/path',
}));

// Mock expo-crypto
jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('mock-uuid-1234'),
  getRandomBytesAsync: jest.fn().mockResolvedValue(new Uint8Array(32).fill(42)),
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
}));

describe('SecureStorage', () => {
  let storage: SecureStorage;

  beforeEach(async () => {
    jest.clearAllMocks();
    // Reset singleton
    (SecureStorage as any).instance = null;
    (SecureStorage as any).initializationPromise = null;

    // Reset mocks to successful defaults
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
    (Crypto.getRandomBytesAsync as jest.Mock).mockResolvedValue(new Uint8Array(32).fill(42));

    storage = await SecureStorage.getInstance();
  });

  describe('singleton pattern', () => {
    it('should return the same instance', async () => {
      const instance1 = await SecureStorage.getInstance();
      const instance2 = await SecureStorage.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('encryption key management', () => {
    it('should generate encryption key on first use', async () => {
      // Verify that a new key is generated when none exists
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('mmkv_encryption_key');
      expect(Crypto.getRandomBytesAsync).toHaveBeenCalledWith(32);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'mmkv_encryption_key',
        expect.any(String),
        {
          keychainAccessible: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
        }
      );
    });

    it('should reuse existing encryption key', async () => {
      // Reset singleton
      (SecureStorage as any).instance = null;
      (SecureStorage as any).initializationPromise = null;

      // Clear previous mock calls
      jest.clearAllMocks();

      // Mock existing key
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('existing-key');

      await SecureStorage.getInstance();

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('mmkv_encryption_key');
      expect(Crypto.getRandomBytesAsync).not.toHaveBeenCalled();
      expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
    });

    it('should throw EncryptionError if secure storage fails during key retrieval', async () => {
      // Reset singleton
      (SecureStorage as any).instance = null;
      (SecureStorage as any).initializationPromise = null;

      // Mock secure storage failure
      const secureStoreError = new Error('Secure storage error');
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(secureStoreError);

      await expect(SecureStorage.getInstance()).rejects.toThrow(EncryptionError);
      await expect(SecureStorage.getInstance()).rejects.toThrow(
        'Failed to retrieve encryption key from secure storage.'
      );

      try {
        await SecureStorage.getInstance();
      } catch (error) {
        expect(error).toBeInstanceOf(EncryptionError);
        expect((error as EncryptionError).operation).toBe('key_retrieval');
        expect((error as EncryptionError).cause).toBe(secureStoreError);
      }
    });

    it('should throw EncryptionError if random bytes generation fails', async () => {
      // Reset singleton
      (SecureStorage as any).instance = null;
      (SecureStorage as any).initializationPromise = null;

      // Mock no existing key
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      // Mock crypto failure
      const cryptoError = new Error('Crypto error');
      (Crypto.getRandomBytesAsync as jest.Mock).mockRejectedValue(cryptoError);

      await expect(SecureStorage.getInstance()).rejects.toThrow(EncryptionError);
      await expect(SecureStorage.getInstance()).rejects.toThrow(
        'Failed to generate cryptographically secure random bytes'
      );
    });

    it('should throw EncryptionError if key storage fails', async () => {
      // Reset singleton
      (SecureStorage as any).instance = null;
      (SecureStorage as any).initializationPromise = null;

      // Mock no existing key and successful crypto
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      (Crypto.getRandomBytesAsync as jest.Mock).mockResolvedValue(new Uint8Array(32).fill(42));

      // Mock storage failure
      const storageError = new Error('Storage failed');
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(storageError);

      await expect(SecureStorage.getInstance()).rejects.toThrow(EncryptionError);
      await expect(SecureStorage.getInstance()).rejects.toThrow(
        'Failed to store encryption key in secure storage.'
      );
    });
  });

  describe('secure storage operations', () => {
    it('should set secure value', () => {
      const sensitiveData = { secret: 'password123' };
      storage.setSecure('credentials', sensitiveData);

      expect(storage.mmkv.set).toHaveBeenCalledWith('credentials', JSON.stringify(sensitiveData));
    });

    it('should get secure value', () => {
      const sensitiveData = { secret: 'password123' };
      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify(sensitiveData));

      expect(storage.getSecure('credentials')).toEqual(sensitiveData);
    });

    it('should return null for non-existent secure value', () => {
      (storage.mmkv.getString as jest.Mock).mockReturnValue(undefined);

      expect(storage.getSecure('nonexistent')).toBeNull();
    });

    it('should return default value for non-existent secure value', () => {
      (storage.mmkv.getString as jest.Mock).mockReturnValue(undefined);

      expect(storage.getSecure('nonexistent', 'default')).toBe('default');
    });
  });

  describe('auth token management', () => {
    it('should set and get auth token', () => {
      storage.setAuthToken('bearer-token-123');
      expect(storage.mmkv.set).toHaveBeenCalledWith(
        'authToken',
        JSON.stringify('bearer-token-123')
      );

      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify('bearer-token-123'));
      expect(storage.getAuthToken()).toBe('bearer-token-123');
    });

    it('should set and get refresh token', () => {
      storage.setRefreshToken('refresh-token-456');
      expect(storage.mmkv.set).toHaveBeenCalledWith(
        'refreshToken',
        JSON.stringify('refresh-token-456')
      );

      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify('refresh-token-456'));
      expect(storage.getRefreshToken()).toBe('refresh-token-456');
    });
  });

  describe('API key management', () => {
    it('should set and get API keys', () => {
      storage.setApiKey('stripe', 'sk_test_123');
      expect(storage.mmkv.set).toHaveBeenCalledWith('apiKey_stripe', JSON.stringify('sk_test_123'));

      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify('sk_test_123'));
      expect(storage.getApiKey('stripe')).toBe('sk_test_123');
    });

    it('should return null for non-existent API key', () => {
      (storage.mmkv.getString as jest.Mock).mockReturnValue(undefined);
      expect(storage.getApiKey('nonexistent')).toBeNull();
    });
  });

  describe('credentials management', () => {
    it('should set and get credentials', () => {
      const credentials = { username: 'user@example.com', password: 'hashedPassword' };
      storage.setCredentials('user@example.com', 'hashedPassword');

      expect(storage.mmkv.set).toHaveBeenCalledWith('credentials', JSON.stringify(credentials));

      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify(credentials));
      expect(storage.getCredentials()).toEqual(credentials);
    });

    it('should return null when no credentials stored', () => {
      (storage.mmkv.getString as jest.Mock).mockReturnValue(undefined);
      expect(storage.getCredentials()).toBeNull();
    });
  });

  describe('clearAuth', () => {
    it('should clear all auth-related data', () => {
      const allKeys = [
        'authToken',
        'refreshToken',
        'credentials',
        'apiKey_stripe',
        'apiKey_github',
        'otherData',
      ];

      (storage.mmkv.getAllKeys as jest.Mock).mockReturnValue(allKeys);

      storage.clearAuth();

      expect(storage.mmkv.delete).toHaveBeenCalledWith('authToken');
      expect(storage.mmkv.delete).toHaveBeenCalledWith('refreshToken');
      expect(storage.mmkv.delete).toHaveBeenCalledWith('credentials');
      expect(storage.mmkv.delete).toHaveBeenCalledWith('apiKey_stripe');
      expect(storage.mmkv.delete).toHaveBeenCalledWith('apiKey_github');
      expect(storage.mmkv.delete).not.toHaveBeenCalledWith('otherData');
      expect(storage.mmkv.delete).toHaveBeenCalledTimes(5);
    });

    it('should handle empty key list', () => {
      (storage.mmkv.getAllKeys as jest.Mock).mockReturnValue([]);

      storage.clearAuth();

      expect(storage.mmkv.delete).not.toHaveBeenCalled();
    });
  });

  describe('rotateEncryptionKey', () => {
    it('should throw not implemented error', async () => {
      // Key rotation is not yet implemented
      await expect(storage.rotateEncryptionKey()).rejects.toThrow(
        'Key rotation is not yet implemented. This feature will be available in a future release.'
      );
    });

    // TODO: Add tests when key rotation is implemented
  });

  describe('error handling', () => {
    it('should throw IOError when MMKV fails in setSecure', () => {
      (storage.mmkv.set as jest.Mock).mockImplementation(() => {
        throw new Error('MMKV write error');
      });

      expect(() => storage.setSecure('key', 'value')).toThrow(
        'Failed to write to MMKV for key "key" in tier "secure"'
      );

      try {
        storage.setSecure('key', 'value');
      } catch (error: any) {
        expect(error.name).toBe('IOError');
        expect(error.operation).toBe('write');
        expect(error.tier).toBe('secure');
      }
    });

    it('should throw DeserializationError for invalid JSON in getSecure', () => {
      (storage.mmkv.getString as jest.Mock).mockReturnValue('invalid json');

      expect(() => storage.getSecure('key')).toThrow(
        'Failed to deserialize value for key "key" in tier "secure". Data may be corrupted.'
      );

      try {
        storage.getSecure('key');
      } catch (error: any) {
        expect(error.name).toBe('DeserializationError');
        expect(error.operation).toBe('deserialize');
        expect(error.tier).toBe('secure');
        expect(error.key).toBe('key');
      }
    });
  });
});
