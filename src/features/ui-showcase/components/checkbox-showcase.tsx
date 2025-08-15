import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedCheckbox, ThemedView, ThemedText } from '@/components/themed';

export function CheckboxShowcase() {
  const [basicChecked, setBasicChecked] = useState(false);
  const [blueChecked, setBlueChecked] = useState(true);
  const [largeChecked, setLargeChecked] = useState(true);
  const [smallChecked, setSmallChecked] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText type="h5" style={styles.firstSubTitle}>
          Basic Usage
        </ThemedText>
        <ThemedCheckbox
          value={basicChecked}
          onValueChange={setBasicChecked}
          label="Basic Checkbox"
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h5" style={styles.subTitle}>
          Size Variations
        </ThemedText>
        <ThemedCheckbox
          value={smallChecked}
          onValueChange={setSmallChecked}
          label="Small"
          size="small"
          style={styles.checkboxItem}
        />
        <ThemedCheckbox
          value={basicChecked}
          onValueChange={setBasicChecked}
          label="Medium"
          size="medium"
          style={styles.checkboxItem}
        />
        <ThemedCheckbox
          value={largeChecked}
          onValueChange={setLargeChecked}
          label="Large"
          size="large"
          style={styles.checkboxItem}
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h5" style={styles.subTitle}>
          Custom Colors
        </ThemedText>
        <ThemedCheckbox
          value={blueChecked}
          onValueChange={setBlueChecked}
          label="Custom Color"
          lightCheckColor="#3498db"
          darkCheckColor="#2980b9"
          lightBorderColor="#3498db"
          darkBorderColor="#2980b9"
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h5" style={styles.subTitle}>
          Different States
        </ThemedText>
        <ThemedCheckbox value={false} disabled label="Disabled State" style={styles.checkboxItem} />
        <ThemedCheckbox
          value={true}
          disabled
          label="Disabled Checked"
          style={styles.checkboxItem}
        />
        <ThemedCheckbox value={false} style={styles.checkboxItem} />
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
  checkboxItem: {
    marginBottom: 8,
  },
});
