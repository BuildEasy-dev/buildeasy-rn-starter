const { withDangerousMod, withAppDelegate } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withMMKVBackup(config) {
  // Android configuration
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const resXmlPath = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res', 'xml');

      // Create xml directory if it doesn't exist
      if (!fs.existsSync(resXmlPath)) {
        fs.mkdirSync(resXmlPath, { recursive: true });
      }

      // Create backup_rules.xml
      const backupRulesContent = `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
  <!-- Include preferences storage in backups -->
  <include domain="file" path="mmkv/backup/" />
  
  <!-- Exclude cache, secure, and temp storage from backups -->
  <exclude domain="file" path="mmkv/no-backup/" />
</full-backup-content>`;

      const backupRulesPath = path.join(resXmlPath, 'backup_rules.xml');
      fs.writeFileSync(backupRulesPath, backupRulesContent);

      console.log('✅ Created Android backup_rules.xml for MMKV');

      return config;
    },
  ]);

  // iOS configuration
  config = withAppDelegate(config, (config) => {
    const appDelegate = config.modResults;
    const newCode = `
  // BEGIN: MMKV Backup Exclusion
  // This code ensures that the 'no-backup' directory used by MMKV is excluded from iCloud backups.
  @try {
    NSURL *documentsDirectory = [[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];
    NSURL *noBackupDir = [documentsDirectory URLByAppendingPathComponent:@"mmkv/no-backup"];

    // Create the directory if it doesn't exist, which is a good practice.
    [[NSFileManager defaultManager] createDirectoryAtURL:noBackupDir withIntermediateDirectories:YES attributes:nil error:nil];

    // Apply the backup exclusion attribute.
    NSError *error = nil;
    BOOL success = [noBackupDir setResourceValue:@(YES) forKey:NSURLIsExcludedFromBackupKey error:&error];
    if (!success) {
      NSLog(@"[MMKVBackup] Error excluding %@ from backup: %@", [noBackupDir path], error);
    } else {
      NSLog(@"[MMKVBackup] Successfully excluded %@ from backup.", [noBackupDir path]);
    }
  } @catch (NSException *exception) {
    NSLog(@"[MMKVBackup] Exception while configuring backup exclusion: %@", exception.reason);
  }
  // END: MMKV Backup Exclusion
`;

    if (appDelegate.contents.includes('// BEGIN: MMKV Backup Exclusion')) {
      console.log('✅ iOS backup exclusion code already configured in AppDelegate.');
      return config;
    }

    const didFinishLaunchingWithOptions =
      'didFinishLaunchingWithOptions:(NSDictionary *)launchOptions';
    const insertionPoint = new RegExp(
      `(-\s*\(BOOL\)application:\(UIApplication\s*\*\)application\s+${didFinishLaunchingWithOptions}\s*\{)`
    );

    if (insertionPoint.test(appDelegate.contents)) {
      appDelegate.contents = appDelegate.contents.replace(insertionPoint, `$1${newCode}`);
      console.log(
        '✅ Configured iOS AppDelegate to exclude MMKV no-backup directory from iCloud backups.'
      );
    } else {
      console.warn(
        'Could not find didFinishLaunchingWithOptions in AppDelegate to insert backup exclusion code.'
      );
    }

    return config;
  });

  // Also configure the Android manifest to reference backup rules
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const manifestPath = path.join(
        projectRoot,
        'android',
        'app',
        'src',
        'main',
        'AndroidManifest.xml'
      );

      if (fs.existsSync(manifestPath)) {
        let manifestContent = fs.readFileSync(manifestPath, 'utf8');

        // Add backup rules reference if not already present
        if (!manifestContent.includes('android:fullBackupContent')) {
          manifestContent = manifestContent.replace(
            '<application',
            `<application
        android:allowBackup="true"
        android:fullBackupContent="@xml/backup_rules"`
          );

          fs.writeFileSync(manifestPath, manifestContent);
          console.log('✅ Updated AndroidManifest.xml with backup rules');
        }
      }

      return config;
    },
  ]);

  return config;
};
