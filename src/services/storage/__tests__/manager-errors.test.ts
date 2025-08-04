import { StorageManager } from '../manager';
import { InitializationError, EncryptionError } from '../errors';
import { SecureStorage } from '../secure';
import { PreferencesStorage } from '../preferences';
import { CacheStorage } from '../cache';
import { TempStorage } from '../temp';

// Mock expo modules first
jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('mock-uuid-1234'),
  getRandomBytesAsync: jest.fn().mockResolvedValue(new Uint8Array(32).fill(42)),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
}));

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
    getAllKeys: jest.fn().mockReturnValue([]),
    contains: jest.fn(),
  })),
}));

// Mock all the storage modules
jest.mock('../secure');
jest.mock('../preferences');
jest.mock('../cache');
jest.mock('../temp');

// Mock the concrete storage implementations
const mockPreferencesStorage = {
  getInstance: jest.fn(),
  clear: jest.fn(),
  getSize: jest.fn().mockReturnValue(0),
  getAllKeys: jest.fn().mockReturnValue([]),
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  contains: jest.fn(),
};

const mockCacheStorage = {
  getInstance: jest.fn(),
  clear: jest.fn(),
  clearExpired: jest.fn(),
  evictOldest: jest.fn(),
  getSize: jest.fn().mockReturnValue(0),
  getAllKeys: jest.fn().mockReturnValue([]),
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  contains: jest.fn(),
  getExpiration: jest.fn(),
};

const mockTempStorage = {
  getInstance: jest.fn(),
  clear: jest.fn(),
  initialize: jest.fn(),
  getSize: jest.fn().mockReturnValue(0),
  getAllKeys: jest.fn().mockReturnValue([]),
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  contains: jest.fn(),
};

const mockSecureStorageInstance = {
  clear: jest.fn(),
  getSize: jest.fn().mockReturnValue(0),
  getAllKeys: jest.fn().mockReturnValue([]),
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  contains: jest.fn(),
};

describe('StorageManager Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset StorageManager singleton
    (StorageManager as any).instance = null;
    (StorageManager as any).initializationPromise = null;

    // Setup default successful mocks
    (PreferencesStorage.getInstance as jest.Mock).mockReturnValue(mockPreferencesStorage);
    (CacheStorage.getInstance as jest.Mock).mockReturnValue(mockCacheStorage);
    (TempStorage.getInstance as jest.Mock).mockReturnValue(mockTempStorage);
  });

  describe('initialization errors', () => {
    it('should throw InitializationError when SecureStorage fails with EncryptionError', async () => {
      const originalEncryptionError = new EncryptionError('Key retrieval failed', {
        operation: 'key_retrieval',
        cause: new Error('SecureStore failed'),
      });

      (SecureStorage.getInstance as jest.Mock).mockRejectedValue(originalEncryptionError);

      await expect(StorageManager.initialize()).rejects.toThrow(InitializationError);

      try {
        await StorageManager.initialize();
      } catch (error) {
        expect(error).toBeInstanceOf(InitializationError);
        expect((error as InitializationError).tier).toBe('manager');
        expect((error as InitializationError).operation).toBe('initialize');
        expect((error as InitializationError).cause).toBe(originalEncryptionError);
        expect((error as InitializationError).message).toContain(
          'Failed to initialize SecureStorage due to encryption key management failure'
        );
      }
    });

    it('should throw InitializationError for unknown errors during SecureStorage initialization', async () => {
      const unknownError = new Error('Unknown initialization error');
      (SecureStorage.getInstance as jest.Mock).mockRejectedValue(unknownError);

      await expect(StorageManager.initialize()).rejects.toThrow(InitializationError);

      try {
        await StorageManager.initialize();
      } catch (error) {
        expect(error).toBeInstanceOf(InitializationError);
        expect((error as InitializationError).cause).toBe(unknownError);
        expect((error as InitializationError).message).toContain(
          'Failed to initialize SecureStorage due to unknown error'
        );
      }
    });

    it('should successfully initialize when SecureStorage succeeds', async () => {
      (SecureStorage.getInstance as jest.Mock).mockResolvedValue(mockSecureStorageInstance);

      const manager = await StorageManager.initialize();

      expect(manager).toBeInstanceOf(StorageManager);
      expect(manager.secure).toBe(mockSecureStorageInstance);
      expect(manager.preferences).toBe(mockPreferencesStorage);
      expect(manager.cache).toBe(mockCacheStorage);
      expect(manager.temp).toBe(mockTempStorage);
    });

    it('should return same instance on subsequent calls', async () => {
      (SecureStorage.getInstance as jest.Mock).mockResolvedValue(mockSecureStorageInstance);

      const manager1 = await StorageManager.initialize();
      const manager2 = await StorageManager.initialize();

      expect(manager1).toBe(manager2);
      expect(SecureStorage.getInstance).toHaveBeenCalledTimes(1);
    });

    it('should handle concurrent initialization attempts', async () => {
      (SecureStorage.getInstance as jest.Mock).mockResolvedValue(mockSecureStorageInstance);

      // Start multiple initialization attempts concurrently
      const promises = [
        StorageManager.initialize(),
        StorageManager.initialize(),
        StorageManager.initialize(),
      ];

      const managers = await Promise.all(promises);

      // All should return the same instance
      expect(managers[0]).toBe(managers[1]);
      expect(managers[1]).toBe(managers[2]);

      // SecureStorage.getInstance should only be called once
      expect(SecureStorage.getInstance).toHaveBeenCalledTimes(1);
    });
  });

  describe('getInstance error handling', () => {
    it('should throw error when not initialized', () => {
      expect(() => StorageManager.getInstance()).toThrow(
        'StorageManager not initialized. Call StorageManager.initialize() first.'
      );
    });

    it('should return instance after successful initialization', async () => {
      (SecureStorage.getInstance as jest.Mock).mockResolvedValue(mockSecureStorageInstance);

      const manager = await StorageManager.initialize();
      const retrievedManager = StorageManager.getInstance();

      expect(retrievedManager).toBe(manager);
    });
  });

  describe('initialization failure scenarios', () => {
    it('should reset initialization promise on failure', async () => {
      const firstError = new EncryptionError('First failure', { operation: 'key_retrieval' });
      (SecureStorage.getInstance as jest.Mock).mockRejectedValueOnce(firstError);

      // First attempt should fail
      await expect(StorageManager.initialize()).rejects.toThrow(InitializationError);

      // Reset singleton state after failure
      (StorageManager as any).instance = null;
      (StorageManager as any).initializationPromise = null;

      // Reset mock for second attempt
      (SecureStorage.getInstance as jest.Mock).mockResolvedValue(mockSecureStorageInstance);

      // Second attempt should succeed
      const manager = await StorageManager.initialize();
      expect(manager).toBeInstanceOf(StorageManager);
    });

    it('should maintain error state until successful initialization', async () => {
      const error = new EncryptionError('Persistent failure', { operation: 'key_retrieval' });
      (SecureStorage.getInstance as jest.Mock).mockRejectedValue(error);

      // Multiple attempts should all fail with InitializationError
      await expect(StorageManager.initialize()).rejects.toThrow(InitializationError);
      await expect(StorageManager.initialize()).rejects.toThrow(InitializationError);
      await expect(StorageManager.initialize()).rejects.toThrow(InitializationError);

      // getInstance should still throw
      expect(() => StorageManager.getInstance()).toThrow('StorageManager not initialized');
    });
  });

  describe('error context preservation', () => {
    it('should preserve original error details in InitializationError', async () => {
      const originalCause = new Error('Device security settings changed');
      const encryptionError = new EncryptionError('Cannot access keychain', {
        operation: 'key_retrieval',
        cause: originalCause,
      });

      (SecureStorage.getInstance as jest.Mock).mockRejectedValue(encryptionError);

      try {
        await StorageManager.initialize();
      } catch (error) {
        expect(error).toBeInstanceOf(InitializationError);

        const initError = error as InitializationError;
        expect(initError.cause).toBe(encryptionError);
        expect(initError.cause?.cause).toBe(originalCause);

        // Check that stack traces are preserved
        expect(initError.stack).toContain('Caused by:');
      }
    });
  });
});
