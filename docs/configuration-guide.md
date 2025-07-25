# Configuration Guide

## Configuration System

```
config.ts          →  App constants (Bundle ID, Scheme, Store URLs)
.env files         →  Local development only (NOT used in EAS builds)
eas.json           →  Build profiles and non-sensitive build variables
EAS Cloud          →  Sensitive variables (API keys, secrets)
```

## Key Files

### 1. `build.config.js`
Centralized build configuration - edit this file to change:
- App identity (Bundle ID, Scheme, Slug, Owner)
- Store URLs and Social Media Links  
- Legal information (Privacy, Terms, Copyright)
- Website and Support Email

### 2. `src/constants/Config.ts`
Runtime configuration access - use this in your app:
```typescript
import { Config } from '@/constants/Config';
const bundleId = Config.BUNDLE_ID;
const supportEmail = Config.SUPPORT_EMAIL;
```

### 3. Environment Variables

**Local Development Only** - These files are NOT used in EAS builds:
```bash
# .env (team defaults, committed)
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_ANALYTICS_ENABLED=false

# .env.local (personal overrides, not committed)
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

Priority: `.env.local` > `.env` > hardcoded defaults

### 4. Build Configuration

**Build Profiles** (`eas.json`):
| Profile | App Name | Bundle ID | Distribution |
|---------|----------|-----------|--------------|
| development | app-name (Dev) | com.bundle.id.dev | internal |
| preview | app-name (Preview) | com.bundle.id.preview | internal |
| production | app-name | com.bundle.id | store |

**EAS Build Variables Priority**:
1. EAS Cloud variables (highest) - for secrets
2. `eas.json` env field - for non-sensitive config
3. ❌ Local .env files are NOT used

## Common Tasks

**Local setup:**
```bash
cp .env.example .env.local
pnpm start
```

**Production build:**
```bash
# Option 1: Use eas.json for non-sensitive config
# (API URL already in eas.json production.env)

# Option 2: Set sensitive cloud variables
eas secret:create SENTRY_AUTH_TOKEN your-token-here

# Build
eas build --profile production
```

**Access in code:**
```typescript
// Runtime configuration (recommended)
import { Config } from '@/constants/Config';
const bundleId = Config.BUNDLE_ID;
const supportEmail = Config.SUPPORT_EMAIL;

// Environment variables (direct access)
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

## Configuration Strategy

### Where to put configurations:

**`build.config.js`** - Build constants
- Bundle ID, URL schemes, Slug
- Store URLs, Social Media, Legal info
- Things that rarely change across environments

**`.env` files** - Local development only
- API URLs for local testing
- Feature flags for development
- ⚠️ NOT used in EAS builds

**`eas.json` env field** - Non-sensitive build config
- Production API URLs
- Default feature flags
- Environment identifiers

**EAS Cloud** - Sensitive data only
- API keys, tokens
- Third-party service credentials
- Use `eas secret:create` for truly secret values