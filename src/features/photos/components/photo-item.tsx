import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText, ThemedView } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TextAvatar } from '@/components/ui/avatar';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatRelativeTime } from '@/utils/time';
import { getOptimizedImageUrl, IMAGE_SIZES, DEFAULT_BLURHASH } from '../utils/image-utils';
import type { PhotoPost } from '../types/photo.types';

const { width: screenWidth } = Dimensions.get('window');
const POST_PADDING = 16;
const POST_WIDTH = screenWidth - POST_PADDING * 2;

interface PhotoItemProps {
  post: PhotoPost;
  onLike: (id: string) => void;
  onComment: (post: PhotoPost) => void;
  onShare: (post: PhotoPost) => void;
  onBookmark: (id: string) => void;
  onUserPress: (userId: string) => void;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export function PhotoItem({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onUserPress,
}: PhotoItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use medium quality image for feed
  const feedImageUrl = useMemo(() => {
    return getOptimizedImageUrl(post.image.url, IMAGE_SIZES.FEED);
  }, [post.image.url]);
  const tintColor = useThemeColor('tint');
  const textColor = useThemeColor('text');
  const secondaryTextColor = useThemeColor('tabIconDefault');

  const imageHeight = POST_WIDTH / post.image.aspectRatio;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => onUserPress(post.user.id)} style={styles.userInfo}>
          <TextAvatar name={post.user.name} size={32} />
          <View style={styles.userDetails}>
            <View style={styles.usernameRow}>
              <ThemedText type="body1" weight="semibold">
                {post.user.username}
              </ThemedText>
              {post.user.verified && (
                <IconSymbol
                  name="checkmark.seal.fill"
                  size={14}
                  color={tintColor}
                  style={styles.verifiedIcon}
                />
              )}
            </View>
            {post.location && (
              <ThemedText type="body1" style={{ color: secondaryTextColor }}>
                {post.location.name}
              </ThemedText>
            )}
          </View>
        </Pressable>

        <Pressable style={styles.moreButton}>
          <IconSymbol name="ellipsis" size={20} color={secondaryTextColor} />
        </Pressable>
      </View>

      {/* Photo */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: feedImageUrl }}
          style={[styles.image, { height: imageHeight }]}
          contentFit="cover"
          transition={300}
          cachePolicy="memory-disk"
          placeholder={{ blurhash: DEFAULT_BLURHASH }}
          placeholderContentFit="cover"
          onLoad={() => setImageLoaded(true)}
          accessibilityLabel={post.image.alt}
        />
        {!imageLoaded && (
          <View style={[styles.imagePlaceholder, { height: imageHeight }]}>
            <ThemedText type="body1" style={{ color: secondaryTextColor }}>
              Loading...
            </ThemedText>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <Pressable onPress={() => onLike(post.id)} style={styles.actionButton}>
            <IconSymbol
              name={post.isLiked ? 'heart.fill' : 'heart'}
              size={24}
              color={post.isLiked ? '#E0245E' : textColor}
            />
          </Pressable>

          <Pressable onPress={() => onComment(post)} style={styles.actionButton}>
            <IconSymbol name="bubble.left" size={24} color={textColor} />
          </Pressable>

          <Pressable onPress={() => onShare(post)} style={styles.actionButton}>
            <IconSymbol name="paperplane" size={24} color={textColor} />
          </Pressable>
        </View>

        <Pressable onPress={() => onBookmark(post.id)} style={styles.actionButton}>
          <IconSymbol
            name={post.isBookmarked ? 'bookmark.fill' : 'bookmark'}
            size={24}
            color={post.isBookmarked ? textColor : textColor}
          />
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <ThemedText type="body1" weight="semibold">
          {formatNumber(post.stats.likes)} likes
        </ThemedText>
      </View>

      {/* Caption */}
      {post.caption && (
        <View style={styles.caption}>
          <ThemedText type="body1">
            <ThemedText type="body1" weight="semibold">
              {post.user.username}
            </ThemedText>
            <ThemedText type="body1"> {post.caption}</ThemedText>
          </ThemedText>
        </View>
      )}

      {/* Comments */}
      {post.stats.comments > 0 && (
        <Pressable onPress={() => onComment(post)} style={styles.commentsButton}>
          <ThemedText type="body1" style={{ color: secondaryTextColor }}>
            View all {formatNumber(post.stats.comments)} comments
          </ThemedText>
        </Pressable>
      )}

      {/* Timestamp */}
      <View style={styles.timestamp}>
        <ThemedText type="body1" style={{ color: secondaryTextColor }}>
          {formatRelativeTime(post.timestamp)}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    marginLeft: 8,
    flex: 1,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  location: {
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: POST_WIDTH,
    marginHorizontal: POST_PADDING,
    borderRadius: 0,
  },
  imageLoading: {
    opacity: 0,
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: POST_PADDING,
    right: POST_PADDING,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 16,
    padding: 4,
  },
  stats: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  caption: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  commentsButton: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  timestamp: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  timestampText: {
    textTransform: 'uppercase',
  },
});
