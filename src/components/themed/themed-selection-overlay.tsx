import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useCallback } from 'react';

import { useThemeColor } from '@/hooks/use-theme-color';

import { IconSymbol } from '../ui/icon-symbol';
import { ThemedOverlay, type ThemedOverlayProps } from './themed-overlay';
import { ThemedText } from './themed-text';

export interface ThemedSelectionOption {
  value: string;
  label: string;
}

export interface ThemedSelectionOverlayProps extends Omit<ThemedOverlayProps, 'children'> {
  title?: string;
  options: ThemedSelectionOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  showDividers?: boolean;
}

/**
 * A selection overlay component built on top of ThemedOverlay
 *
 * Provides a mobile-friendly bottom sheet interface for selecting from options
 */
export function ThemedSelectionOverlay({
  title,
  options,
  selectedValue,
  onSelect,
  showDividers = true,
  variant = 'bottom',
  size = 'auto',
  animationSpeed = 'fast',
  ...overlayProps
}: ThemedSelectionOverlayProps) {
  const primaryColor = useThemeColor('tint');
  const borderColor = useThemeColor('border');

  const handleOptionPress = useCallback(
    (value: string) => {
      onSelect(value);
    },
    [onSelect]
  );

  return (
    <ThemedOverlay variant={variant} size={size} animationSpeed={animationSpeed} {...overlayProps}>
      <View style={styles.container}>
        {title && (
          <View style={[styles.header, { borderBottomColor: borderColor }]}>
            <ThemedText type="h5" style={styles.title}>
              {title}
            </ThemedText>
          </View>
        )}

        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            const isSelected = selectedValue === option.value;
            const isLast = index === options.length - 1;

            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  showDividers &&
                    !isLast && [styles.optionWithBorder, { borderBottomColor: borderColor }],
                ]}
                onPress={() => handleOptionPress(option.value)}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.optionText}>{option.label}</ThemedText>
                {isSelected && (
                  <IconSymbol
                    name="checkmark"
                    size={20}
                    color={primaryColor}
                    style={styles.checkmark}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ThemedOverlay>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingBottom: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
  optionsContainer: {
    paddingHorizontal: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 56,
  },
  optionWithBorder: {
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    marginLeft: 12,
  },
});
