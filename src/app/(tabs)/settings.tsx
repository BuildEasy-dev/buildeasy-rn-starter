import React, { useState } from 'react';
import { Linking, Platform } from 'react-native';
import { TabScreenWrapper } from '@/components/layout/wrappers';
import { SettingSection, SettingItem, AppFooter } from '@/features/settings/components';
import { Config } from '@/constants/config';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  const openEmail = () => {
    Linking.openURL(`mailto:${Config.SUPPORT_EMAIL}`);
  };

  const openAppStore = () => {
    const storeUrl = Platform.OS === 'ios' ? Config.IOS_STORE_URL : Config.ANDROID_STORE_URL;
    Linking.openURL(storeUrl);
  };

  return (
    <TabScreenWrapper scrollable scrollToTopOnPress safeArea="top" headerTitle="Settings">
      {/* Appearance Section */}
      <SettingSection title="Appearance">
        <SettingItem
          icon="moon.fill"
          title="Dark Mode"
          subtitle="Toggle app theme appearance"
          type="toggle"
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </SettingSection>

      {/* Notifications Section */}
      <SettingSection title="Notifications">
        <SettingItem
          icon="bell.fill"
          title="Push Notifications"
          subtitle="Receive new message and update alerts"
          type="toggle"
          value={notifications}
          onValueChange={setNotifications}
        />

        <SettingItem
          icon="speaker.wave.3.fill"
          title="Sounds"
          subtitle="Notification sounds and ringtones"
          type="toggle"
          value={sounds}
          onValueChange={setSounds}
        />

        <SettingItem
          icon="waveform"
          title="Haptic Feedback"
          subtitle="Button and gesture vibration feedback"
          type="toggle"
          value={haptics}
          onValueChange={setHaptics}
        />
      </SettingSection>

      {/* Support Section */}
      <SettingSection title="Support">
        <SettingItem
          icon="questionmark.circle"
          title="Help Center"
          subtitle="FAQ and usage tutorials"
          onPress={() => openURL(Config.WEBSITE_URL)}
        />

        <SettingItem
          icon="envelope.fill"
          title="Contact Us"
          subtitle="Get technical support and feedback"
          onPress={openEmail}
        />

        <SettingItem
          icon="star.fill"
          title="Rate App"
          subtitle="Rate us on the App Store"
          onPress={openAppStore}
        />
      </SettingSection>

      {/* About Section */}
      <SettingSection title="About">
        <SettingItem
          icon="globe"
          title="Website"
          subtitle="Visit our website"
          onPress={() => openURL(Config.WEBSITE_URL)}
        />

        <SettingItem
          icon="xmark"
          title="Twitter"
          subtitle="Follow us on Twitter"
          onPress={() => openURL(Config.TWITTER_URL)}
        />

        <SettingItem
          icon="chevron.left.forwardslash.chevron.right"
          title="GitHub"
          subtitle="View source code"
          onPress={() => openURL(Config.GITHUB_URL)}
        />
      </SettingSection>

      {/* Legal Section */}
      <SettingSection title="Legal">
        <SettingItem
          icon="lock.shield.fill"
          title="Privacy Policy"
          subtitle="Read our privacy policy"
          onPress={() => openURL(Config.PRIVACY_URL)}
        />

        <SettingItem
          icon="doc.text.fill"
          title="Terms of Service"
          subtitle="Read our terms of service"
          onPress={() => openURL(Config.TERMS_URL)}
        />
      </SettingSection>

      {/* Footer */}
      <AppFooter />
    </TabScreenWrapper>
  );
}
