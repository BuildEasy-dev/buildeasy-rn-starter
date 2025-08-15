import { Image } from 'expo-image';
import { Platform, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedButton } from '@/components/themed/themed-button';
import { TabScreenWrapper } from '@/components/layout/wrappers';
import { ScrollableParallaxView } from '@/components/parallax-scroll-view';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useDrawerActions } from '@/components/layout';

function ScrollToTopButton() {
  const scrollToTop = useScrollToTop();

  const handlePress = () => {
    scrollToTop?.triggerScrollToTop();
  };

  return (
    <ThemedButton
      label="↑ Scroll to Top"
      variant="primary"
      onPress={handlePress}
      style={styles.scrollButton}
    />
  );
}

function DrawerToggleButton() {
  const { toggleDrawer } = useDrawerActions();
  const tintColor = useThemeColor('tint');
  const backgroundColor = useThemeColor('background');

  return (
    <Pressable
      onPress={toggleDrawer}
      style={[
        styles.drawerToggle,
        { backgroundColor: backgroundColor + 'E6' }, // 90% opacity
      ]}
    >
      <IconSymbol name="line.3.horizontal" size={24} color={tintColor} />
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <TabScreenWrapper safeArea={false} scrollToTopOnPress>
      <DrawerToggleButton />
      <ScrollableParallaxView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="h1">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="h3">Step 1: Try it</ThemedText>
          <ThemedText type="body1">
            Edit{' '}
            <ThemedText type="body1" weight="semibold">
              app/(tabs)/index.tsx
            </ThemedText>{' '}
            to see changes. Press{' '}
            <ThemedText type="body1" weight="semibold">
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
          <ThemedText type="h3">Step 2: Explore</ThemedText>
          <ThemedText type="body1">
            {`Tap the Explore tab to learn more about what's included in this starter app.`}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="h3">Step 3: Start building</ThemedText>
          <ThemedText type="body1">
            You&apos;re all set! Start building your app by editing the files in the{' '}
            <ThemedText type="body1" weight="semibold">
              app
            </ThemedText>{' '}
            directory. The ScreenWrapper component provides consistent layouts with safe area
            handling, theming, and loading states.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="h3">✨ New: TabScreenWrapper</ThemedText>
          <ThemedText type="body1">
            This screen now uses{' '}
            <ThemedText type="body1" weight="semibold">
              TabScreenWrapper
            </ThemedText>{' '}
            from{' '}
            <ThemedText type="body1" weight="semibold">
              @/components/layout
            </ThemedText>
            . It provides tab-specific features like scroll-to-top on tab press, badge support, and
            optimized safe areas.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="h3">🚀 Scroll to Top Demo</ThemedText>
          <ThemedText type="body1">Try the scroll-to-top functionality:</ThemedText>
          <ThemedText type="body1">
            •{' '}
            <ThemedText type="body1" weight="semibold">
              Automatic
            </ThemedText>
            : Scroll down, then tap the Home tab again
          </ThemedText>
          <ThemedText type="body1">
            •{' '}
            <ThemedText type="body1" weight="semibold">
              Manual
            </ThemedText>
            : Use the button below
          </ThemedText>
          <ScrollToTopButton />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="h3">📱 Modal Pages Demo</ThemedText>
          <ThemedText type="body1">Test Expo Router modal pages:</ThemedText>

          <ThemedButton
            label="📝 Create Post (Modal Page)"
            variant="primary"
            onPress={() => router.push('/create-post')}
            style={styles.modalButton}
          />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="h3">🗂️ Drawer Navigation</ThemedText>
          <ThemedText type="body1">
            This app now has integrated drawer navigation! Use the menu button in the top-left
            corner or swipe from the left edge to open the drawer.
          </ThemedText>
        </ThemedView>
      </ScrollableParallaxView>
    </TabScreenWrapper>
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
  scrollButton: {
    marginTop: 12,
  },
  modalButton: {
    marginTop: 12,
  },
  drawerToggle: {
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 1000,
    padding: 8,
    borderRadius: 8,
  },
});
