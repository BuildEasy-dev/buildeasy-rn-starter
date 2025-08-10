import React from 'react';
import { Image, Pressable } from 'react-native';
import { ModalWrapper } from '@/components/layout';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedText } from '@/components/themed/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function UserProfilePage() {
  const borderColor = useThemeColor('border');
  const tintColor = useThemeColor('tint');

  const ProfileItem = ({
    icon,
    title,
    subtitle,
    onPress,
  }: {
    icon: IconSymbolName;
    title: string;
    subtitle?: string;
    onPress?: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        backgroundColor: 'transparent',
      }}
    >
      <IconSymbol name={icon} size={24} color={tintColor} style={{ marginRight: 16 }} />
      <ThemedView style={{ flex: 1 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '500' }}>{title}</ThemedText>
        {subtitle && (
          <ThemedText style={{ fontSize: 14, opacity: 0.6, marginTop: 2 }}>{subtitle}</ThemedText>
        )}
      </ThemedView>
      <IconSymbol name="chevron.right" size={16} color="#999" />
    </Pressable>
  );

  return (
    <ModalWrapper
      headerTitle="User Profile"
      headerLeft={{ variant: 'back' }}
      headerRight={{ variant: 'done' }}
    >
      {/* User Header */}
      <ThemedView
        style={{
          alignItems: 'center',
          padding: 40,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <Image
          source={{ uri: 'https://via.placeholder.com/100x100/007AFF/FFFFFF?text=User' }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 20,
          }}
        />
        <ThemedText type="subtitle" style={{ marginBottom: 6, fontSize: 24 }}>
          John Doe
        </ThemedText>
        <ThemedText style={{ opacity: 0.6, fontSize: 16 }}>john.doe@example.com</ThemedText>

        <Pressable
          style={{
            backgroundColor: tintColor,
            paddingHorizontal: 24,
            paddingVertical: 10,
            borderRadius: 20,
            marginTop: 20,
          }}
        >
          <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Edit Profile</ThemedText>
        </Pressable>
      </ThemedView>

      {/* Profile Items */}
      <ThemedView>
        <ProfileItem
          icon="person.circle"
          title="Personal Info"
          subtitle="Manage name, email, and other details"
        />
        <ProfileItem icon="heart.circle" title="My Favorites" subtitle="12 favorites" />
        <ProfileItem icon="doc.text" title="My Posts" subtitle="8 posts, 245 likes" />
        <ProfileItem
          icon="bell.circle"
          title="Notifications"
          subtitle="Manage push notification preferences"
        />
        <ProfileItem
          icon="gear.circle"
          title="Account Settings"
          subtitle="Privacy, security, and other settings"
        />
      </ThemedView>

      {/* Footer Actions */}
      <ThemedView
        style={{
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: borderColor,
          marginTop: 20,
        }}
      >
        <Pressable
          style={{
            padding: 16,
            alignItems: 'center',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#FF3B30',
            marginBottom: 20,
          }}
        >
          <ThemedText style={{ color: '#FF3B30', fontWeight: '600' }}>Sign Out</ThemedText>
        </Pressable>

        <ThemedText
          style={{
            textAlign: 'center',
            opacity: 0.5,
            fontSize: 12,
          }}
        >
          Version 1.0.0
        </ThemedText>
      </ThemedView>
    </ModalWrapper>
  );
}
