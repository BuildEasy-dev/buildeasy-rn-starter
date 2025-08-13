import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AppProviders } from '@/providers/app-providers';
import { initializeStorage, InitializationError } from '@/services/storage';
import { createModalScreenOptions } from '@/components/layout/navigation';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const initStorage = async () => {
      try {
        await initializeStorage();
      } catch (error) {
        if (error instanceof InitializationError) {
          console.error('CRITICAL: Storage initialization failed. App cannot run.', error);
        } else {
          console.error('An unexpected error occurred during app startup.', error);
        }
      }
    };

    initStorage();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AppProviders>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="create-post" options={createModalScreenOptions()} />
        <Stack.Screen name="drawer-example" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AppProviders>
  );
}
