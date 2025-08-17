import { TouchableOpacity, View, StyleSheet, type DimensionValue } from 'react-native';
import { useCallback, useMemo } from 'react';

import { useThemeColor } from '@/hooks/use-theme-color';

import { IconSymbol } from './icon-symbol';
import { ThemedModal, type ThemedModalProps } from '../themed/themed-modal';
import { ThemedText } from '../themed/themed-text';

export interface SelectionOption {
  value: string;
  label: string;
}

export interface SelectionModalProps extends Omit<ThemedModalProps, 'children'> {
  title?: string;
  options: SelectionOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  showDividers?: boolean;
  /**
   * Height of the overlay content
   * Accepts number for fixed height or string for percentage (e.g., '70%')
   */
  height?: DimensionValue;
}

/**
 * A selection modal component built on top of ThemedModal
 *
 * Provides a mobile-friendly bottom sheet interface for selecting from options
 */
export function SelectionModal({
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
  showDividers = true,
  height,
  variant = 'bottom',
  size = 'auto',
  animationSpeed = 'fast',
  contentContainerStyle,
  ...modalProps
}: SelectionModalProps) {
  const primaryColor = useThemeColor('tint');
  const borderColor = useThemeColor('border');
  const textSecondary = useThemeColor('textSecondary');

  const handleOptionPress = useCallback(
    (value: string) => {
      onSelect(value);
    },
    [onSelect]
  );

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Merge height with contentContainerStyle
  const mergedContentStyle = useMemo(() => {
    if (height) {
      return {
        ...contentContainerStyle,
        height,
      };
    }
    return contentContainerStyle;
  }, [height, contentContainerStyle]);

  return (
    <ThemedModal
      variant={variant}
      size={size}
      animationSpeed={animationSpeed}
      onClose={onClose}
      contentContainerStyle={mergedContentStyle}
      {...modalProps}
    >
      <View style={styles.container}>
        {title && (
          <View style={[styles.header, { borderBottomColor: borderColor }]}>
            <ThemedText type="h5" style={styles.title}>
              {title}
            </ThemedText>
            {onClose && (
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Close"
                accessibilityHint="Closes the selection modal"
              >
                <IconSymbol name="xmark" size={20} color={textSecondary} />
              </TouchableOpacity>
            )}
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
    </ThemedModal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    padding: 4,
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
