import { MMKV } from 'react-native-mmkv';
import { MMKVAdapter } from './mmkv-adapter';
import type { IStorage } from './types';

export class PreferencesStorage extends MMKVAdapter implements IStorage {
  private static instance: PreferencesStorage | null = null;

  constructor() {
    super({
      id: 'preferences',
      path: `${MMKV.appGroupPath}/backup`,
    });
  }

  static getInstance(): PreferencesStorage {
    if (!PreferencesStorage.instance) {
      PreferencesStorage.instance = new PreferencesStorage();
    }
    return PreferencesStorage.instance;
  }

  // Additional methods specific to preferences can be added here
  // For example, typed preference getters/setters

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.set('theme', theme);
  }

  getTheme(): 'light' | 'dark' | 'system' {
    return this.get('theme', 'system');
  }

  setLanguage(language: string): void {
    this.set('language', language);
  }

  getLanguage(): string {
    return this.get('language', 'en');
  }

  setNotificationsEnabled(enabled: boolean): void {
    this.set('notificationsEnabled', enabled);
  }

  getNotificationsEnabled(): boolean {
    return this.get('notificationsEnabled', true);
  }

  setOnboardingCompleted(completed: boolean): void {
    this.set('onboardingCompleted', completed);
  }

  getOnboardingCompleted(): boolean {
    return this.get('onboardingCompleted', false);
  }
}
