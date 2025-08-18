/**
 * Form layout components
 * @fileoverview Components for structuring and organizing form layouts
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedText } from '@/components/themed/themed-text';
import type { ViewStyle } from 'react-native';

/**
 * Props for FormGroup component
 */
export type FormGroupProps = {
  /** The form fields to group together */
  children: React.ReactNode;
  /** Optional title for the group */
  title?: string;
  /** Optional description for the group */
  description?: string;
  /** Custom container style */
  style?: ViewStyle;
  /** Spacing between fields */
  spacing?: number;
};

/**
 * Groups related form fields with optional title and description
 * @description Provides consistent spacing and optional labeling for related form fields
 * @param props - The form group properties
 * @returns The form group component with structured layout
 * @example
 * ```tsx
 * <FormGroup title="Personal Information" description="Enter your basic details">
 *   <FormTextInput name="firstName" label="First Name" />
 *   <FormTextInput name="lastName" label="Last Name" />
 * </FormGroup>
 * ```
 */
export function FormGroup({ children, title, description, style, spacing = 16 }: FormGroupProps) {
  return (
    <ThemedView style={[styles.container, style]}>
      {title && (
        <ThemedText type="h6" weight="semibold" style={styles.title}>
          {title}
        </ThemedText>
      )}
      {description && (
        <ThemedText type="body1" variant="muted" style={styles.description}>
          {description}
        </ThemedText>
      )}
      <View style={[styles.content, { gap: spacing }]}>{children}</View>
    </ThemedView>
  );
}

/**
 * Props for FormRow component
 */
export type FormRowProps = {
  /** The elements to display in a row (fields, buttons, etc.) */
  children: React.ReactNode;
  /** Spacing between elements */
  spacing?: number;
  /** Custom container style */
  style?: ViewStyle;
};

/**
 * Displays elements in a horizontal row
 * @description Useful for side-by-side elements like form fields, buttons, etc.
 * @param props - The form row properties
 * @returns The form row component with horizontal layout
 * @example
 * ```tsx
 * // For form fields
 * <FormRow>
 *   <FormTextInput name="firstName" label="First Name" />
 *   <FormTextInput name="lastName" label="Last Name" />
 * </FormRow>
 *
 * // For buttons
 * <FormRow>
 *   <ThemedButton label="Cancel" onPress={handleCancel} variant="outline" />
 *   <ThemedButton label="Submit" onPress={handleSubmit(onSubmit)} />
 * </FormRow>
 * ```
 */
export function FormRow({ children, spacing = 12, style }: FormRowProps) {
  const childrenWithFlex = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return <View style={{ flex: 1 }}>{child}</View>;
    }
    return child;
  });

  return <View style={[styles.row, { gap: spacing }, style]}>{childrenWithFlex}</View>;
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    marginBottom: 8,
  },
  content: {
    // gap is set dynamically via spacing prop
  },
  row: {
    flexDirection: 'row',
    // gap is set dynamically via spacing prop
  },
});
