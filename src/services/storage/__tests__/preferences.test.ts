import { PreferencesStorage } from '../preferences';

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

describe('PreferencesStorage', () => {
  let storage: PreferencesStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset singleton
    (PreferencesStorage as any).instance = null;
    storage = PreferencesStorage.getInstance();
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = PreferencesStorage.getInstance();
      const instance2 = PreferencesStorage.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('theme preferences', () => {
    it('should set and get theme', () => {
      storage.setTheme('dark');
      expect(storage.mmkv.set).toHaveBeenCalledWith('theme', JSON.stringify('dark'));
    });

    it('should return default theme when not set', () => {
      (storage.mmkv.getString as jest.Mock).mockReturnValue(undefined);
      expect(storage.getTheme()).toBe('system');
    });

    it('should get stored theme', () => {
      (storage.mmkv.getString as jest.Mock).mockReturnValue(JSON.stringify('light'));
      expect(storage.getTheme()).toBe('light');
    });
  });

  describe('language preferences', () => {
    it('should set and get language', () => {
      storage.setLanguage('es');
      expect(storage.mmkv.set).toHaveBeenCalledWith('language', JSON.stringify('es'));
    });

    it('should return default language when not set', () => {
      (storage.mmkv.getString as jest.Mock).mockReturnValue(undefined);
      expect(storage.getLanguage()).toBe('en');
    });
  });

  describe('notification preferences', () => {
    it('should set and get notifications enabled', () => {
      storage.setNotificationsEnabled(false);
      expect(storage.mmkv.set).toHaveBeenCalledWith('notificationsEnabled', JSON.stringify(false));
    });

    it('should return default notifications setting when not set', () => {
      (storage.mmkv.getString as jest.Mock).mockReturnValue(undefined);
      expect(storage.getNotificationsEnabled()).toBe(true);
    });
  });

  describe('onboarding preferences', () => {
    it('should set and get onboarding completed', () => {
      storage.setOnboardingCompleted(true);
      expect(storage.mmkv.set).toHaveBeenCalledWith('onboardingCompleted', JSON.stringify(true));
    });

    it('should return default onboarding status when not set', () => {
      (storage.mmkv.getString as jest.Mock).mockReturnValue(undefined);
      expect(storage.getOnboardingCompleted()).toBe(false);
    });
  });

  describe('generic storage operations', () => {
    it('should store and retrieve complex objects', () => {
      const complexData = {
        settings: {
          notifications: true,
          theme: 'dark',
          language: 'en',
        },
        userData: {
          preferences: ['feature1', 'feature2'],
        },
      };

      storage.set('complexData', complexData);
      expect(storage.mmkv.set).toHaveBeenCalledWith('complexData', JSON.stringify(complexData));
    });

    it('should throw IOError when MMKV storage fails', () => {
      (storage.mmkv.set as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => storage.set('key', 'value')).toThrow(
        'Failed to write to MMKV for key "key" in tier "preferences"'
      );

      try {
        storage.set('key', 'value');
      } catch (error: any) {
        expect(error.name).toBe('IOError');
        expect(error.operation).toBe('write');
        expect(error.tier).toBe('preferences');
        expect(error.key).toBe('key');
      }
    });

    it('should clear all preferences', () => {
      storage.clear();
      expect(storage.mmkv.clearAll).toHaveBeenCalled();
    });

    it('should check if key exists', () => {
      (storage.mmkv.contains as jest.Mock).mockReturnValue(true);
      expect(storage.contains('theme')).toBe(true);
      expect(storage.mmkv.contains).toHaveBeenCalledWith('theme');
    });

    it('should get all keys', () => {
      const mockKeys = ['theme', 'language', 'notificationsEnabled'];
      (storage.mmkv.getAllKeys as jest.Mock).mockReturnValue(mockKeys);

      expect(storage.getAllKeys()).toEqual(mockKeys);
    });

    it('should delete a key', () => {
      storage.delete('theme');
      expect(storage.mmkv.delete).toHaveBeenCalledWith('theme');
    });
  });

  describe('storage size calculation', () => {
    it('should calculate storage size', () => {
      const mockKeys = ['key1', 'key2'];
      const mockValues = {
        key1: JSON.stringify({ data: 'value1' }),
        key2: JSON.stringify({ data: 'value2' }),
      };

      (storage.mmkv.getAllKeys as jest.Mock).mockReturnValue(mockKeys);
      (storage.mmkv.getString as jest.Mock).mockImplementation(
        (key: string) => mockValues[key as keyof typeof mockValues]
      );

      const size = storage.getSize();
      const expectedSize = mockValues.key1.length + mockValues.key2.length;
      expect(size).toBe(expectedSize);
    });

    it('should handle missing values in size calculation', () => {
      (storage.mmkv.getAllKeys as jest.Mock).mockReturnValue(['key1', 'key2']);
      (storage.mmkv.getString as jest.Mock).mockReturnValue(undefined);

      expect(storage.getSize()).toBe(0);
    });
  });
});
