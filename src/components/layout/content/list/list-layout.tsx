import React, { useCallback, useMemo } from 'react';
import {
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { ListRenderItem as FlashListRenderItem, ContentStyle } from '@shopify/flash-list';
import { ThemedView, ThemedFlashList, ScrollToTopFlashList, ThemedText } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ListEmptyState } from './list-empty-state';
import { ListErrorState } from './list-error-state';
import { LoadingState } from '@/components/layout/common/loading-state';
import { Separator } from '@/components/ui/separator';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import type { ThemedColor } from '@/components/types';
import { useTabBarScrollProps } from '@/hooks/use-tab-bar-scroll-props';

/**
 * Props for ListLayout component.
 *
 * This component uses FlashList by default, which is suitable for:
 * - Lists with many items (>20)
 * - Complex item layouts (cards, media content)
 * - Dynamic content with varying item sizes
 *
 * Consider alternatives when:
 * - Need specific FlatList features not available in FlashList
 * - Working with simple, uniform items in small lists
 * - Require precise control over item measurement and rendering
 */
export interface ListLayoutProps<T> {
  data: T[] | null | undefined;
  renderItem: ListRenderItem<T> | FlashListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;

  // FlashList specific props
  estimatedItemSize?: number;

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
  hasMore?: boolean;

  // Styling
  containerStyle?: ViewStyle;
  contentContainerStyle?: ContentStyle;
  separatorColor?: ThemedColor;
  showSeparator?: boolean;

  // Header and footer
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export function ListLayout<T>({
  data,
  renderItem,
  estimatedItemSize,
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
  hasMore = true,
  containerStyle,
  contentContainerStyle,
  separatorColor,
  showSeparator = true,
  ListHeaderComponent,
  ListFooterComponent,
  enableScrollToTop = false,
  ...listProps
}: ListLayoutProps<T> & { enableScrollToTop?: boolean }) {
  const backgroundColor = useThemeColor('background');
  const tintColor = useThemeColor('tint');
  const secondaryTextColor = useThemeColor('tabIconDefault');
  const borderColor = useThemeColor('separator');
  const { bottomInset, scrollIndicatorInsets } = useTabBarScrollProps();

  // Combine contentContainerStyle with required bottom padding
  // Note: FlashList contentContainerStyle doesn't support flexGrow, so we handle
  // empty state styling through the parent container
  const finalContentContainerStyle = useMemo((): ContentStyle => {
    return {
      paddingBottom: bottomInset,
      ...contentContainerStyle,
    };
  }, [bottomInset, contentContainerStyle]);

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
    // Show loading indicator when fetching more data
    if (loadingMore && data && data.length > 0) {
      return (
        <ThemedView style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={tintColor} />
          <ThemedText style={[styles.loadingText, { color: secondaryTextColor }]}>
            Loading more...
          </ThemedText>
        </ThemedView>
      );
    }

    // Show end indicator when no more data
    if (!hasMore && data && data.length > 0) {
      return (
        <ThemedView style={styles.footer}>
          <ThemedView style={styles.endIndicator}>
            <ThemedView style={[styles.endLine, { backgroundColor: borderColor }]} />
            <ThemedText style={[styles.endText, { color: secondaryTextColor }]}>
              No more posts
            </ThemedText>
            <ThemedView style={[styles.endLine, { backgroundColor: borderColor }]} />
          </ThemedView>
        </ThemedView>
      );
    }

    return ListFooterComponent as React.ReactElement;
  }, [loadingMore, hasMore, data, tintColor, secondaryTextColor, borderColor, ListFooterComponent]);

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

    return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;
  }, [refreshing, onRefresh]);

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

  // FlashList props
  const flashListProps = {
    data: data || [],
    renderItem,
    refreshControl,
    ListEmptyComponent: renderEmptyComponent,
    ListHeaderComponent,
    ListFooterComponent: renderFooterComponent,
    ItemSeparatorComponent,
    onEndReached: data && data.length > 0 ? onEndReached : undefined,
    onEndReachedThreshold,
    contentContainerStyle: finalContentContainerStyle,
    scrollIndicatorInsets,
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: 'handled' as const,
    // FlashList uses estimatedItemSize for item height estimation
    estimatedItemSize: estimatedItemSize || 100,
    ...listProps,
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }, containerStyle]}>
      {enableScrollToTop ? (
        <ScrollToTopFlashList {...(flashListProps as any)} />
      ) : (
        <ThemedFlashList {...(flashListProps as any)} />
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
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  endIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  endLine: {
    height: StyleSheet.hairlineWidth,
    flex: 1,
    opacity: 0.3,
  },
  endText: {
    fontSize: 12,
    marginHorizontal: 12,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
