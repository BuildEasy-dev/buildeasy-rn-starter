import { View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed/themed-text';

/**
 * Typography Showcase Component
 *
 * This component demonstrates the various typography options available
 * in the ThemedText component, showcasing the semantic API design
 * with comprehensive text types, weights, and variants.
 */
export const TypographyShowcase = () => {
  return (
    <View style={styles.container}>
      {/* Heading Examples */}
      <View style={styles.section}>
        <ThemedText type="h6" weight="semibold" style={styles.sectionTitle}>
          Headings
        </ThemedText>

        <ThemedText type="h1">Heading 1</ThemedText>
        <ThemedText type="h2">Heading 2</ThemedText>
        <ThemedText type="h3">Heading 3</ThemedText>
        <ThemedText type="h4">Heading 4</ThemedText>
        <ThemedText type="h5">Heading 5</ThemedText>
        <ThemedText type="h6">Heading 6</ThemedText>
      </View>

      {/* Body Text Examples */}
      <View style={styles.section}>
        <ThemedText type="h6" weight="semibold" style={styles.sectionTitle}>
          Body Text
        </ThemedText>

        <ThemedText type="body1">Body 1 - Main text content</ThemedText>
        <ThemedText type="body2">Body 2 - Secondary text</ThemedText>
      </View>

      {/* Weight Variations */}
      <View style={styles.section}>
        <ThemedText type="h6" weight="semibold" style={styles.sectionTitle}>
          Weight Variations
        </ThemedText>

        <ThemedText type="body1" weight="regular">
          Regular (400)
        </ThemedText>
        <ThemedText type="body1" weight="medium">
          Medium (500)
        </ThemedText>
        <ThemedText type="body1" weight="semibold">
          SemiBold (600)
        </ThemedText>
        <ThemedText type="body1" weight="bold">
          Bold (700)
        </ThemedText>
      </View>

      {/* Supporting Text */}
      <View style={styles.section}>
        <ThemedText type="h6" weight="semibold" style={styles.sectionTitle}>
          Supporting Text
        </ThemedText>

        <ThemedText type="caption">
          Caption - Small text for image captions or legal text
        </ThemedText>
        <ThemedText type="label">Label - Text for form labels</ThemedText>
        <ThemedText type="overline">OVERLINE - UPPERCASE SMALL TEXT</ThemedText>
      </View>

      {/* Variants */}
      <View style={styles.section}>
        <ThemedText type="h6" weight="semibold" style={styles.sectionTitle}>
          Text Variants
        </ThemedText>

        <ThemedText type="body1">Default text</ThemedText>
        <ThemedText type="body1" variant="link">
          Link text
        </ThemedText>
        <ThemedText type="body1" variant="error">
          Error text
        </ThemedText>
        <ThemedText type="body1" variant="success">
          Success text
        </ThemedText>
        <ThemedText type="body1" variant="warning">
          Warning text
        </ThemedText>
        <ThemedText type="body1" variant="muted">
          Muted text
        </ThemedText>
      </View>

      {/* Combined Examples */}
      <View style={styles.section}>
        <ThemedText type="h6" weight="semibold" style={styles.sectionTitle}>
          Combined Type + Weight + Variant
        </ThemedText>

        <ThemedText type="h4" weight="bold" variant="error">
          Error Heading (h4 + bold + error)
        </ThemedText>
        <ThemedText type="body1" weight="medium" variant="success">
          Success Message (body1 + medium + success)
        </ThemedText>
        <ThemedText type="caption" variant="muted">
          Muted Caption (caption + muted)
        </ThemedText>
        <ThemedText type="label" weight="semibold" variant="warning">
          Warning Label (label + semibold + warning)
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
});
