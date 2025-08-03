import { SecureStorage } from '../secure';
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

    // Mock SecureStore to return no existing key by default
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

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

    it('should fallback to temporary key if secure storage fails', async () => {
      // Reset singleton
      (SecureStorage as any).instance = null;
      (SecureStorage as any).initializationPromise = null;

      // Mock secure storage failure
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Secure storage error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await SecureStorage.getInstance();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to manage encryption key:',
        expect.any(Error)
      );
      expect(warnSpy).toHaveBeenCalledWith(
        'Using temporary encryption key. Data will not persist across app restarts.'
      );
      expect(Crypto.randomUUID).toHaveBeenCalled();

      consoleSpy.mockRestore();
      warnSpy.mockRestore();
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
    it('should handle errors in setSecure', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (storage.mmkv.set as jest.Mock).mockImplementation(() => {
        throw new Error('Encryption error');
      });

      expect(() => storage.setSecure('key', 'value')).toThrow('Encryption error');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle parse errors in getSecure', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (storage.mmkv.getString as jest.Mock).mockReturnValue('invalid json');

      expect(storage.getSecure('key')).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
