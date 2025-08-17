import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from '@tamagui/core';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { tamaguiConfig } from '@/tamagui.config';
import { ModalProvider } from './modal-provider';

export function AppProviders({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <ActionSheetProvider>
            <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme ?? 'light'}>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <ModalProvider>{children}</ModalProvider>
              </ThemeProvider>
            </TamaguiProvider>
          </ActionSheetProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
