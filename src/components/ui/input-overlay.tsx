import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

import { ThemedButton } from '@/components/themed/themed-button';
import { ThemedOverlay, type ThemedOverlayProps } from '@/components/themed/themed-overlay';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedTextInput } from '@/components/themed/themed-text-input';

export interface InputOverlayProps extends Omit<ThemedOverlayProps, 'children'> {
  /**
   * Called when the submit button is pressed
   */
  onSubmit: (value: string) => void;

  /**
   * Dialog title text
   */
  title: string;

  /**
   * Initial value for the input
   */
  initialValue?: string;

  /**
   * Placeholder text for the input
   */
  placeholder?: string;

  /**
   * Custom text for the submit button
   * @default "Submit"
   */
  submitLabel?: string;

  /**
   * Custom text for the cancel button
   * @default "Cancel"
   */
  cancelLabel?: string;

  /**
   * Whether the input should be multiline
   * @default false
   */
  multiline?: boolean;

  /**
   * Maximum number of characters allowed
   */
  maxLength?: number;

  /**
   * Validation function that returns error message if invalid
   */
  validate?: (value: string) => string | null;

  /**
   * Whether to show character counter
   * @default false
   */
  showCharacterCounter?: boolean;

  /**
   * Number of lines for multiline input
   * @default 4
   */
  numberOfLines?: number;

  /**
   * Whether the submit button should be disabled when input is empty
   * @default true
   */
  disableSubmitIfEmpty?: boolean;

  /**
   * Whether to automatically close the overlay when submit is pressed
   * @default true
   */
  closeOnSubmit?: boolean;

  /**
   * Keyboard type for the input
   */
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';

  /**
   * Auto-capitalize behavior
   */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';

  /**
   * Auto-correct behavior
   */
  autoCorrect?: boolean;
}

/**
 * An input dialog overlay component built on top of ThemedOverlay
 *
 * Provides a standard input interface with title, text input, validation,
 * character counter, and submit/cancel actions. Supports both single-line
 * and multi-line input modes.
 */
export function InputOverlay({
  onSubmit,
  onClose,
  title,
  initialValue = '',
  placeholder,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  multiline = false,
  maxLength,
  validate,
  showCharacterCounter = false,
  numberOfLines = 4,
  disableSubmitIfEmpty = true,
  closeOnSubmit = true,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  variant = 'center',
  size = 'medium',
  animationSpeed = 'fast',
  closeOnBackdropPress = false,
  ...overlayProps
}: InputOverlayProps) {
  const [value, setValue] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Auto-focus the input when overlay becomes visible
  useEffect(() => {
    if (overlayProps.visible) {
      // Small delay to ensure the overlay animation has started
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [overlayProps.visible]);

  // Validate input value when it changes
  useEffect(() => {
    if (validate) {
      const error = validate(value);
      setErrorMessage(error);
    }
  }, [value, validate]);

  // Stable handlers to prevent unnecessary re-renders
  const handleSubmit = useCallback(() => {
    if (validate) {
      const error = validate(value);
      if (error) {
        setErrorMessage(error);
        return;
      }
    }

    onSubmit(value);
    if (closeOnSubmit && onClose) {
      onClose();
    }
  }, [onSubmit, value, validate, closeOnSubmit, onClose]);

  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleValueChange = useCallback(
    (text: string) => {
      setValue(text);
      // Clear error message when user starts typing
      if (errorMessage) {
        setErrorMessage(null);
      }
    },
    [errorMessage]
  );

  // Memoize submit button disabled state
  const isSubmitDisabled = useMemo(() => {
    if (disableSubmitIfEmpty && value.trim().length === 0) {
      return true;
    }
    if (errorMessage) {
      return true;
    }
    return false;
  }, [disableSubmitIfEmpty, value, errorMessage]);

  // Memoize character counter text
  const characterCounterText = useMemo(() => {
    if (!showCharacterCounter) return null;
    if (maxLength) {
      return `${value.length}/${maxLength}`;
    }
    return `${value.length}`;
  }, [showCharacterCounter, value.length, maxLength]);

  // Memoize input status based on error state
  const inputStatus = useMemo(() => {
    return errorMessage ? 'error' : 'default';
  }, [errorMessage]);

  return (
    <ThemedOverlay
      variant={variant}
      size={size}
      animationSpeed={animationSpeed}
      closeOnBackdropPress={closeOnBackdropPress}
      onClose={onClose}
      {...overlayProps}
    >
      <View style={styles.container}>
        {/* Title */}
        <ThemedText type="h5" style={styles.title}>
          {title}
        </ThemedText>

        {/* Input Field */}
        <ThemedTextInput
          ref={inputRef}
          value={value}
          onChangeText={handleValueChange}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          status={inputStatus}
          helperText={errorMessage || undefined}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          returnKeyType={multiline ? undefined : 'done'}
          onSubmitEditing={multiline ? undefined : handleSubmit}
          blurOnSubmit={!multiline}
          style={styles.input}
          containerStyle={styles.inputContainer}
          accessibilityLabel={title}
          accessibilityHint="Enter text and press submit to confirm"
        />

        {/* Character Counter */}
        {characterCounterText && (
          <ThemedText type="caption" style={styles.characterCounter}>
            {characterCounterText}
          </ThemedText>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <ThemedButton
            variant="outline"
            size="medium"
            label={cancelLabel}
            onPress={handleCancel}
            style={styles.cancelButton}
            accessibilityLabel={`${cancelLabel} button`}
            accessibilityHint="Cancels the input and closes the dialog"
          />

          <ThemedButton
            variant="primary"
            size="medium"
            label={submitLabel}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
            style={styles.submitButton}
            accessibilityLabel={`${submitLabel} button`}
            accessibilityHint="Submits the entered text"
          />
        </View>
      </View>
    </ThemedOverlay>
  );
}

const styles = StyleSheet.create({
  container: {
    // No additional padding needed - overlay variant handles this
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    // Additional input-specific styles if needed
  },
  characterCounter: {
    textAlign: 'right',
    marginTop: -12,
    marginBottom: 20,
    opacity: 0.7,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  submitButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
