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

      // Create backup_rules.xml with default backup behavior
      const backupRulesContent = `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
  <!-- Include all MMKV data in backups -->
  <include domain="file" path="mmkv/" />
</full-backup-content>`;

      const backupRulesPath = path.join(resXmlPath, 'backup_rules.xml');
      fs.writeFileSync(backupRulesPath, backupRulesContent);

      console.log('✔ Created Android backup_rules.xml for MMKV');

      return config;
    },
  ]);

  // iOS uses default iCloud backup behavior for MMKV data
  // No special configuration needed

  // Configure the Android manifest to reference backup rules
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
          console.log('✔ Updated AndroidManifest.xml with backup rules');
        }
      }

      return config;
    },
  ]);

  return config;
};
