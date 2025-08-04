import { StorageManager } from '../manager';
import { PreferencesStorage } from '../preferences';
import { CacheStorage } from '../cache';
import { SecureStorage } from '../secure';
import { TempStorage } from '../temp';

// Mock expo-crypto before importing anything that uses it
jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('mock-uuid-1234'),
}));

// Mock all storage implementations
jest.mock('../preferences', () => ({
  PreferencesStorage: {
    getInstance: jest.fn(),
  },
}));
jest.mock('../cache', () => ({
  CacheStorage: {
    getInstance: jest.fn(),
  },
}));
jest.mock('../secure', () => ({
  SecureStorage: {
    getInstance: jest.fn(),
  },
}));
jest.mock('../temp', () => ({
  TempStorage: {
    getInstance: jest.fn(),
  },
}));

describe('StorageManager', () => {
  let manager: StorageManager;
  let mockPreferences: jest.Mocked<PreferencesStorage>;
  let mockCache: jest.Mocked<CacheStorage>;
  let mockSecure: jest.Mocked<SecureStorage>;
  let mockTemp: jest.Mocked<TempStorage>;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Reset singleton
    (StorageManager as any).instance = null;
    (StorageManager as any).initializationPromise = null;

    // Create mock instances
    mockPreferences = {
      clear: jest.fn(),
      getSize: jest.fn().mockReturnValue(1024),
      getAllKeys: jest.fn().mockReturnValue(['theme', 'language']),
      get: jest.fn((key: string) => {
        const data: { [key: string]: any } = { theme: 'dark', language: 'en' };
        return data[key];
      }),
      set: jest.fn(),
      delete: jest.fn(),
      contains: jest.fn(),
      mmkv: {
        clearAll: jest.fn(),
      },
    } as any;

    mockCache = {
      clear: jest.fn(),
      getSize: jest.fn().mockReturnValue(2048),
      getAllKeys: jest.fn().mockReturnValue(['user_profile', 'products']),
      get: jest.fn((key: string) => {
        const data: { [key: string]: any } = {
          user_profile: { name: 'John' },
          products: ['product1', 'product2'],
        };
        return data[key];
      }),
      set: jest.fn(),
      delete: jest.fn(),
      contains: jest.fn(),
      clearExpired: jest.fn(),
      evictOldest: jest.fn(),
      getExpiration: jest.fn((key) => {
        if (key === 'products') return Date.now() + 86400000;
        return null;
      }),
      mmkv: {
        clearAll: jest.fn(),
      },
    } as any;

    mockSecure = {
      clear: jest.fn(),
      getSize: jest.fn().mockReturnValue(512),
      getAllKeys: jest.fn().mockReturnValue(['authToken', 'apiKey_stripe']),
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      contains: jest.fn(),
      clearAuth: jest.fn(),
      mmkv: {
        clearAll: jest.fn(),
      },
    } as any;

    mockTemp = {
      clear: jest.fn(),
      getSize: jest.fn().mockReturnValue(256),
      getAllKeys: jest.fn().mockReturnValue(['navigation_state', 'form_draft']),
      get: jest.fn((key: string) => {
        const data: { [key: string]: any } = {
          navigation_state: '/home',
          form_draft: { field: 'value' },
        };
        return data[key];
      }),
      set: jest.fn(),
      delete: jest.fn(),
      contains: jest.fn(),
      initialize: jest.fn(),
      mmkv: {
        clearAll: jest.fn(),
      },
    } as any;

    // Mock getInstance methods to return our mock instances
    (PreferencesStorage.getInstance as jest.Mock).mockReturnValue(mockPreferences);
    (CacheStorage.getInstance as jest.Mock).mockReturnValue(mockCache);
    (SecureStorage.getInstance as jest.Mock).mockResolvedValue(mockSecure);
    (TempStorage.getInstance as jest.Mock).mockReturnValue(mockTemp);

    manager = await StorageManager.initialize();
  });

  describe('singleton pattern', () => {
    it('should return the same instance after initialization', async () => {
      const instance1 = await StorageManager.initialize();
      const instance2 = await StorageManager.initialize();
      expect(instance1).toBe(instance2);
    });

    it('should use getInstance after initialization', () => {
      // Since manager was initialized in beforeEach, getInstance should work
      const instance = StorageManager.getInstance();
      expect(instance).toBe(manager);
    });

    it('should throw error if getInstance is called before initialization', () => {
      // Reset singleton
      (StorageManager as any).instance = null;
      (StorageManager as any).initializationPromise = null;

      expect(() => StorageManager.getInstance()).toThrow(
        'StorageManager not initialized. Call StorageManager.initialize() first.'
      );
    });
  });

  describe('storage tier access', () => {
    it('should provide access to all storage tiers', () => {
      expect(manager.preferences).toBe(mockPreferences);
      expect(manager.cache).toBe(mockCache);
      expect(manager.secure).toBe(mockSecure);
      expect(manager.temp).toBe(mockTemp);
    });
  });

  describe('performStartupCleanup', () => {
    it('should initialize temp storage and clear expired cache', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      manager.performStartupCleanup();

      expect(mockTemp.initialize).toHaveBeenCalled();
      expect(mockCache.clearExpired).toHaveBeenCalled();
      expect(mockCache.evictOldest).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Initializing storage...');
      expect(consoleSpy).toHaveBeenCalledWith('Storage cleanup completed successfully');

      consoleSpy.mockRestore();
    });
  });

  describe('clearAll', () => {
    it('should clear all storage tiers', () => {
      manager.clearAll();

      expect(mockPreferences.clear).toHaveBeenCalled();
      expect(mockCache.clear).toHaveBeenCalled();
      expect(mockSecure.clear).toHaveBeenCalled();
      expect(mockTemp.clear).toHaveBeenCalled();
    });
  });

  describe('clearUserData', () => {
    it('should clear secure and user-specific cache data', () => {
      mockCache.getAllKeys.mockReturnValue([
        'user_profile',
        'user_settings',
        'auth_token',
        'products',
        'categories',
      ]);

      manager.clearUserData();

      expect(mockSecure.clear).toHaveBeenCalled();
      expect(mockCache.delete).toHaveBeenCalledWith('user_profile');
      expect(mockCache.delete).toHaveBeenCalledWith('user_settings');
      expect(mockCache.delete).toHaveBeenCalledWith('auth_token');
      expect(mockCache.delete).not.toHaveBeenCalledWith('products');
      expect(mockCache.delete).not.toHaveBeenCalledWith('categories');
      expect(mockTemp.clear).toHaveBeenCalled();
    });
  });

  describe('getStorageSizes', () => {
    it('should return sizes for all storage tiers', () => {
      const sizes = manager.getStorageSizes();

      expect(sizes).toEqual({
        preferences: 1024,
        cache: 2048,
        secure: 512,
        temp: 256,
        total: 3840,
      });
    });
  });

  describe('getTotalSize', () => {
    it('should calculate total storage size', () => {
      expect(manager.getTotalSize()).toBe(3840);
    });
  });

  describe('isStorageFull', () => {
    it('should return true when storage exceeds threshold', () => {
      mockPreferences.getSize.mockReturnValue(20 * 1024 * 1024);
      mockCache.getSize.mockReturnValue(20 * 1024 * 1024);
      mockSecure.getSize.mockReturnValue(5 * 1024 * 1024);
      mockTemp.getSize.mockReturnValue(6 * 1024 * 1024);

      expect(manager.isStorageFull()).toBe(true);
    });

    it('should return false when storage is under threshold', () => {
      expect(manager.isStorageFull()).toBe(false);
    });

    it('should use custom threshold', () => {
      mockCache.getSize.mockReturnValue(101);
      expect(manager.isStorageFull(100)).toBe(true);
      expect(manager.isStorageFull(4000)).toBe(false);
    });
  });

  describe('performMaintenance', () => {
    it('should perform regular maintenance', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      manager.performMaintenance();

      expect(mockCache.clearExpired).toHaveBeenCalled();
      expect(mockCache.evictOldest).not.toHaveBeenCalled(); // Storage not full
      expect(consoleSpy).toHaveBeenCalledWith('Performing storage maintenance...');
      expect(consoleSpy).toHaveBeenCalledWith('Storage sizes:', expect.any(Object));

      consoleSpy.mockRestore();
    });

    it('should evict old cache when storage is full', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Make storage appear full
      mockCache.getSize.mockReturnValue(51 * 1024 * 1024);

      manager.performMaintenance();

      expect(mockCache.clearExpired).toHaveBeenCalled();
      expect(mockCache.evictOldest).toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith('Storage approaching limit, evicting old cache entries');

      consoleSpy.mockRestore();
      warnSpy.mockRestore();
    });
  });

  describe('exportAllData', () => {
    it('should export all data with secure data redacted', () => {
      mockPreferences.get.mockImplementation((key) => {
        if (key === 'theme') return 'dark';
        if (key === 'language') return 'en';
        return null;
      });

      mockCache.get.mockImplementation((key) => {
        if (key === 'user_profile') return { name: 'John' };
        if (key === 'products') return ['product1', 'product2'];
        return null;
      });

      mockTemp.get.mockImplementation((key) => {
        if (key === 'form_draft') return { field: 'value' };
        if (key === 'navigation_state') return '/home';
        return null;
      });

      const exportedData = manager.exportAllData();

      expect(exportedData).toEqual({
        preferences: {
          theme: 'dark',
          language: 'en',
        },
        cache: {
          user_profile: { name: 'John' },
          products: ['product1', 'product2'],
        },
        secure: {
          authToken: '***REDACTED***',
          apiKey_stripe: '***REDACTED***',
        },
        temp: {
          form_draft: { field: 'value' },
          navigation_state: '/home',
        },
      });
    });
  });

  describe('getStatistics', () => {
    it('should return storage statistics', () => {
      mockCache.getExpiration.mockImplementation((key) => {
        if (key === 'user_profile') return Date.now() + 3600000;
        if (key === 'products') return Date.now() + 1800000;
        return null;
      });

      const stats = manager.getStatistics();

      expect(stats.itemCounts).toEqual({
        preferences: 2,
        cache: 2,
        secure: 2,
        temp: 2,
      });

      expect(stats.sizes).toEqual({
        preferences: 1024,
        cache: 2048,
        secure: 512,
        temp: 256,
        total: 3840,
      });

      expect(stats.oldestCacheEntry).toBeGreaterThan(Date.now());
    });

    it('should handle no cache entries with expiration', () => {
      mockCache.getExpiration.mockReturnValue(null);

      const stats = manager.getStatistics();

      expect(stats.oldestCacheEntry).toBeNull();
    });
  });
});
