import { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemedButton } from '@/components/themed/themed-button';
import { ThemedLoadingOverlay } from '@/components/ui/loading-overlay';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';

/**
 * Loading Overlay Component Showcase
 * Demonstrates different styles and configurations of ThemedLoadingOverlay component
 */
export const LoadingOverlayShowcase = () => {
  const [simpleLoading, setSimpleLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);

  // Simulate async operation
  const simulateAsyncOperation = (duration: number, callback: () => void) => {
    setTimeout(() => {
      callback();
    }, duration);
  };

  const handleSimpleLoading = () => {
    setSimpleLoading(true);
    simulateAsyncOperation(2000, () => setSimpleLoading(false));
  };

  const handleMessageLoading = () => {
    setMessageLoading(true);
    simulateAsyncOperation(3000, () => setMessageLoading(false));
  };

  const handleCustomLoading = () => {
    setCustomLoading(true);
    simulateAsyncOperation(4000, () => setCustomLoading(false));
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.section}>
        <ThemedText type="h6" style={styles.firstSubTitle}>
          Basic Usage
        </ThemedText>
        <ThemedButton
          onPress={handleSimpleLoading}
          label="Basic Loading"
          variant="primary"
          size="medium"
        />

        <ThemedLoadingOverlay
          visible={simpleLoading}
          size="auto"
          contentContainerStyle={styles.basicLoadingContent}
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="h6" style={styles.subTitle}>
          With Message
        </ThemedText>
        <ThemedButton
          onPress={handleMessageLoading}
          label="With Message"
          variant="primary"
          size="medium"
        />

        <ThemedLoadingOverlay visible={messageLoading} message="Loading data, please wait..." />
      </View>

      <View style={styles.section}>
        <ThemedText type="h6" style={styles.subTitle}>
          Custom Style
        </ThemedText>
        <ThemedButton
          onPress={handleCustomLoading}
          label="Custom Style"
          variant="primary"
          size="medium"
        />

        <ThemedLoadingOverlay
          visible={customLoading}
          message="Custom loading in progress..."
          lightIndicatorColor="#8b5cf6"
          darkIndicatorColor="#c4b5fd"
          lightColor="#f8f9fa"
          darkColor="#2d3748"
          indicatorSize="small"
          backdropOpacity={0.7}
          contentContainerStyle={styles.customContent}
        />
      </View>
    </ThemedView>
  );
};

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
  basicLoadingContent: {
    borderRadius: 16,
    padding: 20,
    minWidth: 180,
    maxWidth: 180,
    width: 180,
    minHeight: 100,
  },
  customContent: {
    borderRadius: 16,
    padding: 24,
  },
});
