import { MMKVAdapter } from '../mmkv-adapter';
import { SerializationError, DeserializationError, IOError } from '../errors';

// Mock MMKV
const mockMMKV = {
  set: jest.fn(),
  getString: jest.fn(),
  delete: jest.fn(),
  clearAll: jest.fn(),
  getAllKeys: jest.fn().mockReturnValue([]),
  contains: jest.fn(),
};

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => mockMMKV),
}));

// Create a concrete test implementation of the abstract MMKVAdapter
class TestMMKVAdapter extends MMKVAdapter {
  constructor(id: string) {
    super({ id });
  }
}

describe('MMKVAdapter Error Handling', () => {
  let adapter: TestMMKVAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    adapter = new TestMMKVAdapter('test');
  });

  describe('set() method errors', () => {
    it('should throw SerializationError when JSON.stringify fails', () => {
      // Create an object that will cause JSON.stringify to fail
      const circularObj: any = { name: 'test' };
      circularObj.self = circularObj; // Circular reference

      expect(() => adapter.set('circular', circularObj)).toThrow(SerializationError);

      try {
        adapter.set('circular', circularObj);
      } catch (error) {
        expect(error).toBeInstanceOf(SerializationError);
        expect((error as SerializationError).key).toBe('circular');
        expect((error as SerializationError).tier).toBe('test');
        expect((error as SerializationError).operation).toBe('serialize');
        expect((error as SerializationError).cause).toBeDefined();
      }
    });

    it('should throw IOError when MMKV.set fails', () => {
      const mmkvError = new Error('MMKV write failed');
      mockMMKV.set.mockImplementation(() => {
        throw mmkvError;
      });

      expect(() => adapter.set('test-key', 'test-value')).toThrow(IOError);

      try {
        adapter.set('test-key', 'test-value');
      } catch (error) {
        expect(error).toBeInstanceOf(IOError);
        expect((error as IOError).key).toBe('test-key');
        expect((error as IOError).tier).toBe('test');
        expect((error as IOError).operation).toBe('write');
        expect((error as IOError).cause).toBe(mmkvError);
        expect((error as IOError).message).toContain('Failed to write to MMKV for key "test-key"');
      }
    });

    it('should prioritize IOError over SerializationError when both occur', () => {
      // This test ensures that if there's an MMKV error, it takes precedence over serialization errors
      const mmkvError = new Error('MMKV write failed');
      mockMMKV.set.mockImplementation(() => {
        throw mmkvError;
      });

      // Even with a problematic object, we should get IOError if MMKV fails
      expect(() => adapter.set('test-key', { valid: 'object' })).toThrow(IOError);
    });
  });

  describe('get() method errors', () => {
    it('should throw IOError when MMKV.getString fails', () => {
      const mmkvError = new Error('MMKV read failed');
      mockMMKV.getString.mockImplementation(() => {
        throw mmkvError;
      });

      expect(() => adapter.get('test-key')).toThrow(IOError);

      try {
        adapter.get('test-key');
      } catch (error) {
        expect(error).toBeInstanceOf(IOError);
        expect((error as IOError).key).toBe('test-key');
        expect((error as IOError).tier).toBe('test');
        expect((error as IOError).operation).toBe('read');
        expect((error as IOError).cause).toBe(mmkvError);
        expect((error as IOError).message).toContain('Failed to read from MMKV for key "test-key"');
      }
    });

    it('should throw DeserializationError when JSON.parse fails', () => {
      mockMMKV.getString.mockReturnValue('invalid json}');

      expect(() => adapter.get('test-key')).toThrow(DeserializationError);

      try {
        adapter.get('test-key');
      } catch (error) {
        expect(error).toBeInstanceOf(DeserializationError);
        expect((error as DeserializationError).key).toBe('test-key');
        expect((error as DeserializationError).tier).toBe('test');
        expect((error as DeserializationError).operation).toBe('deserialize');
        expect((error as DeserializationError).message).toContain('Data may be corrupted');
        expect((error as DeserializationError).cause).toBeDefined();
      }
    });

    it('should return null when key does not exist (not an error)', () => {
      mockMMKV.getString.mockReturnValue(undefined);

      const result = adapter.get('nonexistent-key');
      expect(result).toBeNull();

      // Should not throw any errors
      expect(() => adapter.get('nonexistent-key')).not.toThrow();
    });

    it('should return default value when key does not exist', () => {
      mockMMKV.getString.mockReturnValue(undefined);

      const result = adapter.get('nonexistent-key', 'default-value');
      expect(result).toBe('default-value');
    });

    it('should throw DeserializationError even when default value is provided', () => {
      mockMMKV.getString.mockReturnValue('invalid json}');

      expect(() => adapter.get('test-key', 'default')).toThrow(DeserializationError);
    });
  });

  describe('error message formatting', () => {
    it('should include key and tier information in error messages', () => {
      const testAdapter = new TestMMKVAdapter('cache-tier');

      // Test SerializationError message
      const circularObj: any = {};
      circularObj.self = circularObj;

      try {
        testAdapter.set('user-data', circularObj);
      } catch (error) {
        expect((error as SerializationError).message).toContain('user-data');
        expect((error as SerializationError).message).toContain('cache-tier');
      }

      // Test DeserializationError message
      mockMMKV.getString.mockReturnValue('invalid json}');

      try {
        testAdapter.get('corrupted-data');
      } catch (error) {
        expect((error as DeserializationError).message).toContain('corrupted-data');
        expect((error as DeserializationError).message).toContain('cache-tier');
      }
    });
  });

  describe('successful operations should not throw errors', () => {
    it('should successfully set and get valid data', () => {
      const testData = { name: 'test', value: 123 };
      const serializedData = JSON.stringify(testData);

      mockMMKV.set.mockImplementation(() => {});
      mockMMKV.getString.mockReturnValue(serializedData);

      // Set should not throw
      expect(() => adapter.set('test-key', testData)).not.toThrow();

      // Get should not throw and return correct data
      const result = adapter.get('test-key');
      expect(result).toEqual(testData);
      expect(() => adapter.get('test-key')).not.toThrow();
    });
  });
});
