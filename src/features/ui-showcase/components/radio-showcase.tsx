import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedRadio, ThemedRadioGroup, ThemedView, ThemedText } from '@/components/themed';

export function RadioShowcase() {
  const [selectedValue, setSelectedValue] = useState('option1');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedSize, setSelectedSize] = useState('medium');

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText type="h5" style={styles.firstSubTitle}>
          Basic Usage
        </ThemedText>
        <ThemedRadioGroup
          selectedValue={selectedValue}
          onValueChange={(value) => setSelectedValue(value as string)}
        >
          <ThemedRadio value="option1" label="Option One" style={styles.radioItem} />
          <ThemedRadio value="option2" label="Option Two" style={styles.radioItem} />
          <ThemedRadio value="option3" label="Option Three" style={styles.radioItem} />
        </ThemedRadioGroup>
        <ThemedText type="body1" weight="semibold" style={styles.selectedValue}>
          Selected Value: {selectedValue}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h5" style={styles.subTitle}>
          Size Variations
        </ThemedText>
        <ThemedRadioGroup
          selectedValue={selectedSize}
          onValueChange={(value) => setSelectedSize(value as string)}
        >
          <ThemedRadio value="small" label="Small" size="small" style={styles.radioItem} />
          <ThemedRadio value="medium" label="Medium" size="medium" style={styles.radioItem} />
          <ThemedRadio value="large" label="Large" size="large" style={styles.radioItem} />
        </ThemedRadioGroup>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h5" style={styles.subTitle}>
          Custom Colors
        </ThemedText>
        <ThemedRadioGroup
          selectedValue={selectedColor}
          onValueChange={(value) => setSelectedColor(value as string)}
        >
          <ThemedRadio
            value="blue"
            label="Blue"
            lightRadioColor="#3498db"
            darkRadioColor="#2980b9"
            style={styles.radioItem}
          />
          <ThemedRadio
            value="green"
            label="Green"
            lightRadioColor="#2ecc71"
            darkRadioColor="#27ae60"
            style={styles.radioItem}
          />
          <ThemedRadio
            value="red"
            label="Red"
            lightRadioColor="#e74c3c"
            darkRadioColor="#c0392b"
            style={styles.radioItem}
          />
        </ThemedRadioGroup>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h5" style={styles.subTitle}>
          Different States
        </ThemedText>
        <ThemedRadio value="disabled1" disabled label="Disabled State" style={styles.radioItem} />
        <ThemedRadio
          value="disabled2"
          selectedValue="disabled2"
          disabled
          label="Disabled Selected"
          style={styles.radioItem}
        />
        <ThemedRadio value="noLabel" style={styles.radioItem} />
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
  radioItem: {
    marginBottom: 8,
  },
  selectedValue: {
    marginTop: 8,
    fontStyle: 'italic',
  },
});
