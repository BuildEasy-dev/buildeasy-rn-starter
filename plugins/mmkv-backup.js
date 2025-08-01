const { withDangerousMod, withInfoPlist } = require('@expo/config-plugins');
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
  config = withInfoPlist(config, (config) => {
    // Add keys for backup exclusion handling
    // Note: The actual exclusion is handled in the storage implementation
    // by using different paths for backup vs no-backup

    // Ensure we have the required background modes if needed
    if (!config.modResults.UIBackgroundModes) {
      config.modResults.UIBackgroundModes = [];
    }

    console.log('✅ Configured iOS Info.plist for MMKV');

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
