import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { ScreenWrapper } from '@/components/layout';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedScrollView } from '@/components/themed/themed-scroll-view';
import { ModalHeaderButton, HeaderButtonVariant } from './modal-header-button';

type HeaderButtonConfig = {
  variant: HeaderButtonVariant;
  text?: string;
  onPress?: () => void;
  disabled?: boolean;
};

interface ModalWrapperProps {
  children: ReactNode;

  // Header configuration - header will be shown if any of these props are provided
  headerTitle?: string;
  headerTitleAlign?: 'left' | 'center' | 'right';
  headerLeft?: ReactNode | HeaderButtonConfig;
  headerRight?: ReactNode | HeaderButtonConfig;

  // Content configuration
  scrollable?: boolean;
}

export function ModalWrapper({
  children,
  headerTitle,
  headerTitleAlign = 'center',
  headerLeft,
  headerRight,
  scrollable = true,
}: ModalWrapperProps) {
  // Auto-determine if header should be shown based on header props
  const hasHeaderProps = !!(headerTitle || headerLeft || headerRight);
  // Helper function to render header button
  const renderHeaderButton = (config: ReactNode | HeaderButtonConfig | undefined) => {
    if (!config) return null;

    // If it's a React element, return as-is
    if (React.isValidElement(config)) {
      return config;
    }

    // If it's a config object, create a ModalHeaderButton
    if (typeof config === 'object' && 'variant' in config) {
      return (
        <ModalHeaderButton
          variant={config.variant}
          text={config.text}
          onPress={config.onPress}
          disabled={config.disabled}
        />
      );
    }

    return null;
  };

  const ModalHeader = () => (
    <ThemedView style={styles.header}>
      {/* Left Button */}
      <ThemedView style={styles.headerLeft}>{renderHeaderButton(headerLeft)}</ThemedView>

      {/* Title */}
      {headerTitle && (
        <ThemedText style={[styles.headerTitle, { textAlign: headerTitleAlign }]}>
          {headerTitle}
        </ThemedText>
      )}

      {/* Right Button */}
      <ThemedView style={styles.headerRight}>{renderHeaderButton(headerRight)}</ThemedView>
    </ThemedView>
  );

  const content = scrollable ? (
    <ThemedScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
      {children}
    </ThemedScrollView>
  ) : (
    <ThemedView style={styles.content}>{children}</ThemedView>
  );

  return (
    <ScreenWrapper safeArea="top">
      {hasHeaderProps && <ModalHeader />}
      {content}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  headerLeft: {
    minWidth: 80,
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
  },
  headerRight: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
});
