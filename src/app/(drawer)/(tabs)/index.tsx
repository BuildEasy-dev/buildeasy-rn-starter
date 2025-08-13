import { Image } from 'expo-image';
import { Platform, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
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
    <Pressable onPress={handlePress} style={styles.scrollButton}>
      <ThemedText style={styles.scrollButtonText}>↑ Scroll to Top</ThemedText>
    </Pressable>
  );
}

function DrawerToggleButton() {
  const { toggleDrawer } = useDrawerActions();
  const tintColor = useThemeColor('tint');

  return (
    <Pressable onPress={toggleDrawer} style={styles.drawerToggle}>
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
          <ThemedText type="subtitle">✨ New: TabScreenWrapper</ThemedText>
          <ThemedText>
            This screen now uses <ThemedText type="defaultSemiBold">TabScreenWrapper</ThemedText>{' '}
            from <ThemedText type="defaultSemiBold">@/components/layout</ThemedText>. It provides
            tab-specific features like scroll-to-top on tab press, badge support, and optimized safe
            areas.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">🚀 Scroll to Top Demo</ThemedText>
          <ThemedText>Try the scroll-to-top functionality:</ThemedText>
          <ThemedText>
            • <ThemedText type="defaultSemiBold">Automatic</ThemedText>: Scroll down, then tap the
            Home tab again
          </ThemedText>
          <ThemedText>
            • <ThemedText type="defaultSemiBold">Manual</ThemedText>: Use the button below
          </ThemedText>
          <ScrollToTopButton />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">📱 Modal Pages Demo</ThemedText>
          <ThemedText>Test Expo Router modal pages:</ThemedText>

          <Pressable
            onPress={() => router.push('/create-post')}
            style={[styles.modalButton, { backgroundColor: '#34C759' }]}
          >
            <ThemedText style={styles.modalButtonText}>📝 Create Post (Modal Page)</ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">🗂️ Drawer Navigation</ThemedText>
          <ThemedText>
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
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  scrollButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalButton: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  drawerToggle: {
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 1000,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
  },
});
