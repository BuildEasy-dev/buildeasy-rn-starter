import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Image, Dimensions, Modal } from 'react-native';
import { ThemedText, ThemedView } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TextAvatar } from '@/components/ui/avatar';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { PhotoPost } from '../types/photo.types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PhotoDetailItemProps {
  post: PhotoPost;
  visible: boolean;
  onClose: () => void;
  onLike: (id: string) => void;
  onComment: (post: PhotoPost) => void;
  onShare: (post: PhotoPost) => void;
  onBookmark: (id: string) => void;
  onUserPress: (userId: string) => void;
}

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) return `${weeks}w`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  const minutes = Math.floor(diff / (1000 * 60));
  return minutes > 0 ? `${minutes}m` : 'now';
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export function PhotoDetailItem({
  post,
  visible,
  onClose,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onUserPress,
}: PhotoDetailItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const backgroundColor = useThemeColor('background');
  const tintColor = useThemeColor('tint');
  const textColor = useThemeColor('text');
  const secondaryTextColor = useThemeColor('tabIconDefault');

  const imageAspectRatio = post.image.aspectRatio;
  const maxImageHeight = screenHeight * 0.6;
  const imageWidth = screenWidth - 32;
  const imageHeight = Math.min(imageWidth / imageAspectRatio, maxImageHeight);

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <ThemedView style={[styles.modalContainer, { backgroundColor }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => onUserPress(post.user.id)} style={styles.userInfo}>
            <TextAvatar name={post.user.name} size={32} />
            <View style={styles.userDetails}>
              <View style={styles.usernameRow}>
                <ThemedText style={styles.username}>{post.user.username}</ThemedText>
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
                <ThemedText style={[styles.location, { color: secondaryTextColor }]}>
                  {post.location.name}
                </ThemedText>
              )}
            </View>
          </Pressable>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color={textColor} />
          </Pressable>
        </View>

        {/* Photo */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.image.url }}
            style={[
              styles.image,
              { width: imageWidth, height: imageHeight },
              !imageLoaded && styles.imageLoading,
            ]}
            onLoad={() => setImageLoaded(true)}
            accessibilityLabel={post.image.alt}
            resizeMode="cover"
          />
          {!imageLoaded && (
            <View style={[styles.imagePlaceholder, { width: imageWidth, height: imageHeight }]}>
              <ThemedText style={{ color: secondaryTextColor }}>Loading...</ThemedText>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <View style={styles.leftActions}>
            <Pressable onPress={() => onLike(post.id)} style={styles.actionButton}>
              <IconSymbol
                name={post.isLiked ? 'heart.fill' : 'heart'}
                size={28}
                color={post.isLiked ? '#E0245E' : textColor}
              />
            </Pressable>

            <Pressable onPress={() => onComment(post)} style={styles.actionButton}>
              <IconSymbol name="bubble.left" size={28} color={textColor} />
            </Pressable>

            <Pressable onPress={() => onShare(post)} style={styles.actionButton}>
              <IconSymbol name="paperplane" size={28} color={textColor} />
            </Pressable>
          </View>

          <Pressable onPress={() => onBookmark(post.id)} style={styles.actionButton}>
            <IconSymbol
              name={post.isBookmarked ? 'bookmark.fill' : 'bookmark'}
              size={28}
              color={textColor}
            />
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <ThemedText style={styles.likesCount}>{formatNumber(post.stats.likes)} likes</ThemedText>
        </View>

        {/* Caption */}
        {post.caption && (
          <View style={styles.caption}>
            <ThemedText>
              <ThemedText style={styles.username}>{post.user.username}</ThemedText>
              <ThemedText> {post.caption}</ThemedText>
            </ThemedText>
          </View>
        )}

        {/* Comments */}
        {post.stats.comments > 0 && (
          <Pressable onPress={() => onComment(post)} style={styles.commentsButton}>
            <ThemedText style={[styles.commentsText, { color: secondaryTextColor }]}>
              View all {formatNumber(post.stats.comments)} comments
            </ThemedText>
          </Pressable>
        )}

        {/* Timestamp */}
        <View style={styles.timestamp}>
          <ThemedText style={[styles.timestampText, { color: secondaryTextColor }]}>
            {formatTime(post.timestamp)}
          </ThemedText>
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingTop: 50, // Status bar space
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
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
  username: {
    fontWeight: '600',
    fontSize: 16,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  location: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  image: {
    borderRadius: 8,
  },
  imageLoading: {
    opacity: 0,
  },
  imagePlaceholder: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 20,
    padding: 4,
  },
  stats: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  likesCount: {
    fontWeight: '600',
    fontSize: 16,
  },
  caption: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  commentsButton: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  commentsText: {
    fontSize: 15,
  },
  timestamp: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 20,
  },
  timestampText: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
