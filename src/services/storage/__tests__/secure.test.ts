import { SecureStorage } from '../secure';

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
}));

describe('SecureStorage', () => {
  let storage: SecureStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset singleton
    (SecureStorage as any).instance = null;
    // Reset global encryption key
    global.mmkvEncryptionKey = undefined;
    storage = SecureStorage.getInstance();
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = SecureStorage.getInstance();
      const instance2 = SecureStorage.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('encryption key management', () => {
    it('should generate encryption key on first use', () => {
      expect(global.mmkvEncryptionKey).toBe('mock-uuid-1234');
    });

    it('should reuse existing encryption key', () => {
      global.mmkvEncryptionKey = 'existing-key';
      (SecureStorage as any).instance = null;

      SecureStorage.getInstance();
      expect(global.mmkvEncryptionKey).toBe('existing-key');
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
    it('should warn about unimplemented feature', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await storage.rotateEncryptionKey();

      expect(consoleSpy).toHaveBeenCalledWith('Encryption key rotation not yet implemented');
      consoleSpy.mockRestore();
    });
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
