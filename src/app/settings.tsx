import React, { useState } from 'react';
import { Switch, Pressable } from 'react-native';
import { ModalWrapper } from '@/components/layout/wrappers';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedText } from '@/components/themed/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const borderColor = useThemeColor('border');
  const tintColor = useThemeColor('tint');

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <ThemedView style={{ marginBottom: 30 }}>
      <ThemedView
        style={{
          paddingHorizontal: 20,
          paddingVertical: 12,
          backgroundColor: '#f8f9fa',
        }}
      >
        <ThemedText
          style={{
            fontSize: 14,
            fontWeight: '600',
            opacity: 0.6,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {title}
        </ThemedText>
      </ThemedView>
      {children}
    </ThemedView>
  );

  const SettingItem = ({
    icon,
    title,
    subtitle,
    type = 'nav',
    value,
    onValueChange,
    onPress,
  }: {
    icon: IconSymbolName;
    title: string;
    subtitle?: string;
    type?: 'nav' | 'toggle';
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    onPress?: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      disabled={type === 'toggle'}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        backgroundColor: 'transparent',
      }}
    >
      <ThemedView
        style={{
          marginRight: 12,
        }}
      >
        <IconSymbol name={icon} size={24} color={tintColor} />
      </ThemedView>

      <ThemedView style={{ flex: 1 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '500' }}>{title}</ThemedText>
        {subtitle && (
          <ThemedText style={{ fontSize: 14, opacity: 0.6, marginTop: 2 }}>{subtitle}</ThemedText>
        )}
      </ThemedView>

      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: tintColor }}
        />
      ) : (
        <IconSymbol name="chevron.right" size={16} color="#999" />
      )}
    </Pressable>
  );

  return (
    <ModalWrapper
      headerTitle="Settings"
      headerLeft={{ variant: 'back' }}
      headerRight={{ variant: 'done' }}
    >
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
        />

        <SettingItem
          icon="envelope.fill"
          title="Contact Us"
          subtitle="Get technical support and feedback"
        />

        <SettingItem icon="star.fill" title="Rate App" subtitle="Rate us on the App Store" />
      </SettingSection>

      {/* Footer */}
      <ThemedView
        style={{
          alignItems: 'center',
          padding: 40,
        }}
      >
        <ThemedText
          style={{
            opacity: 0.5,
            fontSize: 14,
            marginBottom: 8,
          }}
        >
          © 2024 Your App Name
        </ThemedText>
        <ThemedText
          style={{
            opacity: 0.5,
            fontSize: 12,
          }}
        >
          Version 1.0.0 (Build 1)
        </ThemedText>
      </ThemedView>
    </ModalWrapper>
  );
}
