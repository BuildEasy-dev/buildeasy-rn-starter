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

interface ISecureStorage extends IStorage {
  setSecure<T>(key: string, value: T): void;
  getSecure<T>(key: string, defaultValue?: T): T | null;
  setAuthToken(token: string): void;
  getAuthToken(): string | null;
  setRefreshToken(token: string): void;
  getRefreshToken(): string | null;
  setApiKey(service: string, key: string): void;
  getApiKey(service: string): string | null;
  setCredentials(username: string, password: string): void;
  getCredentials(): { username: string; password: string } | null;
  clearAuth(): void;
  rotateEncryptionKey(): Promise<void>;
}
```

### Error Types

Storage operations may throw typed errors for better error handling:

```typescript
// Base error class with context information
class StorageError extends Error {
  readonly tier: 'preferences' | 'cache' | 'secure' | 'temp' | 'manager';
  readonly operation: string;
  readonly key?: string;
  readonly cause?: Error;
}

// Specific error types
class InitializationError extends StorageError {} // Storage initialization failure
class EncryptionError extends StorageError {} // Encryption/key management failure
class SerializationError extends StorageError {} // JSON.stringify failure
class DeserializationError extends StorageError {} // JSON.parse failure (data corruption)
class IOError extends StorageError {} // Native MMKV read/write failure
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

## Usage

For detailed usage examples, API reference, and best practices, see the [Storage Usage Guide](./storage-usage.md).

## Data Management Strategy

### Initialization

Storage requires async initialization due to encryption key management. The initialization process must handle `InitializationError` appropriately, typically by showing an error screen to users when critical storage failures occur.

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
3. **Robust Error Handling**: Failures are reported as explicit errors instead of silent fallbacks
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

## Error Handling

### Overview

The storage system implements a robust, typed error handling mechanism that eliminates silent failures and provides rich context for debugging and error recovery.

### Error Types

All storage errors extend the base `StorageError` class, which includes contextual information:

- **tier**: Which storage layer failed (preferences, cache, secure, temp, manager)
- **operation**: What operation was being performed (read, write, serialize, decrypt, etc.)
- **key**: The storage key involved (when applicable)
- **cause**: The underlying error that caused the failure

#### Specific Error Types

| Error Type             | When Thrown                           | Common Scenarios                                   |
| ---------------------- | ------------------------------------- | -------------------------------------------------- |
| `InitializationError`  | Storage service fails to initialize   | Secure storage key management fails on app startup |
| `EncryptionError`      | Encryption/decryption operations fail | Device security settings changed, keystore issues  |
| `SerializationError`   | `JSON.stringify` fails                | Circular references, invalid data types            |
| `DeserializationError` | `JSON.parse` fails                    | Data corruption, invalid JSON format               |
| `IOError`              | Native MMKV operations fail           | Disk full, permissions issues, hardware problems   |

### Error Handling Strategies

For practical error handling examples and implementation patterns, see the [Storage Usage Guide](./storage-usage.md#error-handling).

### Error Recovery Patterns

The system defines standard recovery patterns for different error types:

- **Encryption Errors**: Clear corrupted data and force re-authentication
- **Data Corruption**: Remove corrupted data and attempt to refetch from source
- **Storage Full**: Trigger cleanup, retry operations, and potentially degrade functionality

### Error Monitoring

Error monitoring should track error patterns across all storage tiers to identify system health issues. Key metrics include error frequency by tier, operation type, and device characteristics.

## Design Principles

1. **Tier Selection**: Each storage tier serves a specific purpose - preferences for persistent settings, cache for performance optimization, secure for sensitive data, and temp for session-only data

2. **Error Handling**: Use typed errors for precise error recovery strategies and robust system behavior

3. **Initialization**: Storage requires proper async initialization with error handling for secure key management

4. **Monitoring**: Track storage usage patterns and error frequencies across all tiers

For detailed implementation guidelines and practical examples, see the [Storage Usage Guide](./storage-usage.md).
