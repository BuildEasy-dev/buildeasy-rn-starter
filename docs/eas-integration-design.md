# EAS Integration Design

## Overview

This document outlines the integration of Expo Application Services (EAS) into the BuildEasy React Native Starter project.

### Goals
- Automated iOS/Android build pipeline
- Automated app store submission
- Multi-environment support (development/preview/production)

### Current Stack
- Expo SDK: 53.0.20
- React Native: 0.79.5 (New Architecture enabled)
- Package manager: pnpm

## EAS Services Architecture

### Service Components
- **EAS Build**: iOS/Android builds, certificate management
- **EAS Submit**: App Store/Google Play submission, metadata management

### Build Pipeline
Local development → EAS Build → Test/Production versions → Distribution

## Setup Guide

### Prerequisites
1. Create an Expo account at [expo.dev](https://expo.dev)
2. Install EAS CLI: `npm install -g @expo/eas-cli`
3. Authenticate: `eas login`

### Initial Configuration

#### 1. Initialize EAS Project
```bash
eas init
eas build:configure
```

#### 2. Configure Build Profiles
The template includes a pre-configured `eas.json` with three build profiles:
- **Development**: Internal distribution with simulator support
- **Preview**: Internal testing with staging environment  
- **Production**: Store distribution with production environment

Update the configuration with your specific requirements.

#### 3. Environment Setup
- Copy `.env.example` to `.env.local` and configure your variables:
  - Bundle identifiers (iOS/Android)
  - API URLs for different environments
  - Feature flags
- Use `eas secret:create` for sensitive data (API keys, certificates)
- The template automatically uses `package.json` name and version for app metadata
- Environment variables in `app.config.js` eliminate manual JSON editing

#### 4. Platform Configuration
- **iOS**: Run `eas credentials` to set up certificates and provisioning profiles
- **Android**: Configure signing keys via EAS credentials management

### 5. Store Configuration (Optional)
For automatic app store submission:
- **iOS**: Configure App Store Connect API key in EAS credentials
- **Android**: Upload Google Play service account JSON via EAS secrets

## Build Profiles

The template includes three pre-configured profiles that dynamically use environment variables:

### Development Profile
- Internal distribution with simulator support
- Uses debug signing for quick iteration
- Includes development client for testing
- Reads from development environment variables

### Preview Profile  
- Internal testing builds
- Uses staging environment variables (configurable via `.env`)
- Ad-hoc distribution for iOS, APK for Android

### Production Profile
- Store-ready builds
- Uses production environment variables
- App Bundle for Android, store distribution for iOS
- All metadata pulled from environment configuration


## Best Practices

### Security
- Store all secrets in EAS Secrets, never in repository
- Use environment variables for configuration
- Rotate certificates and keys regularly

### Cost Management
- Use free tier during development (30 builds/month)
- Leverage build caching
- Trigger full builds only when necessary

### General Guidelines
- Use environment variables for all non-sensitive configuration
- Keep `eas.json` generic and reusable across projects
- Use semantic versioning
- Establish clear branching strategy
- Clean up old build artifacts regularly

## Troubleshooting

### Common Issues
- **Build failures**: Check certificate configuration and dependency versions
- **OTA updates not working**: Verify update channel configuration
- **Environment variables not applied**: Check EAS Secrets setup

### Debug Commands
- View failed builds: `eas build:list --status=errored`
- Validate configuration: `eas build:configure`
- Check update status: `eas update:list`

## Resources
- [EAS Documentation](https://docs.expo.dev/eas/)
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)
- [EAS Update Best Practices](https://docs.expo.dev/eas-update/introduction/)