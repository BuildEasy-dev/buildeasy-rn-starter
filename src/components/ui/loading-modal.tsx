import { forwardRef, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View, type ViewStyle } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

import { ThemedModal, type ThemedModalProps } from '@/components/themed/themed-modal';
import { ThemedText } from '@/components/themed/themed-text';

export type ThemedLoadingModalProps = Omit<
  ThemedModalProps,
  'children' | 'closeOnBackdropPress'
> & {
  message?: string;
  indicatorSize?: 'small' | 'large';
  lightIndicatorColor?: string;
  darkIndicatorColor?: string;
  indicatorContainerStyle?: ViewStyle;
};

/**
 * A theme-aware Loading Modal component that displays an activity indicator.
 *
 * Built on top of ThemedModal with added loading indicator and optional message.
 */
export const ThemedLoadingModal = forwardRef<View, ThemedLoadingModalProps>(
  (
    {
      style,
      lightColor,
      darkColor,
      message,
      indicatorSize = 'large',
      lightIndicatorColor,
      darkIndicatorColor,
      indicatorContainerStyle,
      contentContainerStyle,
      ...rest
    },
    ref
  ) => {
    // Get theme colors
    const indicatorColor = useThemeColor('tint', {
      light: lightIndicatorColor,
      dark: darkIndicatorColor,
    });

    // Memoize combined styles for the content container
    const combinedContentStyle = useMemo(
      (): ViewStyle => ({
        ...styles.contentContainer,
        ...(contentContainerStyle || {}),
      }),
      [contentContainerStyle]
    );

    return (
      <ThemedModal
        ref={ref}
        lightColor={lightColor || '#ffffff'}
        darkColor={darkColor || '#1c1c1e'}
        closeOnBackdropPress={false}
        contentContainerStyle={combinedContentStyle}
        style={style}
        {...rest}
      >
        <View style={[styles.indicatorContainer, indicatorContainerStyle]}>
          <ActivityIndicator size={indicatorSize} color={indicatorColor} />

          {message && <ThemedText style={styles.message}>{message}</ThemedText>}
        </View>
      </ThemedModal>
    );
  }
);

ThemedLoadingModal.displayName = 'ThemedLoadingModal';

const styles = StyleSheet.create({
  contentContainer: {
    minWidth: '50%',
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
});
