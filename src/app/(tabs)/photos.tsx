import React, { useState } from 'react';
import { StyleSheet, FlatList, RefreshControl, Pressable } from 'react-native';
import { TabScreenWrapper, LoadingState, EmptyState, ErrorState } from '@/components/layout';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTabBarScrollProps } from '@/hooks/use-tab-bar-scroll-props';
import {
  PhotoItem,
  PhotoGrid,
  PhotoDetailItem,
  usePhotosFeed,
  type PhotoPost,
} from '@/features/photos';

export default function PhotosScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoPost | null>(null);

  const tintColor = useThemeColor('tint');
  const textColor = useThemeColor('text');
  const borderColor = useThemeColor('separator');
  const tabBarProps = useTabBarScrollProps();

  const {
    posts,
    loading,
    error,
    refreshing,
    hasMore,
    refresh,
    loadMore,
    toggleLike,
    toggleBookmark,
    handleComment,
    handleShare,
    handleUserPress,
  } = usePhotosFeed();

  const handlePhotoPress = (post: PhotoPost, _index: number) => {
    setSelectedPhoto(post);
  };

  const closeDetailModal = () => {
    setSelectedPhoto(null);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };

  const renderPhoto = ({ item }: { item: any }) => (
    <PhotoItem
      post={item}
      onLike={toggleLike}
      onComment={handleComment}
      onShare={handleShare}
      onBookmark={toggleBookmark}
      onUserPress={handleUserPress}
    />
  );

  const renderFooter = () => {
    if (!hasMore) {
      return (
        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>You&apos;ve reached the end! 📸</ThemedText>
        </ThemedView>
      );
    }

    if (loading && posts.length > 0) {
      return <LoadingState />;
    }

    return null;
  };

  const renderEmpty = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState message={error} onRetry={refresh} />;
    }

    return (
      <EmptyState title="No photos yet" message="Be the first to share a photo!" icon="photo" />
    );
  };

  const renderHeader = () => (
    <ThemedView style={[styles.header, { borderBottomColor: borderColor }]}>
      <ThemedView style={styles.headerLeft}>
        <ThemedText style={styles.headerTitle}>Photos</ThemedText>
        <ThemedText style={[styles.postCount, { color: textColor }]}>
          {posts.length} posts
        </ThemedText>
      </ThemedView>

      <Pressable
        onPress={toggleViewMode}
        style={({ pressed }) => [styles.viewToggle, { opacity: pressed ? 0.7 : 1 }]}
      >
        <IconSymbol
          name={viewMode === 'grid' ? 'square.stack' : 'square.grid.3x3'}
          size={24}
          color={tintColor}
        />
      </Pressable>
    </ThemedView>
  );

  return (
    <TabScreenWrapper safeArea="top" scrollToTopOnPress>
      <ThemedView style={styles.container}>
        {renderHeader()}

        {viewMode === 'grid' ? (
          <PhotoGrid
            data={posts}
            onPhotoPress={handlePhotoPress}
            onEndReached={loadMore}
            refreshing={refreshing}
            onRefresh={refresh}
          />
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPhoto}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              posts.length === 0 ? styles.emptyContainer : undefined,
              tabBarProps.contentContainerStyle,
            ]}
            scrollIndicatorInsets={tabBarProps.scrollIndicatorInsets}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            removeClippedSubviews={false}
          />
        )}

        {/* Photo Detail Modal */}
        {selectedPhoto && (
          <PhotoDetailItem
            post={selectedPhoto}
            visible={!!selectedPhoto}
            onClose={closeDetailModal}
            onLike={toggleLike}
            onComment={handleComment}
            onShare={handleShare}
            onBookmark={toggleBookmark}
            onUserPress={handleUserPress}
          />
        )}
      </ThemedView>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  postCount: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  viewToggle: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
});
