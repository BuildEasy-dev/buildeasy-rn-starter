import React, { useCallback, useState } from 'react';
import { ScrollableListLayout } from '@/components/layout';
import { TabScreenWrapper } from '@/components/layout/wrappers';
import {
  useFeedState,
  PostItem,
  FeedDebugButton,
  FeedDebugModal,
  type Post,
} from '@/features/feed';

export default function FeedScreen() {
  const [debugModalVisible, setDebugModalVisible] = useState(false);

  const {
    posts,
    refreshing,
    loading,
    error,
    loadingMore,
    handleRefresh,
    handleLike,
    handleRepost,
    handleBookmark,
    handleReply,
    handleShare,
    handleLoadMore,
    handleRetry,
    debugEmptyState,
    debugErrorState,
    toggleEmptyState,
    toggleErrorState,
  } = useFeedState();

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostItem
        post={item}
        onLike={handleLike}
        onRepost={handleRepost}
        onReply={handleReply}
        onBookmark={handleBookmark}
        onShare={handleShare}
      />
    ),
    [handleLike, handleRepost, handleReply, handleBookmark, handleShare]
  );

  return (
    <>
      <TabScreenWrapper
        safeArea="top"
        scrollToTopOnPress
        headerTitle="Feed"
        headerRight={<FeedDebugButton onPress={() => setDebugModalVisible(true)} />}
      >
        <ScrollableListLayout
          estimatedItemSize={120}
          data={posts}
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
          emptyTitle="No posts yet"
          emptyMessage="Follow people to see their posts here"
          emptyIcon="bubble.left"
          showSeparator={true}
        />
      </TabScreenWrapper>

      <FeedDebugModal
        visible={debugModalVisible}
        onClose={() => setDebugModalVisible(false)}
        debugEmptyState={debugEmptyState}
        debugErrorState={debugErrorState}
        onToggleEmptyState={toggleEmptyState}
        onToggleErrorState={toggleErrorState}
      />
    </>
  );
}
