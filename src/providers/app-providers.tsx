import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from '@tamagui/core';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { tamaguiConfig } from '@/tamagui.config';

export function AppProviders({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme ?? 'light'}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              {children}
            </ThemeProvider>
          </TamaguiProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
