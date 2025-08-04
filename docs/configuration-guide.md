# Configuration Guide

## Configuration System

```
app.config.ts      →  Build-time constants and Expo configuration
Config.ts          →  Runtime constants with defaults (Store URLs, Social Links, etc.)
.env files         →  Local development only (NOT used in EAS builds)
eas.json           →  Build profiles and non-sensitive build variables
EAS Cloud          →  Sensitive variables (API keys, secrets)
```

## Key Files

### 1. `app.config.ts`

Build-time configuration - contains:

- BUILD_CONFIG constant with app identity (Bundle ID, Scheme, Slug, Owner)
- Universal Links configuration (empty by default)
- Environment-specific logic for dev/preview/production
- Passes configuration to runtime via extra field

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
3. Local .env files are NOT used

## Adding New Configuration

### 1. Runtime constant (e.g., Facebook URL):

```typescript
// In src/constants/Config.ts only
FACEBOOK_URL: 'https://facebook.com/buildeasy',
```

### 2. Environment variable (including sensitive):

```typescript
// Step 1: For sensitive values, create EAS secret
eas secret:create EXPO_PUBLIC_STRIPE_KEY pk_test_xxx

// Step 2: Add to app.config.ts extra
extra: {
  stripeKey: process.env.EXPO_PUBLIC_STRIPE_KEY || '',
}

// Step 3: Add to ExtraConfig interface and Config.ts
STRIPE_KEY: extra?.stripeKey || '',
```

### 3. Build-time constant:

```typescript
// In app.config.ts BUILD_CONFIG
NEW_BUILD_CONSTANT: 'value',
```

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
const apiUrl = Config.API_URL; // Environment variables accessed via Config
```

## Configuration Strategy

### Where to put configurations:

**`app.config.ts` BUILD_CONFIG** - Build constants

- Bundle ID, URL schemes, Slug
- Universal Links domains
- Build numbers

**`.env` files** - Local development only

- API URLs for local testing
- Feature flags for development
- NOT used in EAS builds

**`eas.json` env field** - Non-sensitive build config

- Production API URLs
- Default feature flags
- Environment identifiers

**EAS Cloud** - Sensitive data only

- API keys, tokens
- Third-party service credentials
- Use `eas secret:create` for truly secret values
