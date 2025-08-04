import { CacheStorage } from '../cache';

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

describe('CacheStorage', () => {
  let storage: CacheStorage;
  let mockNow: number;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset singleton
    (CacheStorage as any).instance = null;
    storage = CacheStorage.getInstance();

    // Mock Date.now()
    mockNow = 1000000;
    jest.spyOn(Date, 'now').mockReturnValue(mockNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = CacheStorage.getInstance();
      const instance2 = CacheStorage.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('setWithTTL', () => {
    it('should store value with TTL', () => {
      const value = { data: 'test' };
      const ttlSeconds = 3600; // 1 hour

      storage.setWithTTL('key', value, ttlSeconds);

      expect(storage.mmkv.set).toHaveBeenCalledWith(
        'key',
        JSON.stringify({
          value,
          timestamp: mockNow,
          ttl: ttlSeconds * 1000,
        })
      );
    });

    it('should handle storage errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (storage.mmkv.set as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => storage.setWithTTL('key', 'value', 60)).toThrow('Storage error');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('get with TTL', () => {
    it('should return value if not expired', () => {
      const value = { data: 'test' };
      const entry = {
        value,
        timestamp: mockNow - 1000, // 1 second ago
        ttl: 3600000, // 1 hour
      };

      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify(entry));

      expect(storage.get('key')).toEqual(value);
    });

    it('should return null and delete if expired', () => {
      const entry = {
        value: { data: 'test' },
        timestamp: mockNow - 7200000, // 2 hours ago
        ttl: 3600000, // 1 hour TTL
      };

      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify(entry));

      expect(storage.get('key')).toBeNull();
      expect(storage.mmkv.delete).toHaveBeenCalledWith('key');
    });

    it('should return value for entries without TTL', () => {
      const value = { data: 'test' };
      const entry = {
        value,
        timestamp: mockNow,
      };

      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify(entry));

      expect(storage.get('key')).toEqual(value);
    });

    it('should return default value if key not found', () => {
      (storage.mmkv.getString as jest.Mock).mockReturnValue(undefined);

      expect(storage.get('key', 'default')).toBe('default');
    });

    it('should handle parse errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (storage.mmkv.getString as jest.Mock).mockReturnValue('invalid json');

      expect(storage.get('key')).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('set without TTL', () => {
    it('should store value without TTL', () => {
      const value = { data: 'test' };

      storage.set('key', value);

      expect(storage.mmkv.set).toHaveBeenCalledWith(
        'key',
        JSON.stringify({
          value,
          timestamp: mockNow,
        })
      );
    });
  });

  describe('clearExpired', () => {
    it('should remove expired entries', () => {
      const keys = ['key1', 'key2', 'key3'];
      const entries = {
        key1: JSON.stringify({
          value: 'data1',
          timestamp: mockNow - 7200000, // 2 hours ago
          ttl: 3600000, // 1 hour TTL - expired
        }),
        key2: JSON.stringify({
          value: 'data2',
          timestamp: mockNow - 1000, // 1 second ago
          ttl: 3600000, // 1 hour TTL - not expired
        }),
        key3: JSON.stringify({
          value: 'data3',
          timestamp: mockNow,
          // No TTL - never expires
        }),
      };

      (storage.mmkv.getAllKeys as jest.Mock).mockReturnValue(keys);
      (storage.mmkv.getString as jest.Mock).mockImplementation(
        (key: string) => entries[key as keyof typeof entries]
      );

      storage.clearExpired();

      expect(storage.mmkv.delete).toHaveBeenCalledTimes(1);
      expect(storage.mmkv.delete).toHaveBeenCalledWith('key1');
    });

    it('should handle errors during expiration check', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (storage.mmkv.getAllKeys as jest.Mock).mockReturnValue(['key1']);
      (storage.mmkv.getString as jest.Mock).mockReturnValue('invalid json');

      storage.clearExpired();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getExpiration', () => {
    it('should return expiration time for entry with TTL', () => {
      const entry = {
        value: 'data',
        timestamp: mockNow,
        ttl: 3600000, // 1 hour
      };

      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify(entry));

      expect(storage.getExpiration('key')).toBe(mockNow + 3600000);
    });

    it('should return null for entry without TTL', () => {
      const entry = {
        value: 'data',
        timestamp: mockNow,
      };

      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify(entry));

      expect(storage.getExpiration('key')).toBeNull();
    });

    it('should return null if key not found', () => {
      (storage.mmkv.getString as jest.Mock).mockReturnValue(undefined);

      expect(storage.getExpiration('key')).toBeNull();
    });
  });

  describe('getRemainingTTL', () => {
    it('should return remaining TTL in seconds', () => {
      const entry = {
        value: 'data',
        timestamp: mockNow - 1800000, // 30 minutes ago
        ttl: 3600000, // 1 hour TTL
      };

      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify(entry));

      expect(storage.getRemainingTTL('key')).toBe(1800); // 30 minutes remaining
    });

    it('should return 0 for expired entries', () => {
      const entry = {
        value: 'data',
        timestamp: mockNow - 7200000, // 2 hours ago
        ttl: 3600000, // 1 hour TTL
      };

      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify(entry));

      expect(storage.getRemainingTTL('key')).toBe(0);
    });

    it('should return null for entries without TTL', () => {
      const entry = {
        value: 'data',
        timestamp: mockNow,
      };

      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify(entry));

      expect(storage.getRemainingTTL('key')).toBeNull();
    });
  });

  describe('evictOldest', () => {
    it('should evict oldest entries when size exceeds limit', () => {
      const keys = ['key1', 'key2', 'key3'];
      const entries = {
        key1: JSON.stringify({ value: 'a'.repeat(10), timestamp: mockNow - 3000 }), // oldest
        key2: JSON.stringify({ value: 'b'.repeat(10), timestamp: mockNow - 2000 }),
        key3: JSON.stringify({ value: 'c'.repeat(10), timestamp: mockNow - 1000 }), // newest
      };

      (storage.mmkv.getAllKeys as jest.Mock).mockReturnValue(keys);
      (storage.mmkv.getString as jest.Mock).mockImplementation(
        (key: string) => entries[key as keyof typeof entries]
      );

      // Mock getSize to return a value over the limit
      jest.spyOn(storage, 'getSize').mockReturnValue(40);

      storage.evictOldest(35); // Set max size to 35 bytes

      expect(storage.mmkv.delete).toHaveBeenCalledWith('key1');
    });

    it('should not evict if under size limit', () => {
      jest.spyOn(storage, 'getSize').mockReturnValue(10);

      storage.evictOldest(20);

      expect(storage.mmkv.delete).not.toHaveBeenCalled();
    });

    it('should handle parse errors during eviction', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (storage.mmkv.getAllKeys as jest.Mock).mockReturnValue(['key1']);
      (storage.mmkv.getString as jest.Mock).mockReturnValue('invalid json');
      jest.spyOn(storage, 'getSize').mockReturnValue(30);

      storage.evictOldest(20);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
