import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { ThemedView, ThemedText, ScrollToTopFlashList } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTabBarScrollProps } from '@/hooks/use-tab-bar-scroll-props';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getOptimizedImageUrl, IMAGE_SIZES, DEFAULT_BLURHASH } from '../utils/image-utils';
import type { PhotoPost } from '../types/photo.types';

const { width: screenWidth } = Dimensions.get('window');
const GRID_SPACING = 2;
const GRID_COLUMNS = 3;
const ITEM_SIZE = (screenWidth - GRID_SPACING * (GRID_COLUMNS + 1)) / GRID_COLUMNS;

interface PhotoGridProps {
  data: PhotoPost[];
  onPhotoPress: (post: PhotoPost, index: number) => void;
  onEndReached?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  loading?: boolean;
  hasMore?: boolean;
}

interface PhotoGridItemProps {
  item: PhotoPost;
  index: number;
  onPress: (post: PhotoPost, index: number) => void;
}

const PhotoGridItem = memo(
  ({ item, index, onPress }: PhotoGridItemProps) => {
    const handlePress = useCallback(() => {
      onPress(item, index);
    }, [item, index, onPress]);

    // Generate optimized thumbnail URL for grid view
    const thumbnailUrl = useMemo(() => {
      return getOptimizedImageUrl(item.image.url, IMAGE_SIZES.THUMBNAIL, 75);
    }, [item.image.url]);

    // Only show modals for special items
    const showMultipleIndicator = item.stats.comments > 10;
    const showPopularModal = item.isLiked;

    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.gridItem, { opacity: pressed ? 0.8 : 1 }]}
      >
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          recyclingKey={item.id}
          placeholder={{ blurhash: DEFAULT_BLURHASH }}
          placeholderContentFit="cover"
        />

        {/* Multiple photos indicator */}
        {showMultipleIndicator && (
          <ThemedView style={styles.multipleIndicator}>
            <IconSymbol name="square.stack" size={16} color="white" />
          </ThemedView>
        )}

        {/* Popular post modal - simplified */}
        {showPopularModal && (
          <ThemedView style={styles.popularBadge}>
            <IconSymbol name="heart.fill" size={14} color="white" />
          </ThemedView>
        )}
      </Pressable>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.isLiked === nextProps.item.isLiked &&
      prevProps.index === nextProps.index
    );
  }
);

PhotoGridItem.displayName = 'PhotoGridItem';

export function PhotoGrid({
  data,
  onPhotoPress,
  onEndReached,
  refreshing,
  onRefresh,
  loading = false,
  hasMore = true,
}: PhotoGridProps) {
  const tabBarProps = useTabBarScrollProps();
  const tintColor = useThemeColor('tint');
  const secondaryTextColor = useThemeColor('tabIconDefault');
  const borderColor = useThemeColor('separator');

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <PhotoGridItem item={item as PhotoPost} index={index} onPress={onPhotoPress} />
    ),
    [onPhotoPress]
  );

  const renderSeparator = useCallback(() => <ThemedView style={styles.separator} />, []);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderFooter = useCallback(() => {
    // Show loading indicator when fetching more data
    if (loading && data.length > 0) {
      return (
        <ThemedView style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={tintColor} />
          <ThemedText type="body1" style={{ color: secondaryTextColor }}>
            Loading more...
          </ThemedText>
        </ThemedView>
      );
    }

    // Show end indicator when no more data
    if (!hasMore && data.length > 0) {
      return (
        <ThemedView style={styles.footer}>
          <ThemedView style={styles.endIndicator}>
            <ThemedView style={[styles.endLine, { backgroundColor: borderColor }]} />
            <ThemedText type="body1" style={{ color: secondaryTextColor }}>
              No more photos
            </ThemedText>
            <ThemedView style={[styles.endLine, { backgroundColor: borderColor }]} />
          </ThemedView>
        </ThemedView>
      );
    }

    return null;
  }, [loading, hasMore, data.length, tintColor, secondaryTextColor, borderColor]);

  // Optimize FlashList configuration
  const overrideItemLayout = useCallback((_layout: any, _item: any, _index: number) => {
    return {
      length: ITEM_SIZE + GRID_SPACING,
      offset: Math.floor(_index / GRID_COLUMNS) * (ITEM_SIZE + GRID_SPACING),
      index: _index,
    };
  }, []);

  return (
    <ScrollToTopFlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={GRID_COLUMNS}
      estimatedItemSize={ITEM_SIZE}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ ...styles.container, ...tabBarProps.contentContainerStyle }}
      scrollIndicatorInsets={tabBarProps.scrollIndicatorInsets}
      ItemSeparatorComponent={renderSeparator}
      ListFooterComponent={renderFooter}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      refreshing={refreshing}
      onRefresh={onRefresh}
      overrideItemLayout={overrideItemLayout}
      drawDistance={ITEM_SIZE * 6} // Pre-render 2 rows ahead
      removeClippedSubviews={true}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: GRID_SPACING,
  },
  row: {
    justifyContent: 'space-between',
  },
  separator: {
    height: GRID_SPACING,
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  multipleIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  videoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  popularBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footer: {
    paddingVertical: 20,
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
    marginHorizontal: 12,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
