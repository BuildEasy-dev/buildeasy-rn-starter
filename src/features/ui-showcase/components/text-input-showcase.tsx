import { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { ThemedText } from '@/components/themed/themed-text';
import { ThemedTextInput } from '@/components/themed/themed-text-input';
import { ThemedScrollView } from '@/components/themed/themed-scroll-view';

/**
 * Text Input Component Showcase
 * Demonstrates different variants, sizes, and features of ThemedTextInput component
 */
export const TextInputShowcase = () => {
  const [text, setText] = useState({
    default: '',
    subtle: '',
    minimal: '',
    outlined: '',
    filled: '',
    small: '',
    medium: '',
    large: '',
    error: '',
    success: '',
    leftIcon: '',
    rightIcon: '',
    rounded: '',
    password: '',
    email: '',
    search: '',
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedScrollView style={styles.container}>
        {/* Modern Input variants */}
        <ThemedText type="h6" style={styles.firstSectionTitle}>
          Modern Input Variants
        </ThemedText>
        <View style={styles.row}>
          <ThemedTextInput
            label="Minimal Input"
            placeholder="Clean, borderless design"
            variant="minimal"
            value={text.minimal}
            onChangeText={(value) => setText({ ...text, minimal: value })}
            style={styles.inputField}
            helperText="Pure minimal - no borders or background"
          />
        </View>
        <View style={styles.row}>
          <ThemedTextInput
            label="Subtle Input"
            placeholder="Modern underline style"
            variant="subtle"
            value={text.subtle}
            onChangeText={(value) => setText({ ...text, subtle: value })}
            style={styles.inputField}
            helperText="Bottom line only - like modern apps"
          />
        </View>
        <View style={styles.row}>
          <ThemedTextInput
            label="Default Input"
            placeholder="Soft background"
            variant="default"
            value={text.default}
            onChangeText={(value) => setText({ ...text, default: value })}
            style={styles.inputField}
            helperText="Subtle background - iOS Settings style"
          />
        </View>
        <View style={styles.row}>
          <ThemedTextInput
            label="Filled Input"
            placeholder="Darker background"
            variant="filled"
            value={text.filled}
            onChangeText={(value) => setText({ ...text, filled: value })}
            style={styles.inputField}
            helperText="Darker background for contrast"
          />
        </View>
        <View style={styles.row}>
          <ThemedTextInput
            label="Outline Input"
            placeholder="Traditional border"
            variant="outline"
            value={text.outlined}
            onChangeText={(value) => setText({ ...text, outlined: value })}
            style={styles.inputField}
            helperText="Classic border style (less common now)"
          />
        </View>

        {/* Input sizes */}
        <ThemedText type="h6" style={styles.sectionTitle}>
          Input Sizes
        </ThemedText>
        <View style={styles.row}>
          <ThemedTextInput
            label="Small Input"
            placeholder="Small size..."
            size="small"
            value={text.small}
            onChangeText={(value) => setText({ ...text, small: value })}
            style={styles.inputField}
          />
        </View>
        <View style={styles.row}>
          <ThemedTextInput
            label="Medium Input"
            placeholder="Medium size..."
            size="medium"
            value={text.medium}
            onChangeText={(value) => setText({ ...text, medium: value })}
            style={styles.inputField}
          />
        </View>
        <View style={styles.row}>
          <ThemedTextInput
            label="Large Input"
            placeholder="Large size..."
            size="large"
            value={text.large}
            onChangeText={(value) => setText({ ...text, large: value })}
            style={styles.inputField}
          />
        </View>

        {/* Input states */}
        <ThemedText type="h6" style={styles.sectionTitle}>
          Input Status
        </ThemedText>
        <View style={styles.row}>
          <ThemedTextInput
            label="Error Input"
            placeholder="Invalid input..."
            status="error"
            value={text.error}
            onChangeText={(value) => setText({ ...text, error: value })}
            style={styles.inputField}
            helperText="This field has an error"
          />
        </View>
        <View style={styles.row}>
          <ThemedTextInput
            label="Success Input"
            placeholder="Valid input..."
            status="success"
            value={text.success}
            onChangeText={(value) => setText({ ...text, success: value })}
            style={styles.inputField}
            helperText="This field is valid"
          />
        </View>

        {/* Input with icons */}
        <ThemedText type="h6" style={styles.sectionTitle}>
          Input with Icons
        </ThemedText>
        <View style={styles.row}>
          <ThemedTextInput
            label="Left Icon Input"
            placeholder="Search..."
            iconName="magnifyingglass"
            iconPosition="left"
            value={text.leftIcon}
            onChangeText={(value) => setText({ ...text, leftIcon: value })}
            style={styles.inputField}
          />
        </View>
        <View style={styles.row}>
          <ThemedTextInput
            label="Right Icon Input"
            placeholder="Enter location..."
            iconName="mappin.circle.fill"
            iconPosition="right"
            value={text.rightIcon}
            onChangeText={(value) => setText({ ...text, rightIcon: value })}
            style={styles.inputField}
          />
        </View>

        {/* Rounded inputs */}
        <ThemedText type="h6" style={styles.sectionTitle}>
          Rounded Input
        </ThemedText>
        <View style={styles.row}>
          <ThemedTextInput
            label="Rounded Input"
            placeholder="Rounded corners..."
            rounded
            variant="filled"
            value={text.rounded}
            onChangeText={(value) => setText({ ...text, rounded: value })}
            style={styles.inputField}
          />
        </View>

        {/* Password inputs */}
        <ThemedText type="h6" style={styles.sectionTitle}>
          Password Input
        </ThemedText>
        <View style={styles.row}>
          <ThemedTextInput
            label="Password Input"
            placeholder="Enter password..."
            secureTextEntry
            showPasswordToggle
            value={text.password}
            onChangeText={(value) => setText({ ...text, password: value })}
            style={styles.inputField}
            helperText="Click the lock icon to toggle visibility"
          />
        </View>

        {/* Special input types */}
        <ThemedText type="h6" style={styles.sectionTitle}>
          Special Input Types
        </ThemedText>
        <View style={styles.row}>
          <ThemedTextInput
            label="Email Input"
            placeholder="user@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            iconName="envelope"
            iconPosition="left"
            value={text.email}
            onChangeText={(value) => setText({ ...text, email: value })}
            style={styles.inputField}
            helperText="Email keyboard and validation"
          />
        </View>
        <View style={styles.row}>
          <ThemedTextInput
            label="Search Input"
            placeholder="Search items..."
            iconName="magnifyingglass"
            iconPosition="left"
            returnKeyType="search"
            variant="subtle"
            value={text.search}
            onChangeText={(value) => setText({ ...text, search: value })}
            style={styles.inputField}
            helperText="Search keyboard with subtle styling"
          />
        </View>

        {/* Combined features example */}
        <ThemedText type="h6" style={styles.sectionTitle}>
          Modern Combinations
        </ThemedText>
        <View style={styles.row}>
          <ThemedTextInput
            label="Clean Search"
            placeholder="Search with minimal design..."
            variant="minimal"
            size="large"
            iconName="magnifyingglass"
            iconPosition="left"
            rounded
            helperText="Large minimal input with search icon"
            style={styles.inputField}
          />
        </View>
        <View style={styles.row}>
          <ThemedTextInput
            label="Modern Success"
            placeholder="Success with subtle styling..."
            variant="subtle"
            size="medium"
            status="success"
            iconName="checkmark.circle.fill"
            iconPosition="right"
            helperText="Subtle input with success state"
            style={styles.inputField}
          />
        </View>

        {/* Add extra bottom space */}
        <View style={styles.bottomPadding} />
      </ThemedScrollView>
    </TouchableWithoutFeedback>
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
    marginBottom: 16,
  },
  inputField: {
    width: '100%',
  },
  bottomPadding: {
    height: 50,
  },
});
