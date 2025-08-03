# Storage Design with MMKV

## Overview

This document outlines the storage architecture using MMKV as the primary storage solution for the React Native application.

## Why MMKV

- **Performance**: 30-100x faster than AsyncStorage
- **Synchronous API**: No async/await overhead
- **Built-in encryption**: AES CFB-128 support
- **Multi-process support**: Share data between app extensions
- **Small footprint**: ~150KB binary size

## Storage Architecture

### Storage Tiers

#### Preferences

- **Purpose**: Persistent user settings that define app behavior and appearance
- **Examples**: Theme selection, language preference, notification settings, user onboarding status
- **Lifecycle**: Persists across app reinstalls (via system backup)
- **Cleanup**: Manual only, when user explicitly changes settings

#### Cache

- **Purpose**: Performance optimization by storing frequently accessed remote data
- **Examples**: API responses, user profiles, image URLs, search results
- **Lifecycle**: Persists across app restarts but can expire based on TTL
- **Cleanup**: Automatic expiration based on TTL, manual clear via settings, or when storage is full

#### Secure

- **Purpose**: Sensitive data requiring encryption at rest
- **Examples**: Authentication tokens, API keys, user credentials, payment information
- **Lifecycle**: Persists across app restarts and device restores (when encrypted)
- **Backup**: Included in system backups (encrypted)
- **Cleanup**: On user logout, token expiration, or when validation fails after restore
- **Encryption**: Uses MMKV's built-in AES CFB-128 encryption with keys managed by expo-secure-store

#### Temp

- **Purpose**: Transient data relevant only to current app session
- **Examples**: Form drafts, navigation state, search filters, shopping cart (guest)
- **Lifecycle**: Cleared automatically on app restart
- **Cleanup**: Automatic on app launch, no manual intervention needed

### Storage Comparison

| Tier        | Persistence     | Backup | Encryption | TTL Support | Use Case                 |
| ----------- | --------------- | ------ | ---------- | ----------- | ------------------------ |
| preferences | Forever         | ✅     | ❌         | ❌          | User settings            |
| cache       | Until expired   | ❌\*   | ❌         | ✅          | Performance optimization |
| secure      | Until logout    | ✅\*\* | ✅         | ❌          | Sensitive credentials    |
| temp        | Current session | ❌\*   | ❌         | ❌          | Transient state          |

\*Technically backed up, but cleared by application logic after restore  
\*\*Backed up and restored (encrypted), application should validate after restore

### Core Interfaces

```typescript
interface StorageManager {
  preferences: IStorage; // Persistent user preferences
  cache: IStorageWithTTL; // Cached data with expiration
  secure: ISecureStorage; // Encrypted storage
  temp: IStorage; // Temporary storage
}

interface IStorage {
  set<T>(key: string, value: T): void;
  get<T>(key: string, defaultValue?: T): T | null;
  delete(key: string): void;
  clear(): void;
  getAllKeys(): string[];
}

interface IStorageWithTTL extends IStorage {
  setWithTTL<T>(key: string, value: T, ttlSeconds: number): void;
  clearExpired(): void;
}
```

## MMKV Configuration

### Instance Setup

```typescript
const instances = {
  preferences: new MMKV({
    id: 'preferences',
  }),

  cache: new MMKV({
    id: 'cache',
  }),

  secure: new MMKV({
    id: 'secure',
    encryptionKey: 'generated-key',
  }),

  temp: new MMKV({
    id: 'temp',
  }),
};
```

### Backup Strategy

**Implementation approach: Platform backup + Application-level cleanup**

- All MMKV instances store data in the default location (technically all backed up)
- Application logic enforces the intended backup behavior through cleanup strategies
- This approach avoids platform-specific path configuration issues while maintaining design goals

**iOS Configuration:**

- Uses default iCloud backup behavior
- All Documents directory data is backed up automatically

**Android Configuration:**

```xml
<!-- backup_rules.xml -->
<full-backup-content>
  <!-- Include all MMKV data in backups -->
  <include domain="file" path="mmkv/" />
</full-backup-content>
```

## Expo Integration

### Requirements

- EAS Build required (no Expo Go support)
- Config Plugin for backup configuration
- Custom development client

### Config Plugin Setup

```javascript
// plugins/mmkv-backup.js
module.exports = (config) => {
  // Android: Create backup_rules.xml
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const backupRules = `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
  <!-- Include all MMKV data in backups -->
  <include domain="file" path="mmkv/" />
</full-backup-content>`;

      // Write to res/xml/backup_rules.xml
      return config;
    },
  ]);

  // iOS uses default iCloud backup behavior
  // No special configuration needed

  return config;
};
```

```json
// app.json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "allowBackup": true,
            "fullBackupContent": "@xml/backup_rules"
          }
        }
      ],
      "./plugins/mmkv-backup.js"
    ]
  }
}
```

## Usage Examples

### Data Type Mapping

| Data Type        | Storage Tier | Example                |
| ---------------- | ------------ | ---------------------- |
| User preferences | preferences  | `theme: 'dark'`        |
| API responses    | cache        | `userProfile` (7d TTL) |
| Auth tokens      | secure       | `authToken`            |
| Form drafts      | temp         | `checkoutForm`         |

### Code Example

```typescript
import { Storage } from '@/services/storage';

// User preferences (backed up)
Storage.preferences.set('theme', 'dark');
Storage.preferences.set('language', 'en');

// Cache with TTL (not backed up)
Storage.cache.setWithTTL('user_profile', userData, 86400); // 1 day

// Secure storage (encrypted, not backed up)
Storage.secure.setSecure('auth_token', token);

// Temporary data (cleared on app restart)
Storage.temp.set('form_draft', formData);
```

## Performance Benchmarks

| Operation               | MMKV   | AsyncStorage |
| ----------------------- | ------ | ------------ |
| Write                   | ~0.3ms | ~10ms        |
| Read                    | ~0.1ms | ~3ms         |
| Batch write (100 items) | ~30ms  | ~1000ms      |

## Data Management Strategy

### Initialization

```typescript
// App.tsx or entry point
import { initializeStorage } from '@/services/storage';

function App() {
  useEffect(() => {
    // Initialize storage asynchronously
    initializeStorage()
      .then(() => {
        console.log('Storage initialized successfully');
      })
      .catch((error) => {
        console.error('Failed to initialize storage:', error);
        // App can still function with degraded storage capabilities
      });
  }, []);
}
```

### Backup Restore Handling

The application enforces storage tier behavior through cleanup logic at startup:

- **Temporary data**: Always cleared on app start (achieving "not backed up" effect)
- **Cache data**: Expired entries are removed automatically (partial cleanup)
- **Secure data**: **Backed up and restored** (encrypted). Application should validate tokens and handle authentication state appropriately
- **Preferences**: Preserved after restore (true backup behavior)

**Important**: Unlike cache and temp storage, secure storage is designed to persist across restores. This allows for a better user experience where encrypted credentials can survive device migrations, but the application must handle token validation and authentication state properly.

### Cleanup Policies

| Storage     | Trigger       | Action                      |
| ----------- | ------------- | --------------------------- |
| temp        | App launch    | Clear all                   |
| cache       | App launch    | Remove expired entries      |
| cache       | Storage full  | Remove oldest entries (LRU) |
| secure      | User logout   | Clear auth tokens           |
| preferences | Factory reset | Clear all                   |

### Storage Limits

- **Total MMKV size**: Monitor and alert at 50MB
- **Cache size**: Limit to 20MB, LRU eviction
- **Secure storage**: Minimal, only essential credentials
- **Temp storage**: No limit, cleared on restart

## Encryption Key Management

### Overview

The secure storage tier uses MMKV's built-in encryption with keys managed by expo-secure-store, providing platform-native security for encryption keys.

### Key Storage

- **iOS**: Keys are stored in the iOS Keychain with `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`
- **Android**: Keys are stored using Android Keystore system
- **Key Generation**: 256-bit cryptographically secure keys using `expo-crypto`
- **Key Persistence**: Keys survive app updates but not app uninstalls

### Implementation Details

```typescript
// Key generation using expo-crypto
const randomBytes = await Crypto.getRandomBytesAsync(32); // 256 bits
const encryptionKey = btoa(String.fromCharCode(...randomBytes));

// Key storage using expo-secure-store
await SecureStore.setItemAsync('mmkv_encryption_key', encryptionKey, {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
});
```

### Security Features

1. **Platform-level Protection**: Encryption keys are protected by the OS security features
2. **Device-bound Keys**: Keys don't sync across devices for maximum security
3. **Fallback Mechanism**: Temporary keys are generated if secure storage fails
4. **Key Rotation**: Support for rotating encryption keys with data migration

### Key Rotation Process (Future Feature)

**Note: Key rotation is not yet implemented and will be available in a future release.**

Planned implementation:

1. Generate new encryption key
2. Create new MMKV instance with new key
3. Migrate all data from old to new instance
4. Update key in secure storage
5. Clear old encrypted data

See `SecureStorage.rotateEncryptionKey()` for implementation requirements and TODO.

## Best Practices

1. **Choose the right tier**:
   - Settings that should survive reinstalls → preferences
   - Data that improves performance → cache
   - Sensitive credentials → secure
   - Data for current session only → temp

2. **Set appropriate TTLs**:
   - User profiles: 7 days
   - API lists: 1 hour
   - Auth tokens: Match server expiry

3. **Handle storage errors**:

   ```typescript
   try {
     Storage.secure.setSecure('token', value);
   } catch (error) {
     // Handle encryption failure
   }
   ```

4. **Monitor storage usage**:
   - Track size per tier
   - Alert on unusual growth
   - Implement automatic cleanup

5. **Test backup/restore**:
   - Verify preferences survive app reinstalls (true backup)
   - Ensure temp data is cleared on app restart (effective "no backup")
   - Validate that expired cache is cleaned up
   - Test that invalid secure tokens are handled properly
   - Confirm encrypted data remains encrypted

6. **Initialize storage properly**:
   - Always call `initializeStorage()` on app startup
   - Handle initialization errors gracefully
   - Storage operations will fail if not initialized
