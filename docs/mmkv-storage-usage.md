# MMKV Storage Usage Guide

## Overview

The MMKV storage implementation provides four distinct storage tiers, each optimized for specific use cases:

- **Preferences**: Persistent user settings with backup support
- **Cache**: Performance optimization with TTL support (backed up, but expired data cleared)
- **Secure**: Encrypted storage for sensitive data (backed up and restored)
- **Temp**: Session-only storage cleared on app restart (backed up, but always cleared)

## Quick Start

```typescript
import { Storage } from '@/services/storage';

// Access storage tiers directly
Storage.preferences.set('theme', 'dark');
Storage.cache.setWithTTL('userProfile', userData, 86400); // 1 day TTL
Storage.secure.setAuthToken('my-secret-token');
Storage.temp.setFormDraft('contact', formData);
```

## Storage Tiers

### Preferences Storage

Use for persistent user settings that should survive app reinstalls:

```typescript
import { Storage } from '@/services/storage';

// Set preferences
Storage.preferences.setTheme('dark');
Storage.preferences.setLanguage('en');
Storage.preferences.setNotificationsEnabled(true);
Storage.preferences.setOnboardingCompleted(true);

// Get preferences
const theme = Storage.preferences.getTheme(); // 'dark' | 'light' | 'system'
const language = Storage.preferences.getLanguage(); // default: 'en'
const notificationsEnabled = Storage.preferences.getNotificationsEnabled(); // default: true

// Generic key-value storage
Storage.preferences.set('customSetting', { value: 42 });
const customSetting = Storage.preferences.get('customSetting');
```

### Cache Storage with TTL

Use for API responses and frequently accessed data:

```typescript
import { Storage } from '@/services/storage';

// Set cache with TTL (Time To Live)
Storage.cache.setWithTTL('userProfile', userData, 86400); // 24 hours
Storage.cache.setWithTTL('productList', products, 3600); // 1 hour
Storage.cache.setWithTTL('searchResults', results, 300); // 5 minutes

// Get cached data (automatically checks expiration)
const profile = Storage.cache.get('userProfile');
if (!profile) {
  // Cache miss or expired - fetch fresh data
  const freshData = await fetchUserProfile();
  Storage.cache.setWithTTL('userProfile', freshData, 86400);
}

// Check remaining TTL
const remainingSeconds = Storage.cache.getRemainingTTL('userProfile');

// Manually clear expired entries
Storage.cache.clearExpired();

// Cache without TTL (permanent until manually cleared)
Storage.cache.set('staticConfig', config);
```

### Secure Storage

Use for sensitive data like tokens and credentials. **Note**: Secure storage is backed up and restored (encrypted), making it suitable for data that should persist across device migrations:

```typescript
import { Storage } from '@/services/storage';

// Authentication tokens
Storage.secure.setAuthToken('bearer-token-123');
Storage.secure.setRefreshToken('refresh-token-456');
const authToken = Storage.secure.getAuthToken();

// API keys
Storage.secure.setApiKey('stripe', 'sk_test_...');
const stripeKey = Storage.secure.getApiKey('stripe');

// User credentials
Storage.secure.setCredentials('user@example.com', 'hashedPassword');
const credentials = Storage.secure.getCredentials();

// Clear all auth data on logout
Storage.secure.clearAuth();

// Generic secure storage
Storage.secure.setSecure('privateKey', { key: 'value' });
const privateData = Storage.secure.getSecure('privateKey');
```

### Temporary Storage

Use for session-only data that should be cleared on app restart. **Note**: While technically backed up, temp data is always cleared when the app starts, achieving the effect of "not backed up":

```typescript
import { Storage } from '@/services/storage';

// Form drafts
Storage.temp.setFormDraft('contact', {
  name: 'John Doe',
  email: 'john@example.com',
});
const draft = Storage.temp.getFormDraft('contact');
Storage.temp.deleteFormDraft('contact');

// Navigation state
Storage.temp.setNavigationState({
  currentRoute: '/products',
  scrollPosition: 150,
});

// Search filters
Storage.temp.setSearchFilters('productList', {
  category: 'electronics',
  priceRange: [0, 100],
});

// UI state
Storage.temp.setUIState('productModal', {
  isOpen: true,
  selectedId: '456',
});

// Session data
Storage.temp.setSessionData('viewHistory', ['product1', 'product2']);
```

## Storage Management

### Initialization

Storage is automatically initialized when the app starts, but you can manually initialize:

```typescript
import { initializeStorage } from '@/services/storage';

// Called automatically in _layout.tsx
initializeStorage();
```

### Monitoring Storage Size

```typescript
import { Storage } from '@/services/storage';

// Get individual storage sizes
const sizes = Storage.getStorageSizes();
console.log('Storage sizes:', {
  preferences: `${(sizes.preferences / 1024).toFixed(2)} KB`,
  cache: `${(sizes.cache / 1024).toFixed(2)} KB`,
  secure: `${(sizes.secure / 1024).toFixed(2)} KB`,
  temp: `${(sizes.temp / 1024).toFixed(2)} KB`,
  total: `${(sizes.total / 1024).toFixed(2)} KB`,
});

// Check if approaching storage limits
if (Storage.isStorageFull()) {
  // Perform cleanup
  Storage.performMaintenance();
}

// Get detailed statistics
const stats = Storage.getStatistics();
console.log('Item counts:', stats.itemCounts);
console.log('Oldest cache entry:', new Date(stats.oldestCacheEntry));
```

### Data Management

```typescript
import { Storage } from '@/services/storage';

// Clear all storage (factory reset)
Storage.clearAll();

// Clear user data only (logout)
Storage.clearUserData();

// Export all data (for debugging)
const allData = Storage.exportAllData();
console.log('Exported data:', allData);

// Manual maintenance
Storage.performMaintenance();
```

## Best Practices

### 1. Choose the Right Storage Tier

```typescript
// ✅ Good: User preferences in preferences storage
Storage.preferences.setTheme('dark');

// ❌ Bad: Auth token in preferences (use secure instead)
Storage.preferences.set('authToken', token);

// ✅ Good: API response in cache with TTL
Storage.cache.setWithTTL('products', data, 3600);

// ❌ Bad: Form draft in cache (use temp instead)
Storage.cache.set('formDraft', draft);
```

### 2. Set Appropriate TTLs

```typescript
// User profiles: Update daily
Storage.cache.setWithTTL('userProfile', profile, 86400); // 24 hours

// Product lists: Update hourly
Storage.cache.setWithTTL('products', products, 3600); // 1 hour

// Real-time data: Update frequently
Storage.cache.setWithTTL('stockPrices', prices, 60); // 1 minute
```

### 3. Handle Storage Errors

```typescript
try {
  Storage.secure.setSecure('sensitiveData', data);
} catch (error) {
  console.error('Failed to store secure data:', error);
  // Handle encryption failure
}

// Safe getter with default
const theme = Storage.preferences.get('theme', 'light');
```

### 4. Clean Up Unused Data

```typescript
// Clear specific temp data when done
Storage.temp.deleteFormDraft('completed-form');

// Clear expired cache periodically
Storage.cache.clearExpired();

// Clear user data on logout
Storage.secure.clearAuth();
Storage.temp.clear();
```

### 5. Monitor Storage Usage

```typescript
// Check storage size periodically
const checkStorage = () => {
  const sizes = Storage.getStorageSizes();
  if (sizes.total > 40 * 1024 * 1024) {
    // 40MB warning
    console.warn('Storage usage high:', sizes);
    Storage.cache.evictOldest();
  }
};

// Run check on app foreground
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    checkStorage();
  }
});
```

## Migration from AsyncStorage

If migrating from AsyncStorage:

```typescript
// Old AsyncStorage code
await AsyncStorage.setItem('theme', 'dark');
const theme = await AsyncStorage.getItem('theme');

// New MMKV code (synchronous!)
Storage.preferences.setTheme('dark');
const theme = Storage.preferences.getTheme();
```

## Performance Comparison

| Operation   | MMKV   | AsyncStorage | Improvement |
| ----------- | ------ | ------------ | ----------- |
| Write       | ~0.3ms | ~10ms        | 33x faster  |
| Read        | ~0.1ms | ~3ms         | 30x faster  |
| Batch (100) | ~30ms  | ~1000ms      | 33x faster  |

## Troubleshooting

### Storage not persisting

- Ensure you're using the correct tier:
  - **Preferences**: True persistence across reinstalls
  - **Secure**: Persistence across reinstalls (encrypted)
  - **Cache**: May be cleared if expired
  - **Temp**: Always cleared on app restart
- Check if the app has necessary permissions

### Encryption errors

- Secure storage requires a valid encryption key
- Key is generated on first use and stored in memory
- Consider implementing proper key management for production

### Performance issues

- Use `clearExpired()` regularly for cache
- Monitor storage size with `getStorageSizes()`
- Implement `evictOldest()` when approaching limits

### Data not clearing

- Temp storage only clears on app restart (not manually)
- Cache data persists until expired or manually cleared
- Secure data persists across restores (validate tokens after restore)
- Use `clearAll()` for factory reset
- Use `clearUserData()` for logout scenarios
