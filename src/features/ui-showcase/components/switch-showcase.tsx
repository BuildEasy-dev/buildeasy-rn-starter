import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedSwitch, ThemedView, ThemedText } from '@/components/themed';

export function SwitchShowcase() {
  const [basicSwitch, setBasicSwitch] = useState(false);
  const [enabledSwitch, setEnabledSwitch] = useState(true);
  const [customColorSwitch, setCustomColorSwitch] = useState(false);
  const [smallSwitch, setSmallSwitch] = useState(false);
  const [largeSwitch, setLargeSwitch] = useState(true);
  const [loadingSwitch, setLoadingSwitch] = useState(false);
  const [noHapticsSwitch, setNoHapticsSwitch] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText type="h5" style={styles.firstSubTitle}>
          Basic Usage
        </ThemedText>

        <ThemedView style={styles.switchRow}>
          <ThemedText type="body1">Default Switch</ThemedText>
          <ThemedSwitch value={basicSwitch} onValueChange={setBasicSwitch} />
        </ThemedView>

        <ThemedView style={styles.switchRow}>
          <ThemedText type="body1">Pre-enabled Switch</ThemedText>
          <ThemedSwitch value={enabledSwitch} onValueChange={setEnabledSwitch} />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h5" style={styles.subTitle}>
          Size Variations
        </ThemedText>

        <ThemedView style={styles.switchRow}>
          <ThemedText type="body1">Small Switch</ThemedText>
          <ThemedSwitch value={smallSwitch} onValueChange={setSmallSwitch} size="small" />
        </ThemedView>

        <ThemedView style={styles.switchRow}>
          <ThemedText type="body1">Medium Switch (Default)</ThemedText>
          <ThemedSwitch value={basicSwitch} onValueChange={setBasicSwitch} size="medium" />
        </ThemedView>

        <ThemedView style={styles.switchRow}>
          <ThemedText type="body1">Large Switch</ThemedText>
          <ThemedSwitch value={largeSwitch} onValueChange={setLargeSwitch} size="large" />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h5" style={styles.subTitle}>
          Custom Colors
        </ThemedText>

        <ThemedView style={styles.switchRow}>
          <ThemedText type="body1">Custom Track Colors</ThemedText>
          <ThemedSwitch
            value={customColorSwitch}
            onValueChange={setCustomColorSwitch}
            lightTrackColor={{ false: '#e0e0e0', true: '#4caf50' }}
            darkTrackColor={{ false: '#424242', true: '#388e3c' }}
            lightThumbColor="#ffffff"
            darkThumbColor="#ffffff"
          />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h5" style={styles.subTitle}>
          Special States
        </ThemedText>

        <ThemedView style={styles.switchRow}>
          <ThemedText type="body1">Disabled Switch</ThemedText>
          <ThemedSwitch value={false} onValueChange={() => {}} disabled />
        </ThemedView>

        <ThemedView style={styles.switchRow}>
          <ThemedText type="body1">Loading State</ThemedText>
          <ThemedSwitch value={loadingSwitch} onValueChange={setLoadingSwitch} loading />
        </ThemedView>

        <ThemedView style={styles.switchRow}>
          <ThemedText type="body1">No Haptics</ThemedText>
          <ThemedSwitch
            value={noHapticsSwitch}
            onValueChange={setNoHapticsSwitch}
            haptics={false}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  firstSubTitle: {
    marginTop: 0,
    marginBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  subTitle: {
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
