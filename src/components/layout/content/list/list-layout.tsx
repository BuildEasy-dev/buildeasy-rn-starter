import React, { useCallback, useMemo } from 'react';
import { FlatListProps, ListRenderItem, RefreshControl, StyleSheet, ViewStyle } from 'react-native';
import { ThemedView, ThemedFlatList, ScrollToTopFlatList } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ListEmptyState } from './list-empty-state';
import { ListErrorState } from './list-error-state';
import { LoadingState } from '../../common/loading-state';
import { Separator } from '@/components/ui/separator';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import type { ThemedColor } from '@/components/types';
import { useTabBarScrollProps } from '@/hooks/use-tab-bar-scroll-props';

export interface ListLayoutProps<T>
  extends Omit<FlatListProps<T>, 'refreshControl' | 'ListEmptyComponent'> {
  data: T[] | null | undefined;
  renderItem: ListRenderItem<T>;

  // Loading and refresh states
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void | Promise<void>;

  // Error state
  error?: Error | string | null;
  errorMessage?: string;
  onRetry?: () => void;

  // Empty state
  emptyMessage?: string;
  emptyTitle?: string;
  emptyIcon?: IconSymbolName;
  emptyAction?: () => void;
  emptyActionLabel?: string;

  // Infinite scroll
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  loadingMore?: boolean;

  // Styling
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  separatorColor?: ThemedColor;
  showSeparator?: boolean;

  // Header and footer
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export function ListLayout<T>({
  data,
  renderItem,
  loading = false,
  refreshing = false,
  onRefresh,
  error,
  errorMessage,
  onRetry,
  emptyMessage,
  emptyTitle = 'No items found',
  emptyIcon,
  emptyAction,
  emptyActionLabel,
  onEndReached,
  onEndReachedThreshold = 0.5,
  loadingMore = false,
  containerStyle,
  contentContainerStyle,
  separatorColor,
  showSeparator = true,
  ListHeaderComponent,
  ListFooterComponent,
  enableScrollToTop = false,
  ...flatListProps
}: ListLayoutProps<T> & { enableScrollToTop?: boolean }) {
  const backgroundColor = useThemeColor('background');
  const refreshTintColor = useThemeColor('tint');
  const { bottomInset, scrollIndicatorInsets } = useTabBarScrollProps();

  // Empty component with all props
  const renderEmptyComponent = useCallback(() => {
    if (!data || data.length === 0) {
      return (
        <ListEmptyState
          title={emptyTitle}
          message={emptyMessage}
          icon={emptyIcon}
          onAction={emptyAction}
          actionLabel={emptyActionLabel}
        />
      );
    }
    return null;
  }, [data, emptyTitle, emptyMessage, emptyIcon, emptyAction, emptyActionLabel]);

  // Footer component with loading more indicator
  const renderFooterComponent = useCallback(() => {
    if (loadingMore) {
      return (
        <ThemedView style={styles.loadingMoreContainer}>
          <LoadingState />
        </ThemedView>
      );
    }
    return ListFooterComponent as React.ReactElement;
  }, [loadingMore, ListFooterComponent]);

  // Separator component
  const ItemSeparatorComponent = useMemo(() => {
    if (!showSeparator) return undefined;

    const SeparatorComponent = () => <Separator color={separatorColor} />;
    SeparatorComponent.displayName = 'ItemSeparator';
    return SeparatorComponent;
  }, [showSeparator, separatorColor]);

  // Refresh control
  const refreshControl = useMemo(() => {
    if (!onRefresh) return undefined;

    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={refreshTintColor}
        colors={[refreshTintColor]}
      />
    );
  }, [refreshing, onRefresh, refreshTintColor]);

  // Handle initial loading state
  if (loading && !data?.length && !refreshing) {
    return (
      <ThemedView style={[styles.loadingContainer, containerStyle]}>
        <LoadingState />
      </ThemedView>
    );
  }

  // Handle error state
  if (error && !data?.length && !loading && !refreshing) {
    return (
      <ThemedView style={[styles.errorContainer, containerStyle]}>
        <ListErrorState error={error} message={errorMessage} onRetry={onRetry} />
      </ThemedView>
    );
  }

  const commonProps = {
    data: data || [],
    renderItem,
    refreshControl,
    ListEmptyComponent: renderEmptyComponent,
    ListHeaderComponent,
    ListFooterComponent: renderFooterComponent,
    ItemSeparatorComponent,
    onEndReached: data && data.length > 0 ? onEndReached : undefined,
    onEndReachedThreshold,
    contentContainerStyle: [
      styles.contentContainer,
      (!data || data.length === 0) && styles.emptyContentContainer,
      { paddingBottom: bottomInset },
      contentContainerStyle,
    ],
    scrollIndicatorInsets,
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: 'handled' as const,
    ...flatListProps,
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }, containerStyle]}>
      {enableScrollToTop ? (
        <ScrollToTopFlatList {...(commonProps as any)} />
      ) : (
        <ThemedFlatList {...(commonProps as any)} />
      )}
    </ThemedView>
  );
}

/**
 * A ListLayout that automatically enables scroll-to-top functionality.
 * This provides a convenient wrapper for list components that need scroll-to-top behavior.
 */
export function ScrollableListLayout<T>(props: ListLayoutProps<T>) {
  return <ListLayout {...props} enableScrollToTop={true} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexGrow: 1,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
