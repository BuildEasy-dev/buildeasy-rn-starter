import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { ScreenWrapper } from '@/components/layout';

export default function HomeScreen() {
  // Example showing two different ways to use ScreenWrapper:
  // Option 1: Keep the existing ParallaxScrollView design
  return (
    <ScreenWrapper>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1: Try it</ThemedText>
          <ThemedText>
            Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see
            changes. Press{' '}
            <ThemedText type="defaultSemiBold">
              {Platform.select({
                ios: 'cmd + d',
                android: 'cmd + m',
                web: 'F12',
              })}
            </ThemedText>{' '}
            to open developer tools.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          <ThemedText>
            {`Tap the Explore tab to learn more about what's included in this starter app.`}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 3: Start building</ThemedText>
          <ThemedText>
            You&apos;re all set! Start building your app by editing the files in the{' '}
            <ThemedText type="defaultSemiBold">app</ThemedText> directory. The ScreenWrapper
            component provides consistent layouts with safe area handling, theming, and loading
            states.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">✨ New: ScreenWrapper</ThemedText>
          <ThemedText>
            This screen now uses <ThemedText type="defaultSemiBold">ScreenWrapper</ThemedText> from{' '}
            <ThemedText type="defaultSemiBold">@/components/layout</ThemedText>. It provides
            consistent safe areas, theming, and state management.
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
