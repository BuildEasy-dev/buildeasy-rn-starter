import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/collapsible';
import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TabScreenWrapper } from '@/components/layout/wrappers';
import { ScrollableParallaxView } from '@/components/parallax-scroll-view';

export default function TabTwoScreen() {
  // Example: Using TabScreenWrapper with ParallaxScrollView for enhanced tab functionality
  return (
    <TabScreenWrapper safeArea={false} scrollToTopOnPress>
      <ScrollableParallaxView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="chevron.left.forwardslash.chevron.right"
            style={styles.headerImage}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="h1">Explore</ThemedText>
        </ThemedView>
        <ThemedText type="body1">
          This app includes example code to help you get started.
        </ThemedText>

        <Collapsible title="File-based routing">
          <ThemedText type="body1">
            This app has two screens:{' '}
            <ThemedText type="body1" weight="semibold">
              app/(tabs)/index.tsx
            </ThemedText>{' '}
            and{' '}
            <ThemedText type="body1" weight="semibold">
              app/(tabs)/explore.tsx
            </ThemedText>
          </ThemedText>
          <ThemedText type="body1">
            The layout file in{' '}
            <ThemedText type="body1" weight="semibold">
              app/(tabs)/_layout.tsx
            </ThemedText>{' '}
            sets up the tab navigator.
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/router/introduction">
            <ThemedText type="body1" variant="link">
              Learn more
            </ThemedText>
          </ExternalLink>
        </Collapsible>

        <Collapsible title="TabScreenWrapper + ParallaxScrollView">
          <ThemedText type="body1">
            This screen demonstrates{' '}
            <ThemedText type="body1" weight="semibold">
              TabScreenWrapper
            </ThemedText>{' '}
            wrapping{' '}
            <ThemedText type="body1" weight="semibold">
              ParallaxScrollView
            </ThemedText>{' '}
            for the best of both worlds:
          </ThemedText>
          <ThemedText type="body1">
            •{' '}
            <ThemedText type="body1" weight="semibold">
              Parallax header animation
            </ThemedText>{' '}
            from ParallaxScrollView
          </ThemedText>
          <ThemedText type="body1">
            •{' '}
            <ThemedText type="body1" weight="semibold">
              Tab-optimized safe areas
            </ThemedText>{' '}
            and scroll-to-top functionality
          </ThemedText>
          <ThemedText type="body1">
            •{' '}
            <ThemedText type="body1" weight="semibold">
              Theme integration
            </ThemedText>{' '}
            and consistent layout
          </ThemedText>
        </Collapsible>

        <Collapsible title="Android, iOS, and web support">
          <ThemedText type="body1">
            You can open this project on Android, iOS, and the web. To open the web version, press{' '}
            <ThemedText type="body1" weight="semibold">
              w
            </ThemedText>{' '}
            in the terminal running this project.
          </ThemedText>
        </Collapsible>

        <Collapsible title="Images">
          <ThemedText type="body1">
            For static images, you can use the{' '}
            <ThemedText type="body1" weight="semibold">
              @2x
            </ThemedText>{' '}
            and{' '}
            <ThemedText type="body1" weight="semibold">
              @3x
            </ThemedText>{' '}
            suffixes to provide files for different screen densities
          </ThemedText>
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={{ alignSelf: 'center' }}
          />
          <ExternalLink href="https://reactnative.dev/docs/images">
            <ThemedText type="body1" variant="link">
              Learn more
            </ThemedText>
          </ExternalLink>
        </Collapsible>

        <Collapsible title="Custom fonts">
          <ThemedText type="body1">
            Open{' '}
            <ThemedText type="body1" weight="semibold">
              app/_layout.tsx
            </ThemedText>{' '}
            to see how to load{' '}
            <ThemedText type="body1" style={{ fontFamily: 'SpaceMono' }}>
              custom fonts such as this one.
            </ThemedText>
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
            <ThemedText type="body1" variant="link">
              Learn more
            </ThemedText>
          </ExternalLink>
        </Collapsible>

        <Collapsible title="Light and dark mode components">
          <ThemedText type="body1">
            This template has light and dark mode support. The{' '}
            <ThemedText type="body1" weight="semibold">
              useColorScheme()
            </ThemedText>{' '}
            hook lets you inspect what the user&apos;s current color scheme is, and so you can
            adjust UI colors accordingly.
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
            <ThemedText type="body1" variant="link">
              Learn more
            </ThemedText>
          </ExternalLink>
        </Collapsible>

        <Collapsible title="Animations">
          <ThemedText type="body1">
            This template includes an example of an animated component. The{' '}
            <ThemedText type="body1" weight="semibold">
              components/HelloWave.tsx
            </ThemedText>{' '}
            component uses the powerful{' '}
            <ThemedText type="body1" weight="semibold">
              react-native-reanimated
            </ThemedText>{' '}
            library to create a waving hand animation.
          </ThemedText>
          {Platform.select({
            ios: (
              <ThemedText type="body1">
                The{' '}
                <ThemedText type="body1" weight="semibold">
                  components/ParallaxScrollView.tsx
                </ThemedText>{' '}
                component provides a parallax effect for the header image.
              </ThemedText>
            ),
          })}
        </Collapsible>
      </ScrollableParallaxView>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
