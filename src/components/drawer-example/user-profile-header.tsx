import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { ThemedView, ThemedText } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';

export function UserProfileHeader() {
  const backgroundColor = useThemeColor('background');

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.avatarContainer, { backgroundColor }]}>
        <Image source={{ uri: 'https://picsum.photos/200' }} style={styles.avatar} />
        <View style={[styles.onlineIndicator, { borderColor: backgroundColor }]} />
      </View>
      <ThemedText style={styles.name}>John Doe</ThemedText>
      <ThemedText style={styles.email}>john.doe@example.com</ThemedText>
      <ThemedText style={styles.role}>Premium Member</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34C759',
    borderWidth: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  role: {
    fontSize: 12,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
