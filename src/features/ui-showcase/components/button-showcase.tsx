import { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemedButton } from '@/components/themed/themed-button';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';

/**
 * Button Component Showcase
 * Demonstrates different types, sizes, and states of ThemedButton component
 */
export const ButtonShowcase = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Button variants */}
      <ThemedText type="h6" style={styles.firstSectionTitle}>
        Button Variants
      </ThemedText>
      <View style={styles.row}>
        <ThemedButton label="Primary" variant="primary" style={styles.button} onPress={() => {}} />
        <ThemedButton
          label="Secondary"
          variant="secondary"
          style={styles.button}
          onPress={() => {}}
        />
        <ThemedButton label="Outline" variant="outline" style={styles.button} onPress={() => {}} />
      </View>
      <View style={styles.row}>
        <ThemedButton label="Ghost" variant="ghost" style={styles.button} onPress={() => {}} />
        <ThemedButton label="Danger" variant="danger" style={styles.button} onPress={() => {}} />
      </View>

      {/* Button sizes */}
      <ThemedText type="h6" style={styles.sectionTitle}>
        Button Sizes
      </ThemedText>
      <View style={styles.row}>
        <ThemedButton label="Small" size="small" style={styles.button} onPress={() => {}} />
        <ThemedButton label="Medium" size="medium" style={styles.button} onPress={() => {}} />
        <ThemedButton label="Large" size="large" style={styles.button} onPress={() => {}} />
      </View>

      {/* Rounded settings examples */}
      <ThemedText type="h6" style={styles.sectionTitle}>
        Button Radius
      </ThemedText>
      <View style={styles.row}>
        <ThemedButton
          label="Small"
          radius="small"
          variant="primary"
          style={styles.button}
          onPress={() => {}}
        />
        <ThemedButton
          label="Medium"
          radius="medium"
          variant="primary"
          style={styles.button}
          onPress={() => {}}
        />
        <ThemedButton
          label="Large"
          radius="large"
          variant="primary"
          style={styles.button}
          onPress={() => {}}
        />
      </View>

      <View style={styles.row}>
        <ThemedButton
          label="None"
          radius={0}
          variant="primary"
          style={styles.button}
          onPress={() => {}}
        />
        <ThemedButton
          label="10px"
          radius={10}
          variant="primary"
          style={styles.button}
          onPress={() => {}}
        />
        <ThemedButton
          label="Custom"
          radius={12}
          variant="primary"
          style={styles.button}
          onPress={() => {}}
        />
      </View>

      {/* Button states */}
      <ThemedText type="h6" style={styles.sectionTitle}>
        Button States
      </ThemedText>
      <View style={styles.row}>
        <ThemedButton label="Disabled" disabled style={styles.button} onPress={() => {}} />
        <ThemedButton
          label={isLoading ? 'Loading...' : 'Click to Load'}
          isLoading={isLoading}
          variant="primary"
          style={styles.button}
          onPress={handleLoadingDemo}
        />
      </View>

      {/* Full width buttons */}
      <ThemedText type="h6" style={styles.sectionTitle}>
        Full Width Buttons
      </ThemedText>
      <ThemedButton
        label="Full Width"
        variant="primary"
        fullWidth
        style={styles.fullWidthButton}
        onPress={() => {}}
      />
      <ThemedButton
        label="Full Width Outline"
        variant="outline"
        fullWidth
        style={styles.fullWidthButton}
        onPress={() => {}}
      />

      {/* Icon buttons */}
      <ThemedText type="h6" style={styles.sectionTitle}>
        Icon Buttons
      </ThemedText>
      <View style={styles.row}>
        <ThemedButton
          label="Left Icon"
          iconName="house.fill"
          iconPosition="left"
          variant="primary"
          style={styles.button}
          onPress={() => {}}
        />
        <ThemedButton
          label="Right Icon"
          iconName="gear"
          iconPosition="right"
          variant="primary"
          style={styles.button}
          onPress={() => {}}
        />
        <ThemedButton
          label="Custom Icon Color"
          iconName="heart.fill"
          iconColor="#FF4081"
          variant="outline"
          style={styles.button}
          onPress={() => {}}
        />
      </View>

      <View style={styles.row}>
        <ThemedButton
          label="Small Icon"
          iconName="plus"
          iconSize={14}
          size="small"
          variant="secondary"
          style={styles.button}
          onPress={() => {}}
        />
        <ThemedButton
          label="Large Icon"
          iconName="bell.fill"
          iconSize={24}
          variant="danger"
          style={styles.button}
          onPress={() => {}}
        />
        <ThemedButton
          iconName="trash.fill"
          variant="ghost"
          style={styles.button}
          onPress={() => {}}
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  firstSectionTitle: {
    marginTop: 0,
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  button: {
    margin: 4,
  },
  fullWidthButton: {
    marginBottom: 8,
  },
});
