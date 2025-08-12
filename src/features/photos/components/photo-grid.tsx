import React from 'react';
import { StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import { ThemedView, ScrollToTopFlashList } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTabBarScrollProps } from '@/hooks/use-tab-bar-scroll-props';
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
}

interface PhotoGridItemProps {
  item: PhotoPost;
  index: number;
  onPress: (post: PhotoPost, index: number) => void;
}

function PhotoGridItem({ item, index, onPress }: PhotoGridItemProps) {
  return (
    <Pressable
      onPress={() => onPress(item, index)}
      style={({ pressed }) => [styles.gridItem, { opacity: pressed ? 0.8 : 1 }]}
    >
      <Image source={{ uri: item.image.url }} style={styles.image} resizeMode="cover" />

      {/* Multiple photos indicator */}
      {item.stats.comments > 10 && (
        <ThemedView style={styles.multipleIndicator}>
          <IconSymbol name="square.stack" size={16} color="white" />
        </ThemedView>
      )}

      {/* Video indicator (if we add video support later) */}
      {/* {item.type === 'video' && (
        <ThemedView style={styles.videoIndicator}>
          <IconSymbol name="play.fill" size={16} color="white" />
        </ThemedView>
      )} */}

      {/* Popular post overlay */}
      {item.stats.likes > 1000 && (
        <ThemedView style={styles.overlay}>
          <ThemedView style={styles.overlayStats}>
            <IconSymbol name="heart.fill" size={16} color="white" />
            <ThemedView style={styles.statText}>
              <IconSymbol name="bubble.left" size={16} color="white" />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      )}
    </Pressable>
  );
}

export function PhotoGrid({
  data,
  onPhotoPress,
  onEndReached,
  refreshing,
  onRefresh,
}: PhotoGridProps) {
  const tabBarProps = useTabBarScrollProps();

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <PhotoGridItem item={item as PhotoPost} index={index} onPress={onPhotoPress} />
  );

  const renderSeparator = () => <ThemedView style={styles.separator} />;

  return (
    <ScrollToTopFlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item: any) => item.id}
      numColumns={GRID_COLUMNS}
      estimatedItemSize={ITEM_SIZE}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ ...styles.container, ...tabBarProps.contentContainerStyle }}
      scrollIndicatorInsets={tabBarProps.scrollIndicatorInsets}
      ItemSeparatorComponent={renderSeparator}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
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
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0, // Hidden by default, shown on hover/press in web
  },
  overlayStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    marginLeft: 4,
  },
});
