import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ThemedView } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ListEmptyState } from './list-empty-state';
import { LoadingState } from '../../common/loading-state';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { useTabBarScrollProps } from '@/hooks/use-tab-bar-scroll-props';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export interface ListLayoutProps<T>
  extends Omit<FlatListProps<T>, 'refreshControl' | 'ListEmptyComponent'> {
  data: T[] | null | undefined;
  renderItem: ListRenderItem<T>;

  // Loading and refresh states
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void | Promise<void>;

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
  separatorColor?: string;
  showSeparator?: boolean;

  // Header and footer
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
}

// Base ListLayout component without scroll-to-top integration
function BaseListLayout<T>({
  data,
  renderItem,
  loading = false,
  refreshing = false,
  onRefresh,
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
  const defaultSeparatorColor = useThemeColor('border');
  const backgroundColor = useThemeColor('background');
  const refreshTintColor = useThemeColor('tint');
  const { bottomInset, scrollIndicatorInsets } = useTabBarScrollProps();
  const flatListRef = useRef<FlatList<T>>(null);
  const scrollToTopContext = useScrollToTop();

  const finalSeparatorColor = separatorColor || defaultSeparatorColor;

  // Register scroll handler with context (only if enableScrollToTop is true)
  useEffect(() => {
    if (!enableScrollToTop) return;

    if (scrollToTopContext && flatListRef.current) {
      const scrollHandler = (options?: { x?: number; y?: number; animated?: boolean }) => {
        flatListRef.current?.scrollToOffset({
          offset: options?.y || 0,
          animated: options?.animated ?? true,
        });
      };

      scrollToTopContext.registerScrollHandler(scrollHandler);
    }
  }, [scrollToTopContext, data, enableScrollToTop]);

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

    const SeparatorComponent = () => (
      <ThemedView style={[styles.separator, { backgroundColor: finalSeparatorColor }]} />
    );
    SeparatorComponent.displayName = 'ItemSeparator';
    return SeparatorComponent;
  }, [showSeparator, finalSeparatorColor]);

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

  return (
    <ThemedView style={[styles.container, { backgroundColor }, containerStyle]}>
      <FlatList
        ref={flatListRef}
        data={data || []}
        renderItem={renderItem}
        refreshControl={refreshControl}
        ListEmptyComponent={renderEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={renderFooterComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        onEndReached={data && data.length > 0 ? onEndReached : undefined}
        onEndReachedThreshold={onEndReachedThreshold}
        contentContainerStyle={[
          styles.contentContainer,
          (!data || data.length === 0) && styles.emptyContentContainer,
          { paddingBottom: bottomInset },
          contentContainerStyle,
        ]}
        scrollIndicatorInsets={scrollIndicatorInsets}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        {...flatListProps}
      />
    </ThemedView>
  );
}

// Export the base version (without scroll-to-top by default)
export function ListLayout<T>(props: ListLayoutProps<T>) {
  return <BaseListLayout {...props} enableScrollToTop={false} />;
}

/**
 * A ListLayout that automatically integrates with TabScreenWrapper's scroll-to-top functionality
 * Similar to ScrollableParallaxView, this provides a convenient wrapper for list components
 * that need scroll-to-top behavior without manually handling the context registration.
 */
export function ScrollableListView<T>(props: ListLayoutProps<T>) {
  return <BaseListLayout {...props} enableScrollToTop={true} />;
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
  contentContainer: {
    flexGrow: 1,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
