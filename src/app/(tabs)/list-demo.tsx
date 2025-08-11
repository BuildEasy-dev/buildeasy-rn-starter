import React, { useCallback } from 'react';
import { ScrollableListView } from '@/components/layout';
import { TabScreenWrapper } from '@/components/layout/wrappers';
import {
  useListDemoState,
  ListDemoHeader,
  DemoListItem,
  type DemoItem,
} from '@/features/list-demo';

export default function ListDemoScreen() {
  const {
    data,
    refreshing,
    loading,
    error,
    showEmpty,
    showError,
    loadingMore,
    handleRefresh,
    handleItemPress,
    handleEmptyAction,
    handleRetry,
    handleLoadMore,
    toggleEmptyState,
    toggleErrorState,
  } = useListDemoState();

  const renderItem = useCallback(
    ({ item }: { item: DemoItem }) => (
      <DemoListItem
        title={item.title}
        subtitle={item.subtitle}
        description={item.description}
        badge={item.badge}
        leadingIcon={item.icon}
        showChevron
        onPress={() => handleItemPress(item)}
      />
    ),
    [handleItemPress]
  );

  const ListHeader = () => (
    <ListDemoHeader
      showEmpty={showEmpty}
      showError={showError}
      onToggleEmptyState={toggleEmptyState}
      onToggleErrorState={toggleErrorState}
    />
  );

  return (
    <TabScreenWrapper safeArea="top" scrollToTopOnPress>
      <ScrollableListView
        data={showEmpty || showError ? [] : data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        loadingMore={loadingMore}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        emptyTitle="No items available"
        emptyMessage="Try toggling the switch above or pull to refresh"
        emptyIcon="doc.text"
        emptyAction={handleEmptyAction}
        emptyActionLabel="Load Sample Data"
        showSeparator
        ListHeaderComponent={ListHeader}
      />
    </TabScreenWrapper>
  );
}
