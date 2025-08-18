import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ScreenWrapper } from '@/components/layout/wrappers/screen-wrapper';
import { ThemedTabView, SceneMap } from '@/components/themed/themed-tab-view';
import { ModalShowcase } from '@/features/ui-showcase/components/modal-showcase';
import { LoadingModalShowcase } from '@/features/ui-showcase/components/loading-modal-showcase';

export default function ModalsScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'modal', title: 'Modal Examples' },
    { key: 'loading', title: 'Loading Modal' },
  ]);

  const renderScene = SceneMap({
    modal: ModalShowcase,
    loading: LoadingModalShowcase,
  });

  return (
    <ScreenWrapper scrollable={false} padding={0} safeArea="bottom">
      <ThemedTabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        lazy={true}
        lazyPreloadDistance={1}
        style={styles.tabView}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
  },
});
