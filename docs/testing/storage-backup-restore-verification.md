# Test Plan: MMKV Storage Backup & Restore Verification

## 1. Objective

This document outlines the test procedures to verify that the MMKV storage implementation achieves the intended backup behavior. The current implementation strategy:

- **Preferences & Secure**: Backed up and restored (secure data is encrypted with expo-secure-store keys)
- **Cache**: Technically backed up, but expired data is cleared by application logic
- **Temp**: Technically backed up, but always cleared on app startup
- **Encryption Keys**: Stored in platform-native secure storage (iOS Keychain/Android Keystore)

## 2. Scope

- **In Scope:**
  - Verifying that preferences and secure data persist after restore
  - Testing that cache data cleanup works properly (expired entries removed)
  - Testing that temp data is always cleared on app startup
  - Verifying that secure data remains encrypted during backup/restore
  - Testing expo-secure-store encryption key persistence and regeneration
  - Verifying async storage initialization works correctly after restore
  - Testing on both Android (Google Drive Backup) and iOS (iCloud Backup).
- **Out of Scope:**
  - UI/UX testing.
  - Performance testing of the storage solution.
  - Functionality of the app beyond storage verification.

## 3. Prerequisites

### 3.1. Environment Setup

- **Hardware**: An Android device and an iPhone for testing.
- **Accounts**: A Google account logged into the Android device and an Apple ID logged into the iPhone.
- **System Config**:
  - On Android, **Settings > System > Backup > Back up to Google Drive** must be **enabled**.
  - On iOS, **Settings > [Your Name] > iCloud > iCloud Backup** must be **enabled**.
- **Tools**: `adb` (Android Debug Bridge) must be installed and in your system's PATH.

### 3.2. Application Setup

1.  **Generate Native Code**: Run `npx expo prebuild --clean` to ensure the `mmkv-backup.js` plugin has configured the native `android` and `ios` projects.
2.  **Add a Debug Interface**: To easily verify the data, add a temporary "Debug" screen or buttons in the app to perform the following actions:
    - **Write Test Data**: A button to populate all four storage tiers with predefined test data.
    - **Read and Display Data**: A section on the screen that reads the data from all four tiers and displays the current values.
    - **Clear All Data**: A button to wipe all storage tiers to reset the new test run.
    - **Test Storage Initialization**: A button to verify async storage initialization status.
    - **Check Encryption Key Status**: Display whether encryption keys are from expo-secure-store or temporary fallback.

## 4. Test Data

Use the following key-value pairs for testing:

| Storage Tier  | Key                 | Value                             |
| ------------- | ------------------- | --------------------------------- |
| `preferences` | `test_theme`        | `'dark'`                          |
| `cache`       | `test_user_profile` | `{ "id": 1, "name": "testuser" }` |
| `secure`      | `test_api_key`      | `'secret-key-123'`                |
| `temp`        | `test_form_draft`   | `{ "field": "some_temp_text" }`   |

## 5. Test Procedures

### Phase 1: Static Code Verification (Automated Check)

This phase confirms that the `prebuild` command correctly modified the native project files.

1.  **Android Verification**:
    - **Check 1**: Verify that the file `android/app/src/main/res/xml/backup_rules.xml` exists.
    - **Check 2**: Read its content and confirm it includes `<include domain="file" path="mmkv/" />`.
    - **Check 3**: Verify that `android/app/src/main/AndroidManifest.xml` contains `android:fullBackupContent="@xml/backup_rules"` in the `<application>` tag.
2.  **iOS Verification**:
    - **Check 1**: No special iOS configuration is required.
    - **Check 2**: Default iCloud backup behavior will handle all Documents directory data.

### Phase 2: Runtime Verification (Manual Execution)

#### Test Case 1: Android Backup and Restore

1.  **Setup**: Install a clean version of the app on the Android device (`npx expo run:android`).
2.  **Write Data**: Open the app and use the debug interface to write the predefined test data to all four storage tiers.
3.  **Force Backup**: Connect the device and run the following `adb` commands, replacing `<YOUR_PACKAGE_NAME>` with your app's package name (e.g., `com.buildeasy.starter`):
    ```bash
    adb shell bmgr backupnow <YOUR_PACKAGE_NAME>
    adb shell bmgr run
    ```
4.  **Simulate Restore**: Uninstall the application from the device. Then, reinstall it from the Play Store or by running `npx expo run:android` again.
5.  **Verification**: Launch the reinstalled app. Use the debug interface to read the data from all storage tiers. Note that the application's initialization logic will automatically clear temp storage, so temp data should be empty even if it was restored.

#### Test Case 2: iOS Backup and Restore

**WARNING**: Restoring from an iCloud backup can be a destructive process. The recommended approach is to use a secondary device. If not possible, proceeding will wipe your primary device.

1.  **Setup**: Install a clean version of the app on the iPhone (`npx expo run:ios`).
2.  **Write Data**: Open the app and use the debug interface to write the predefined test data.
3.  **Force Backup**: Go to **Settings > [Your Name] > iCloud > iCloud Backup** and tap **Back Up Now**. Wait for the backup to complete.
4.  **Simulate Restore**:
    - **(Recommended)** On a _secondary_ iOS device, begin the setup process and choose to restore from the iCloud backup you just created.
    - **(Destructive)** On the _primary_ device, go to **Settings > General > Transfer or Reset iPhone > Erase All Content and Settings**. After the device reboots, choose to restore from the iCloud backup.
5.  **Verification**: Once the device is restored, the app will be automatically downloaded. Open it and use the debug interface to read the data. Note that the application's initialization logic will automatically clear temp storage.

#### Test Case 3: Encryption Key Management

1.  **Key Persistence Test**: After writing secure data, verify that encryption keys are stored in expo-secure-store (not temporary).
2.  **Key Regeneration Test**:
    - Manually delete the expo-secure-store key using device settings or a debug function
    - Restart the app and verify it generates a new encryption key
    - Confirm that previously encrypted data becomes inaccessible (expected behavior)
    - Note: Key rotation API is planned for future release
3.  **Async Initialization Test**:
    - Verify that storage initialization completes successfully on first app launch
    - Test that storage operations fail gracefully if initialization hasn't completed
    - Confirm that multiple initialization calls return the same instance

#### Test Case 4: Fallback Behavior

1.  **Simulate expo-secure-store Failure**: Mock or disable expo-secure-store functionality
2.  **Verify Fallback**: Confirm the app falls back to temporary encryption keys with appropriate warnings
3.  **Persistence Check**: Verify that data encrypted with temporary keys doesn't persist across app restarts

## 6. Expected Results & Recording

Use the table below to record the outcome for each platform. The application passes the test only if the results match the expected state.

| Storage Tier        | Expected State After Restore | Android Result (Pass/Fail) | iOS Result (Pass/Fail) | Notes                                       |
| ------------------- | ---------------------------- | -------------------------- | ---------------------- | ------------------------------------------- |
| `preferences`       | Data is **RESTORED**         |                            |                        | True backup behavior                        |
| `cache`             | **Expired data CLEARED**     |                            |                        | Effective "no backup" via TTL               |
| `secure`            | Data is **RESTORED**         |                            |                        | **Backed up and restored** (encrypted)      |
| `temp`              | Data is **EMPTY**            |                            |                        | Effective "no backup" via startup cleanup   |
| **Encryption Keys** | **Keys REGENERATED**         |                            |                        | Platform-native storage (Keychain/Keystore) |
| **Initialization**  | **Completes successfully**   |                            |                        | Async initialization works correctly        |

### Additional Verification Checklist

- [ ] **Storage initialization**: Completes without errors on first launch after restore
- [ ] **Encryption key source**: Verify keys are from expo-secure-store (not temporary fallback)
- [ ] **Key regeneration**: New encryption keys generated after restore (device-bound keys)
- [ ] **Secure data accessibility**: Previously encrypted data accessible after restore
- [ ] **Fallback behavior**: Temporary keys work if expo-secure-store fails
- [ ] **Console warnings**: Appropriate warnings logged for key management issues
