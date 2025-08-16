import { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { ScreenWrapper } from '@/components/layout/wrappers/screen-wrapper';
import { ThemedButton } from '@/components/themed';
import { OverlayShowcase } from '@/features/ui-showcase/components/overlay-showcase';
import { LoadingOverlayShowcase } from '@/features/ui-showcase/components/loading-overlay-showcase';

export default function OverlaysScreen() {
  const [activeTab, setActiveTab] = useState<'overlay' | 'loading'>('overlay');

  return (
    <ScreenWrapper scrollable padding={8}>
      <View style={styles.tabContainer}>
        <ThemedButton
          label="Overlay Examples"
          variant={activeTab === 'overlay' ? 'primary' : 'outline'}
          size="medium"
          style={styles.tabButton}
          onPress={() => setActiveTab('overlay')}
        />
        <ThemedButton
          label="Loading Overlay"
          variant={activeTab === 'loading' ? 'primary' : 'outline'}
          size="medium"
          style={styles.tabButton}
          onPress={() => setActiveTab('loading')}
        />
      </View>

      {activeTab === 'overlay' ? <OverlayShowcase /> : <LoadingOverlayShowcase />}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  tabButton: {
    flex: 1,
  },
});
