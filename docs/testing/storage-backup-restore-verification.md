# Test Plan: MMKV Storage Backup & Restore Verification

## 1. Objective

This document outlines the test procedures to verify that the MMKV storage implementation correctly handles system-level backup and restore on both Android and iOS. The goal is to ensure that designated data persists after an app reinstall (via backup) while non-essential or sensitive data is correctly excluded.

## 2. Scope

- **In Scope:**
  - Verifying the backup and restore behavior of `preferences`, `cache`, `secure`, and `temp` storage tiers.
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
    - **Check 2**: Read its content and confirm it includes `<include domain="file" path="mmkv/backup/" />` and `<exclude domain="file" path="mmkv/no-backup/" />`.
    - **Check 3**: Verify that `android/app/src/main/AndroidManifest.xml` contains `android:fullBackupContent="@xml/backup_rules"` in the `<application>` tag.
2.  **iOS Verification**:
    - **Check 1**: Verify that the file `ios/buildeasyrnstarter/AppDelegate.m` has been modified.
    - **Check 2**: Confirm that the `didFinishLaunchingWithOptions` method contains the Objective-C code block for setting the `NSURLIsExcludedFromBackupKey` attribute on the `mmkv/no-backup` directory.

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
5.  **Verification**: Launch the reinstalled app. Use the debug interface to read the data from all storage tiers. Record the results.

#### Test Case 2: iOS Backup and Restore

**WARNING**: Restoring from an iCloud backup can be a destructive process. The recommended approach is to use a secondary device. If not possible, proceeding will wipe your primary device.

1.  **Setup**: Install a clean version of the app on the iPhone (`npx expo run:ios`).
2.  **Write Data**: Open the app and use the debug interface to write the predefined test data.
3.  **Force Backup**: Go to **Settings > [Your Name] > iCloud > iCloud Backup** and tap **Back Up Now**. Wait for the backup to complete.
4.  **Simulate Restore**:
    - **(Recommended)** On a _secondary_ iOS device, begin the setup process and choose to restore from the iCloud backup you just created.
    - **(Destructive)** On the _primary_ device, go to **Settings > General > Transfer or Reset iPhone > Erase All Content and Settings**. After the device reboots, choose to restore from the iCloud backup.
5.  **Verification**: Once the device is restored, the app will be automatically downloaded. Open it and use the debug interface to read the data. Record the results.

## 6. Expected Results & Recording

Use the table below to record the outcome for each platform. The application passes the test only if the results match the expected state.

| Storage Tier  | Expected State After Restore | Android Result (Pass/Fail) | iOS Result (Pass/Fail) | Notes |
| ------------- | ---------------------------- | -------------------------- | ---------------------- | ----- |
| `preferences` | Data is **RESTORED**         |                            |                        |       |
| `cache`       | Data is **EMPTY**            |                            |                        |       |
| `secure`      | Data is **EMPTY**            |                            |                        |       |
| `temp`        | Data is **EMPTY**            |                            |                        |       |
