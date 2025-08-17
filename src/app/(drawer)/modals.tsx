import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { ScreenWrapper } from '@/components/layout/wrappers/screen-wrapper';
import { ThemedText } from '@/components/themed/themed-text';
import { ModalShowcase } from '@/features/ui-showcase/components/modal-showcase';
import { LoadingModalShowcase } from '@/features/ui-showcase/components/loading-modal-showcase';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ModalsScreen() {
  const [activeTab, setActiveTab] = useState<'modal' | 'loading'>('modal');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ScreenWrapper scrollable padding={8} safeArea="bottom">
      <View style={styles.tabContainer}>
        <View style={[styles.buttonGroup, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
          <TouchableOpacity
            style={[
              styles.button,
              activeTab === 'modal' && (isDark ? styles.activeButtonDark : styles.activeButton),
            ]}
            onPress={() => setActiveTab('modal')}
          >
            <ThemedText
              style={[
                styles.buttonText,
                { color: isDark ? '#FFFFFF' : '#000000' },
                activeTab === 'modal' && styles.activeText,
              ]}
            >
              Modal Examples
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeTab === 'loading' && (isDark ? styles.activeButtonDark : styles.activeButton),
            ]}
            onPress={() => setActiveTab('loading')}
          >
            <ThemedText
              style={[
                styles.buttonText,
                { color: isDark ? '#FFFFFF' : '#000000' },
                activeTab === 'loading' && styles.activeText,
              ]}
            >
              Loading Modal
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'modal' ? <ModalShowcase /> : <LoadingModalShowcase />}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    marginBottom: 24,
  },
  buttonGroup: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
  activeButtonDark: {
    backgroundColor: '#636366',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '400',
  },
  activeText: {
    fontWeight: '600',
  },
});
