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
- **Lifecycle**: Persists until explicitly removed or user logs out
- **Cleanup**: On user logout, token expiration, or security events

#### Temp
- **Purpose**: Transient data relevant only to current app session
- **Examples**: Form drafts, navigation state, search filters, shopping cart (guest)
- **Lifecycle**: Cleared automatically on app restart
- **Cleanup**: Automatic on app launch, no manual intervention needed

### Storage Comparison

| Tier | Persistence | Backup | Encryption | TTL Support | Use Case |
|------|------------|--------|------------|-------------|----------|
| preferences | Forever | ✅ | ❌ | ❌ | User settings |
| cache | Until expired | ❌ | ❌ | ✅ | Performance optimization |
| secure | Until logout | ❌ | ✅ | ❌ | Sensitive credentials |
| temp | Current session | ❌ | ❌ | ❌ | Transient state |

### Core Interfaces

```typescript
interface StorageManager {
  preferences: IStorage;      // Persistent user preferences
  cache: IStorageWithTTL;    // Cached data with expiration
  secure: ISecureStorage;    // Encrypted storage
  temp: IStorage;            // Temporary storage
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
    path: `${MMKV.appGroupPath}/backup`
  }),
  
  cache: new MMKV({
    id: 'cache',
    path: `${MMKV.appGroupPath}/no-backup`
  }),
  
  secure: new MMKV({
    id: 'secure',
    path: `${MMKV.appGroupPath}/no-backup`,
    encryptionKey: 'generated-key'
  })
}
```

### Backup Strategy

**Path-based separation:**
- `/backup/` - Included in system backups
- `/no-backup/` - Excluded from backups

**iOS Configuration:**
- Set `NSURLIsExcludedFromBackupKey` on no-backup directories
- Backup directory automatically included in iCloud

**Android Configuration:**
```xml
<!-- backup_rules.xml -->
<full-backup-content>
  <include domain="file" path="mmkv/backup/" />
  <exclude domain="file" path="mmkv/no-backup/" />
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
  <include domain="file" path="mmkv/backup/" />
  <exclude domain="file" path="mmkv/no-backup/" />
</full-backup-content>`;
      
      // Write to res/xml/backup_rules.xml
      return config;
    }
  ]);
  
  // iOS: Configure backup exclusion
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      // Add NSURLIsExcludedFromBackupKey setup
      return config;
    }
  ]);
  
  return config;
};
```

```json
// app.json
{
  "expo": {
    "plugins": [
      ["expo-build-properties", {
        "android": {
          "allowBackup": true,
          "fullBackupContent": "@xml/backup_rules"
        }
      }],
      "./plugins/mmkv-backup.js"
    ]
  }
}
```

## Usage Examples

### Data Type Mapping

| Data Type | Storage Tier | Example |
|-----------|-------------|---------|
| User preferences | preferences | `theme: 'dark'` |
| API responses | cache | `userProfile` (7d TTL) |
| Auth tokens | secure | `authToken` |
| Form drafts | temp | `checkoutForm` |

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

| Operation | MMKV | AsyncStorage |
|-----------|------|--------------|
| Write | ~0.3ms | ~10ms |
| Read | ~0.1ms | ~3ms |
| Batch write (100 items) | ~30ms | ~1000ms |

## Data Management Strategy

### Initialization
```typescript
// App.tsx or entry point
import { initializeStorage } from '@/services/storage';

function App() {
  useEffect(() => {
    initializeStorage(); // Clears temp, removes expired cache
  }, []);
}
```

### Cleanup Policies

| Storage | Trigger | Action |
|---------|---------|--------|
| temp | App launch | Clear all |
| cache | App launch | Remove expired entries |
| cache | Storage full | Remove oldest entries (LRU) |
| secure | User logout | Clear auth tokens |
| preferences | Factory reset | Clear all |

### Storage Limits

- **Total MMKV size**: Monitor and alert at 50MB
- **Cache size**: Limit to 20MB, LRU eviction
- **Secure storage**: Minimal, only essential credentials
- **Temp storage**: No limit, cleared on restart

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
   - Verify preferences survive app reinstalls
   - Ensure cache and temp don't restore
   - Confirm secure data remains encrypted