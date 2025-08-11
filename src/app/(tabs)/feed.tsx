import React, { useCallback } from 'react';
import { ScrollableListView } from '@/components/layout';
import { TabScreenWrapper } from '@/components/layout/wrappers';
import { useFeedState, PostItem, type Post } from '@/features/feed';

export default function FeedScreen() {
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
    <TabScreenWrapper safeArea="top" scrollToTopOnPress>
      <ScrollableListView
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
        showSeparator={false}
      />
    </TabScreenWrapper>
  );
}
