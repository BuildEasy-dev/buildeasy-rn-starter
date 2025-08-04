import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { initializeStorage, InitializationError } from '@/services/storage';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const initStorage = async () => {
      try {
        await initializeStorage();
      } catch (error) {
        if (error instanceof InitializationError) {
          console.error('CRITICAL: Storage initialization failed. App cannot run.', error);
          setStorageError(
            'Storage initialization failed. This may be due to device security settings. Please restart the app and ensure your device is unlocked.'
          );
        } else {
          console.error('An unexpected error occurred during app startup.', error);
          setStorageError('An unexpected error occurred during startup. Please restart the app.');
        }
      }
    };

    initStorage();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  // Show error screen if storage initialization failed
  if (storageError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Storage Error</Text>
        <Text style={styles.errorMessage}>{storageError}</Text>
        <Text style={styles.errorHint}>
          If this problem persists, you may need to log in again to re-establish secure storage.
        </Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
