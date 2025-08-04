import {
  StorageError,
  InitializationError,
  EncryptionError,
  SerializationError,
  DeserializationError,
  IOError,
} from '../errors';

describe('Storage Error Classes', () => {
  describe('StorageError', () => {
    it('should create a basic storage error with required properties', () => {
      const error = new StorageError('Test error message', {
        tier: 'cache',
        operation: 'read',
        key: 'test-key',
      });

      expect(error.name).toBe('StorageError');
      expect(error.message).toBe('Test error message');
      expect(error.tier).toBe('cache');
      expect(error.operation).toBe('read');
      expect(error.key).toBe('test-key');
      expect(error.cause).toBeUndefined();
    });

    it('should include cause error and append stack trace', () => {
      const originalError = new Error('Original error');
      const error = new StorageError('Wrapper error', {
        tier: 'secure',
        operation: 'write',
        cause: originalError,
      });

      expect(error.cause).toBe(originalError);
      expect(error.stack).toContain('Caused by:');
      expect(error.stack).toContain(originalError.stack);
    });

    it('should handle missing optional properties', () => {
      const error = new StorageError('Minimal error', {
        tier: 'preferences',
        operation: 'delete',
      });

      expect(error.key).toBeUndefined();
      expect(error.cause).toBeUndefined();
    });
  });

  describe('InitializationError', () => {
    it('should create initialization error with secure tier', () => {
      const error = new InitializationError('Failed to initialize', {
        tier: 'secure',
      });

      expect(error.name).toBe('InitializationError');
      expect(error.operation).toBe('initialize');
      expect(error.tier).toBe('secure');
    });

    it('should create initialization error with manager tier', () => {
      const originalError = new Error('Underlying cause');
      const error = new InitializationError('Manager failed', {
        tier: 'manager',
        cause: originalError,
      });

      expect(error.name).toBe('InitializationError');
      expect(error.tier).toBe('manager');
      expect(error.cause).toBe(originalError);
    });
  });

  describe('EncryptionError', () => {
    it('should create encryption error for key generation', () => {
      const error = new EncryptionError('Key generation failed', {
        operation: 'key_generation',
      });

      expect(error.name).toBe('EncryptionError');
      expect(error.tier).toBe('secure');
      expect(error.operation).toBe('key_generation');
    });

    it('should create encryption error for key retrieval', () => {
      const originalError = new Error('SecureStore failed');
      const error = new EncryptionError('Key retrieval failed', {
        operation: 'key_retrieval',
        cause: originalError,
      });

      expect(error.name).toBe('EncryptionError');
      expect(error.operation).toBe('key_retrieval');
      expect(error.cause).toBe(originalError);
    });

    it('should support all encryption operations', () => {
      const operations = ['key_generation', 'key_retrieval', 'encryption', 'decryption'] as const;

      operations.forEach((op) => {
        const error = new EncryptionError(`${op} failed`, { operation: op });
        expect(error.operation).toBe(op);
        expect(error.tier).toBe('secure');
      });
    });
  });

  describe('SerializationError', () => {
    it('should create serialization error with context', () => {
      const originalError = new TypeError('Circular structure');
      const error = new SerializationError('user-data', 'cache', originalError);

      expect(error.name).toBe('SerializationError');
      expect(error.tier).toBe('cache');
      expect(error.operation).toBe('serialize');
      expect(error.key).toBe('user-data');
      expect(error.cause).toBe(originalError);
      expect(error.message).toContain(
        'Failed to serialize value for key "user-data" in tier "cache"'
      );
    });

    it('should work with different tiers', () => {
      const originalError = new Error('JSON error');
      const error = new SerializationError('settings', 'preferences', originalError);

      expect(error.tier).toBe('preferences');
      expect(error.message).toContain('tier "preferences"');
    });
  });

  describe('DeserializationError', () => {
    it('should create deserialization error with corruption warning', () => {
      const originalError = new SyntaxError('Unexpected token');
      const error = new DeserializationError('corrupted-data', 'secure', originalError);

      expect(error.name).toBe('DeserializationError');
      expect(error.tier).toBe('secure');
      expect(error.operation).toBe('deserialize');
      expect(error.key).toBe('corrupted-data');
      expect(error.cause).toBe(originalError);
      expect(error.message).toContain('Data may be corrupted');
      expect(error.message).toContain('corrupted-data');
    });
  });

  describe('IOError', () => {
    it('should create IO error with custom message and context', () => {
      const originalError = new Error('MMKV write failed');
      const error = new IOError('Failed to write to MMKV', {
        tier: 'temp',
        operation: 'write',
        key: 'session-data',
        cause: originalError,
      });

      expect(error.name).toBe('IOError');
      expect(error.tier).toBe('temp');
      expect(error.operation).toBe('write');
      expect(error.key).toBe('session-data');
      expect(error.cause).toBe(originalError);
      expect(error.message).toBe('Failed to write to MMKV');
    });

    it('should create IO error without key for non-key operations', () => {
      const error = new IOError('MMKV initialization failed', {
        tier: 'cache',
        operation: 'initialize',
      });

      expect(error.key).toBeUndefined();
      expect(error.operation).toBe('initialize');
    });
  });

  describe('Error inheritance', () => {
    it('should maintain proper inheritance chain', () => {
      const storageError = new StorageError('Base error', {
        tier: 'cache',
        operation: 'test',
      });
      const initError = new InitializationError('Init error', { tier: 'secure' });
      const encryptionError = new EncryptionError('Encryption error', {
        operation: 'key_generation',
      });
      const serializationError = new SerializationError('key', 'cache', new Error());
      const deserializationError = new DeserializationError('key', 'cache', new Error());
      const ioError = new IOError('IO error', { tier: 'cache', operation: 'read' });

      expect(storageError).toBeInstanceOf(Error);
      expect(storageError).toBeInstanceOf(StorageError);

      expect(initError).toBeInstanceOf(Error);
      expect(initError).toBeInstanceOf(StorageError);
      expect(initError).toBeInstanceOf(InitializationError);

      expect(encryptionError).toBeInstanceOf(Error);
      expect(encryptionError).toBeInstanceOf(StorageError);
      expect(encryptionError).toBeInstanceOf(EncryptionError);

      expect(serializationError).toBeInstanceOf(Error);
      expect(serializationError).toBeInstanceOf(StorageError);
      expect(serializationError).toBeInstanceOf(SerializationError);

      expect(deserializationError).toBeInstanceOf(Error);
      expect(deserializationError).toBeInstanceOf(StorageError);
      expect(deserializationError).toBeInstanceOf(DeserializationError);

      expect(ioError).toBeInstanceOf(Error);
      expect(ioError).toBeInstanceOf(StorageError);
      expect(ioError).toBeInstanceOf(IOError);
    });
  });
});
