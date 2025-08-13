import React from 'react';
import { StyleSheet, Switch } from 'react-native';
import { ScreenWrapper } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function SettingsScreen() {
  const tintColor = useThemeColor('tint');
  const borderColor = useThemeColor('border');

  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(true);

  return (
    <ScreenWrapper safeArea="top" scrollable padding>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Preferences
      </ThemedText>

      <ThemedView style={[styles.settingItem, { borderBottomColor: borderColor }]}>
        <ThemedView style={styles.settingInfo}>
          <ThemedText style={styles.settingLabel}>Push Notifications</ThemedText>
          <ThemedText style={styles.settingDescription}>Receive alerts for new messages</ThemedText>
        </ThemedView>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ true: tintColor }}
        />
      </ThemedView>

      <ThemedView style={[styles.settingItem, { borderBottomColor: borderColor }]}>
        <ThemedView style={styles.settingInfo}>
          <ThemedText style={styles.settingLabel}>Dark Mode</ThemedText>
          <ThemedText style={styles.settingDescription}>Use dark theme</ThemedText>
        </ThemedView>
        <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: tintColor }} />
      </ThemedView>

      <ThemedView style={[styles.settingItem, { borderBottomColor: borderColor }]}>
        <ThemedView style={styles.settingInfo}>
          <ThemedText style={styles.settingLabel}>Analytics</ThemedText>
          <ThemedText style={styles.settingDescription}>
            Share usage data to improve the app
          </ThemedText>
        </ThemedView>
        <Switch value={analytics} onValueChange={setAnalytics} trackColor={{ true: tintColor }} />
      </ThemedView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.6,
  },
});
