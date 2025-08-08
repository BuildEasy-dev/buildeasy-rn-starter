import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  type ViewStyle,
  StyleSheet,
} from 'react-native';
import { YStack } from '@tamagui/stacks';
import { useThemeColor } from '@/hooks/use-theme-color';
import { SafeAreaWrapper } from '../common/safe-area-wrapper';
import { LoadingState } from '../common/loading-state';
import { ErrorState } from '../common/error-state';
import { EmptyState } from '../common/empty-state';
import { ThemedScrollView } from '@/components/themed/themed-scroll-view';
import type { ThemedColor } from '@/components/types';

export interface ScreenWrapperProps {
  children: React.ReactNode;

  // Layout
  safeArea?: boolean | 'top' | 'bottom' | 'both';
  padding?: boolean | number;
  scrollable?: boolean;

  // States
  loading?: boolean;
  error?: Error | string | null;
  empty?: boolean;

  // Empty state customization
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: React.ComponentProps<typeof EmptyState>['icon'];
  emptyActionLabel?: string;
  onEmptyAction?: () => void;

  // Functionality
  onRefresh?: () => Promise<void> | void;
  onRetry?: () => void;
  keyboardAvoiding?: boolean;

  // Styling
  backgroundColor?: ThemedColor;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;

  // Loading customization
  loadingMessage?: string;
}

export function ScreenWrapper({
  children,
  safeArea = false,
  padding = false,
  scrollable = false,
  loading = false,
  error = null,
  empty = false,
  emptyTitle,
  emptyMessage,
  emptyIcon,
  emptyActionLabel,
  onEmptyAction,
  onRefresh,
  onRetry,
  keyboardAvoiding = true,
  backgroundColor,
  contentContainerStyle,
  style,
  loadingMessage,
}: ScreenWrapperProps) {
  const [refreshing, setRefreshing] = useState(false);

  // Move hooks to top level
  const tintColor = useThemeColor('tint');
  const bgColor = useThemeColor('background', backgroundColor);

  const paddingValue = typeof padding === 'number' ? padding : padding ? 16 : 0;

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;

    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  // Determine what to render
  const renderContent = () => {
    if (loading) {
      return <LoadingState message={loadingMessage} fullScreen />;
    }

    if (error) {
      return <ErrorState error={error} onRetry={onRetry || handleRefresh} fullScreen />;
    }

    if (empty) {
      return (
        <EmptyState
          title={emptyTitle}
          message={emptyMessage}
          icon={emptyIcon}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
          fullScreen
        />
      );
    }

    return children;
  };

  // Main content with optional padding
  const content = (
    <YStack flex={1} backgroundColor={bgColor} padding={paddingValue} style={contentContainerStyle}>
      {renderContent()}
    </YStack>
  );

  // Scrollable wrapper
  const scrollableContent = scrollable ? (
    <ThemedScrollView
      style={[{ flex: 1 }, style]}
      lightColor={backgroundColor?.light}
      darkColor={backgroundColor?.dark}
      contentContainerStyle={[
        styles.scrollContent,
        {
          padding: paddingValue,
          paddingBottom: safeArea === 'bottom' || safeArea === 'both' ? paddingValue : 20,
        },
        contentContainerStyle,
      ]}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tintColor} />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {renderContent()}
    </ThemedScrollView>
  ) : (
    content
  );

  // Keyboard avoiding wrapper
  const keyboardAvoidingContent =
    keyboardAvoiding && Platform.OS === 'ios' ? (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
        {scrollableContent}
      </KeyboardAvoidingView>
    ) : (
      scrollableContent
    );

  // Safe area wrapper
  return (
    <SafeAreaWrapper edges={safeArea} backgroundColor={bgColor} style={style}>
      {keyboardAvoidingContent}
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
});
