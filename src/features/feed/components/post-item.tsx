import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText, ThemedView } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Post } from '../types/post.types';

interface PostItemProps {
  post: Post;
  onLike: (id: string) => void;
  onRepost: (id: string) => void;
  onReply: (post: Post) => void;
  onBookmark: (id: string) => void;
  onShare: (post: Post) => void;
}

export function PostItem({ post, onLike, onRepost, onReply, onBookmark, onShare }: PostItemProps) {
  const tintColor = useThemeColor('tint');
  const textColor = useThemeColor('text');
  const secondaryTextColor = useThemeColor('tabIconDefault');
  const borderColor = useThemeColor('border');

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

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

  return (
    <ThemedView style={[styles.container, { borderBottomColor: borderColor }]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>
            {post.author.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <View style={styles.headerContent}>
          <View style={styles.authorInfo}>
            <ThemedText style={styles.authorName}>{post.author.name}</ThemedText>
            {post.author.verified && (
              <IconSymbol
                name="checkmark.seal.fill"
                size={16}
                color={tintColor}
                style={styles.verifiedIcon}
              />
            )}
            <ThemedText style={[styles.username, { color: secondaryTextColor }]}>
              @{post.author.username}
            </ThemedText>
            <ThemedText style={[styles.timestamp, { color: secondaryTextColor }]}>
              · {formatTime(post.timestamp)}
            </ThemedText>
          </View>
          <Pressable onPress={() => onShare(post)} style={styles.moreButton}>
            <IconSymbol name="ellipsis" size={18} color={secondaryTextColor} />
          </Pressable>
        </View>
      </View>

      {post.replyTo && (
        <View style={styles.replyToContainer}>
          <ThemedText style={[styles.replyTo, { color: secondaryTextColor }]}>
            Replying to @{post.replyTo}
          </ThemedText>
        </View>
      )}

      <View style={styles.content}>
        <ThemedText style={styles.postText}>{post.content}</ThemedText>
      </View>

      {post.quotePost && (
        <View style={[styles.quotePost, { borderColor }]}>
          <View style={styles.quoteHeader}>
            <ThemedText style={styles.quoteName}>{post.quotePost.author.name}</ThemedText>
            <ThemedText style={[styles.quoteUsername, { color: secondaryTextColor }]}>
              @{post.quotePost.author.username}
            </ThemedText>
          </View>
          <ThemedText style={[styles.quoteContent, { color: textColor }]} numberOfLines={2}>
            {post.quotePost.content}
          </ThemedText>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable onPress={() => onReply(post)} style={styles.actionButton}>
          <IconSymbol name="bubble.left" size={18} color={secondaryTextColor} />
          <ThemedText style={[styles.actionCount, { color: secondaryTextColor }]}>
            {formatNumber(post.stats.replies)}
          </ThemedText>
        </Pressable>

        <Pressable onPress={() => onRepost(post.id)} style={styles.actionButton}>
          <IconSymbol
            name="arrow.2.squarepath"
            size={18}
            color={post.isReposted ? '#00BA7C' : secondaryTextColor}
          />
          <ThemedText
            style={[
              styles.actionCount,
              { color: post.isReposted ? '#00BA7C' : secondaryTextColor },
            ]}
          >
            {formatNumber(post.stats.reposts)}
          </ThemedText>
        </Pressable>

        <Pressable onPress={() => onLike(post.id)} style={styles.actionButton}>
          <IconSymbol
            name={post.isLiked ? 'heart.fill' : 'heart'}
            size={18}
            color={post.isLiked ? '#E0245E' : secondaryTextColor}
          />
          <ThemedText
            style={[styles.actionCount, { color: post.isLiked ? '#E0245E' : secondaryTextColor }]}
          >
            {formatNumber(post.stats.likes)}
          </ThemedText>
        </Pressable>

        <Pressable onPress={() => onBookmark(post.id)} style={styles.actionButton}>
          <IconSymbol
            name={post.isBookmarked ? 'bookmark.fill' : 'bookmark'}
            size={18}
            color={post.isBookmarked ? tintColor : secondaryTextColor}
          />
        </Pressable>

        <Pressable onPress={() => onShare(post)} style={styles.actionButton}>
          <IconSymbol name="square.and.arrow.up" size={18} color={secondaryTextColor} />
        </Pressable>
      </View>

      {post.stats.views && (
        <View style={styles.viewsContainer}>
          <ThemedText style={[styles.views, { color: secondaryTextColor }]}>
            {formatNumber(post.stats.views)} views
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  authorName: {
    fontWeight: '700',
    fontSize: 15,
    marginRight: 4,
  },
  verifiedIcon: {
    marginRight: 4,
  },
  username: {
    fontSize: 15,
    marginRight: 4,
  },
  timestamp: {
    fontSize: 15,
  },
  moreButton: {
    padding: 4,
  },
  replyToContainer: {
    marginLeft: 52,
    marginBottom: 4,
  },
  replyTo: {
    fontSize: 14,
  },
  content: {
    marginLeft: 52,
    marginBottom: 12,
  },
  postText: {
    fontSize: 15,
    lineHeight: 20,
  },
  quotePost: {
    marginLeft: 52,
    marginBottom: 12,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  quoteName: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
  quoteUsername: {
    fontSize: 14,
  },
  quoteContent: {
    fontSize: 14,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 52,
    marginTop: 4,
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 16,
  },
  actionCount: {
    fontSize: 13,
    marginLeft: 6,
  },
  viewsContainer: {
    marginLeft: 52,
    marginTop: 8,
  },
  views: {
    fontSize: 13,
  },
});
