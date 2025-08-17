import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { View } from '@tamagui/core';

import { ThemedText } from '@/components/themed/themed-text';

interface SegmentedControlOption<T> {
  value: T;
  label: string;
  // Optional label key for internationalization
  labelKey?: string;
}

interface SegmentedControlProps<T> {
  // Currently selected value
  value: T;
  // Change callback
  onChange: (value: T) => void;
  // Options list
  options: SegmentedControlOption<T>[];
  // Optional translation function
  t?: (key: string) => string;
  // Style customization
  containerStyle?: StyleProp<ViewStyle>;
  optionStyle?: StyleProp<ViewStyle>;
  selectedOptionStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  // Custom option rendering
  renderOption?: (option: SegmentedControlOption<T>, isSelected: boolean) => React.ReactNode;
}

export function SegmentedControl<T>({
  value,
  onChange,
  options,
  t,
  containerStyle,
  optionStyle,
  selectedOptionStyle,
  textStyle,
  selectedTextStyle,
  renderOption,
}: SegmentedControlProps<T>) {
  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option, index) => {
        const isSelected = value === option.value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        // If a custom render function is provided, use it
        if (renderOption) {
          return (
            <TouchableOpacity
              key={String(option.value)}
              style={[
                styles.option,
                isFirst && styles.firstOption,
                isLast && styles.lastOption,
                optionStyle,
                isSelected && styles.selectedOption,
                isSelected && selectedOptionStyle,
              ]}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
            >
              {renderOption(option, isSelected)}
            </TouchableOpacity>
          );
        }

        // Default rendering
        return (
          <TouchableOpacity
            key={String(option.value)}
            style={[
              styles.option,
              isFirst && styles.firstOption,
              isLast && styles.lastOption,
              optionStyle,
              isSelected && styles.selectedOption,
              isSelected && selectedOptionStyle,
            ]}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <ThemedText
              style={[
                styles.text,
                textStyle,
                isSelected && styles.selectedText,
                isSelected && selectedTextStyle,
              ]}
            >
              {/* Support for internationalization or direct use of label */}
              {option.labelKey && t ? t(option.labelKey) : option.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 2,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginHorizontal: 1,
  },
  firstOption: {
    marginLeft: 0,
  },
  lastOption: {
    marginRight: 0,
  },
  selectedOption: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  selectedText: {
    fontWeight: '600',
    color: '#000000',
  },
});
