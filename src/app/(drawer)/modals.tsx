import { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { ScreenWrapper } from '@/components/layout/wrappers/screen-wrapper';
import { ThemedButton } from '@/components/themed';
import { ModalShowcase } from '@/features/ui-showcase/components/modal-showcase';
import { LoadingModalShowcase } from '@/features/ui-showcase/components/loading-modal-showcase';

export default function ModalsScreen() {
  const [activeTab, setActiveTab] = useState<'modal' | 'loading'>('modal');

  return (
    <ScreenWrapper scrollable padding={8}>
      <View style={styles.tabContainer}>
        <ThemedButton
          label="Modal Examples"
          variant={activeTab === 'modal' ? 'primary' : 'outline'}
          size="medium"
          style={styles.tabButton}
          onPress={() => setActiveTab('modal')}
        />
        <ThemedButton
          label="Loading Modal"
          variant={activeTab === 'loading' ? 'primary' : 'outline'}
          size="medium"
          style={styles.tabButton}
          onPress={() => setActiveTab('loading')}
        />
      </View>

      {activeTab === 'modal' ? <ModalShowcase /> : <LoadingModalShowcase />}
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
