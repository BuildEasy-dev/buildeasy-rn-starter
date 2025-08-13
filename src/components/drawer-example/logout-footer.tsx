import React from 'react';
import { StyleSheet, Pressable, Alert } from 'react-native';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';

export function LogoutFooter() {
  const borderColor = useThemeColor('border');

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          console.log('User logged out');
          // In a real app, you would clear auth tokens here
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <ThemedView style={[styles.container, { borderTopColor: borderColor }]}>
      <Pressable onPress={handleLogout} style={styles.button}>
        <IconSymbol name="arrow.right.square" size={20} color="#FF3B30" />
        <ThemedText style={styles.text}>Sign Out</ThemedText>
      </Pressable>

      <ThemedView style={styles.versionContainer}>
        <ThemedText style={styles.versionText}>v1.0.0</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    color: '#FF3B30',
  },
  versionContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    opacity: 0.4,
  },
});
