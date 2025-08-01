import { MMKV } from 'react-native-mmkv';
import { MMKVAdapter } from './mmkv-adapter';
import type { IStorage } from './types';

export class TempStorage extends MMKVAdapter implements IStorage {
  private static instance: TempStorage | null = null;

  constructor() {
    super({
      id: 'temp',
      path: `${MMKV.appGroupPath}/no-backup`,
    });
  }

  static getInstance(): TempStorage {
    if (!TempStorage.instance) {
      TempStorage.instance = new TempStorage();
    }
    return TempStorage.instance;
  }

  // Initialize by clearing all data (called on app startup)
  initialize(): void {
    this.clear();
  }

  // Convenience methods for common temporary data

  setFormDraft(formId: string, data: Record<string, any>): void {
    this.set(`form_draft_${formId}`, data);
  }

  getFormDraft(formId: string): Record<string, any> | null {
    return this.get(`form_draft_${formId}`);
  }

  deleteFormDraft(formId: string): void {
    this.delete(`form_draft_${formId}`);
  }

  setNavigationState(state: any): void {
    this.set('navigation_state', state);
  }

  getNavigationState(): any | null {
    return this.get('navigation_state');
  }

  setSearchFilters(screenId: string, filters: Record<string, any>): void {
    this.set(`search_filters_${screenId}`, filters);
  }

  getSearchFilters(screenId: string): Record<string, any> | null {
    return this.get(`search_filters_${screenId}`);
  }

  setShoppingCart(items: any[]): void {
    this.set('shopping_cart_guest', items);
  }

  getShoppingCart(): any[] {
    return this.get('shopping_cart_guest', []);
  }

  addToShoppingCart(item: any): void {
    const cart = this.getShoppingCart();
    cart.push(item);
    this.setShoppingCart(cart);
  }

  removeFromShoppingCart(itemId: string): void {
    const cart = this.getShoppingCart();
    const updatedCart = cart.filter((item: any) => item.id !== itemId);
    this.setShoppingCart(updatedCart);
  }

  clearShoppingCart(): void {
    this.delete('shopping_cart_guest');
  }

  // Session data
  setSessionData(key: string, value: any): void {
    this.set(`session_${key}`, value);
  }

  getSessionData(key: string): any | null {
    return this.get(`session_${key}`);
  }

  // Temporary UI state
  setUIState(componentId: string, state: any): void {
    this.set(`ui_state_${componentId}`, state);
  }

  getUIState(componentId: string): any | null {
    return this.get(`ui_state_${componentId}`);
  }

  // Clear specific types of temporary data
  clearFormDrafts(): void {
    const keys = this.getAllKeys();
    keys.forEach((key) => {
      if (key.startsWith('form_draft_')) {
        this.delete(key);
      }
    });
  }

  clearSearchFilters(): void {
    const keys = this.getAllKeys();
    keys.forEach((key) => {
      if (key.startsWith('search_filters_')) {
        this.delete(key);
      }
    });
  }

  clearSessionData(): void {
    const keys = this.getAllKeys();
    keys.forEach((key) => {
      if (key.startsWith('session_')) {
        this.delete(key);
      }
    });
  }

  clearUIState(): void {
    const keys = this.getAllKeys();
    keys.forEach((key) => {
      if (key.startsWith('ui_state_')) {
        this.delete(key);
      }
    });
  }
}
