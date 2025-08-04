# MMKV Storage Usage Guide

## Overview

This guide provides practical usage examples and best practices for the MMKV storage system. For architectural design details and system configuration, see the [Storage Design Documentation](./storage-design.md).

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

Storage requires async initialization due to expo-secure-store encryption key management:

```typescript
import { initializeStorage, InitializationError } from '@/services/storage';

// Called automatically in _layout.tsx with proper error handling
useEffect(() => {
  const initStorage = async () => {
    try {
      await initializeStorage();
    } catch (error) {
      if (error instanceof InitializationError) {
        // Show error screen to user
        setStorageError('Storage initialization failed. Please restart the app.');
      } else {
        console.error('Unexpected initialization error:', error);
      }
    }
  };
  initStorage();
}, []);

// Manual initialization
try {
  const storage = await initializeStorage();
  // Storage ready to use
} catch (error) {
  // Handle initialization failure
}
```

**Important**: Storage operations will throw typed errors if initialization fails or operations encounter issues. The secure storage tier requires async key retrieval from expo-secure-store.

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
// Good: User preferences in preferences storage
Storage.preferences.setTheme('dark');

// Bad: Auth token in preferences (use secure instead)
Storage.preferences.set('authToken', token);

// Good: API response in cache with TTL
Storage.cache.setWithTTL('products', data, 3600);

// Bad: Form draft in cache (use temp instead)
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

### 3. Handle Storage Errors with Typed Errors

```typescript
import { EncryptionError, IOError, DeserializationError } from '@/services/storage';

// Writing with error handling
try {
  Storage.secure.setSecure('sensitiveData', data);
} catch (error) {
  if (error instanceof EncryptionError) {
    redirectToLogin('Security settings changed. Please log in again.');
  } else if (error instanceof IOError) {
    scheduleRetry(() => Storage.secure.setSecure('sensitiveData', data));
  }
}

// Reading with error handling
try {
  return Storage.cache.get('user_profile');
} catch (error) {
  if (error instanceof DeserializationError) {
    Storage.cache.delete('user_profile');
    return refetchUserProfile();
  }
  return null;
}
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
// Check storage size and clean up if needed
const sizes = Storage.getStorageSizes();
if (sizes.total > 40 * 1024 * 1024) {
  Storage.cache.evictOldest();
}
```

## Encryption Key Management

Encryption keys are managed automatically by the storage system using platform-native security features. See the [Storage Design Documentation](./storage-design.md#encryption-key-management) for technical implementation details.

### Key Rotation (Future Feature)

**Note: Key rotation is not yet implemented and will be available in a future release.**

```typescript
// TODO: Coming in future release
// await Storage.secure.rotateEncryptionKey();

// Planned key rotation process:
// 1. Backup existing data
// 2. Generate new encryption key
// 3. Create new MMKV instance
// 4. Migrate data to new instance
// 5. Update key in expo-secure-store

// Use cases for key rotation:
// - Scheduled security maintenance (e.g., every 90 days)
// - Response to security incidents
// - Compliance requirements (PCI-DSS, HIPAA)
// - User-requested security enhancement
```

### Error Handling

The storage system now uses robust error handling instead of silent fallbacks:

```typescript
import { initializeStorage, InitializationError } from '@/services/storage';

try {
  await initializeStorage();
} catch (error) {
  if (error instanceof InitializationError) {
    // Critical storage failure - show error to user
    showErrorScreen('Storage initialization failed. Please restart the app.');
  }
}
```

## Migration from AsyncStorage

If migrating from AsyncStorage:

```typescript
// Old AsyncStorage code
await AsyncStorage.setItem('theme', 'dark');
const theme = await AsyncStorage.getItem('theme');

// New MMKV code (synchronous after initialization!)
Storage.preferences.setTheme('dark');
const theme = Storage.preferences.getTheme();

// Note: Initialization is async due to expo-secure-store
await initializeStorage();
```

## Troubleshooting

### Storage not persisting

- Ensure you're using the correct tier:
  - **Preferences**: True persistence across reinstalls
  - **Secure**: Persistence across reinstalls (encrypted)
  - **Cache**: May be cleared if expired
  - **Temp**: Always cleared on app restart
- Check if the app has necessary permissions

### Encryption errors

- Secure storage uses expo-secure-store for encryption key management
- Keys are stored in iOS Keychain (iOS) or Android Keystore (Android)
- 256-bit cryptographically secure keys generated using expo-crypto
- Keys persist across app updates but not app uninstalls
- **No fallback mechanism**: Encryption failures throw `EncryptionError` for proper handling

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

### expo-secure-store issues

- **Storage initialization fails**: Check device security settings (passcode/biometrics enabled). App will show error screen with `InitializationError`
- **Encryption errors**: Handle `EncryptionError` by clearing secure storage and prompting re-authentication
- **Key rotation errors**: Ensure sufficient storage space and device unlock state
- **iOS Keychain access**: Requires device to be unlocked (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`)
- **Android Keystore**: May fail on older devices or custom ROMs without hardware security

#### Common Failure Scenarios and Solutions

The following table outlines common `expo-secure-store` failure scenarios and their recommended handling strategies:

| Failure Scenario                 | Core Issue                                                                | Recommended Strategy                                                                                                                                                                  |
| :------------------------------- | :------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1. Device Lock State**         | App tries to access keychain data while device is locked                  | **Prevention & Graceful Degradation**: Use correct `keychainAccessible` setting (`AFTER_FIRST_UNLOCK`). For background operations, check `AppState` and retry when app becomes active |
| **2. Security Settings Changed** | User removed PIN/biometrics causing Android Keystore to clear keys        | **Detect & Force Re-auth**: Catch `InitializationError` on startup. Clear stale secure data and force user re-login                                                                   |
| **3. Platform-Specific Errors**  | Device manufacturer issues (Samsung, Xiaomi) with Keystore implementation | **Monitor & Remote Config**: Use error monitoring (Sentry) with device info. Use feature flags to gracefully disable features on problematic devices                                  |
| **4. Data Size Limits**          | Attempting to store large data (>few KB) in `SecureStore`                 | **Architectural Fix**: Never store large data directly. Generate encryption key, encrypt large files in `expo-file-system`, store only the **encryption key** in `SecureStore`        |
| **5. Device Migration**          | User restores app data to new device                                      | **Detect & Force Re-auth**: Hardware-bound keys can't migrate. Catch initialization failure, clear data, guide user to re-login                                                       |
| **6. System-Level Failures**     | Disk full or OS instability                                               | **Notify User**: Show clear message like "System storage full, please clean up and restart app"                                                                                       |

#### Key Handling Strategies

**Device Lock State**: Use `AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY` setting. For background operations, check `AppState` and retry when app becomes active.

**Security Changes / Device Migration**: Catch `InitializationError`, clear corrupted data, force re-login with user-friendly message.

**Platform-Specific Errors**: Use error monitoring (Sentry) with device context. Implement feature flags for graceful degradation on problematic devices.

**Large Data Encryption**: Never store large data directly in SecureStore. Instead: generate encryption key → encrypt file in `expo-file-system` → store only the key in SecureStore.

**System Failures**: Show clear user messages for storage issues with actionable options (check storage, retry, etc.).

#### Error Recovery Examples

```typescript
// Basic initialization error handling
try {
  await initializeStorage();
} catch (error) {
  if (error instanceof InitializationError) {
    // Log, clear corrupted data, show user-friendly error
    Storage.secure.clear();
    setAppError('Storage initialization failed. Please restart the app.');
  }
}

// Runtime encryption error handling
try {
  Storage.secure.setAuthToken(token);
} catch (error) {
  if (error instanceof EncryptionError) {
    Storage.secure.clearAuth();
    redirectToLogin('Security settings changed. Please log in again.');
  }
}
```
