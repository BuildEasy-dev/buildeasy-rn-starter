import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function AppProviders({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            {children}
          </ThemeProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
