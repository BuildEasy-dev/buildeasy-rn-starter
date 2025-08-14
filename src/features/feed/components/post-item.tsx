import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText, ThemedView } from '@/components/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TextAvatar } from '@/components/ui/avatar';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatRelativeTime } from '@/utils/time';
import type { Post } from '../types/post.types';

interface PostItemProps {
  post: Post;
  onLike: (id: string) => void;
  onRepost: (id: string) => void;
  onReply: (post: Post) => void;
  onBookmark: (id: string) => void;
  onShare: (post: Post) => void;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

function PostItemComponent({
  post,
  onLike,
  onRepost,
  onReply,
  onBookmark,
  onShare,
}: PostItemProps) {
  const tintColor = useThemeColor('tint');
  const textColor = useThemeColor('text');
  const secondaryTextColor = useThemeColor('tabIconDefault');
  const borderColor = useThemeColor('separator');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <TextAvatar name={post.author.name} />
        </View>
        <View style={styles.headerContent}>
          <View style={styles.authorInfo}>
            <ThemedText type="body1" weight="bold" style={styles.authorName}>
              {post.author.name}
            </ThemedText>
            {post.author.verified && (
              <IconSymbol
                name="checkmark.seal.fill"
                size={16}
                color={tintColor}
                style={styles.verifiedIcon}
              />
            )}
            <ThemedText type="body1" style={[styles.username, { color: secondaryTextColor }]}>
              @{post.author.username}
            </ThemedText>
            <ThemedText type="body1" style={[styles.timestamp, { color: secondaryTextColor }]}>
              · {formatRelativeTime(post.timestamp)}
            </ThemedText>
          </View>
          <Pressable onPress={() => onShare(post)} style={styles.moreButton}>
            <IconSymbol name="ellipsis" size={18} color={secondaryTextColor} />
          </Pressable>
        </View>
      </View>

      {post.replyTo && (
        <View style={styles.replyToContainer}>
          <ThemedText type="body1" style={[styles.replyTo, { color: secondaryTextColor }]}>
            Replying to @{post.replyTo}
          </ThemedText>
        </View>
      )}

      <View style={styles.content}>
        <ThemedText type="body1" style={styles.postText}>
          {post.content}
        </ThemedText>
      </View>

      {post.quotePost && (
        <View style={[styles.quotePost, { borderColor }]}>
          <View style={styles.quoteHeader}>
            <ThemedText type="body1" weight="semibold" style={styles.quoteName}>
              {post.quotePost.author.name}
            </ThemedText>
            <ThemedText type="body1" style={[styles.quoteUsername, { color: secondaryTextColor }]}>
              @{post.quotePost.author.username}
            </ThemedText>
          </View>
          <ThemedText
            type="body1"
            style={[styles.quoteContent, { color: textColor }]}
            numberOfLines={2}
          >
            {post.quotePost.content}
          </ThemedText>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable onPress={() => onReply(post)} style={styles.actionButton}>
          <IconSymbol name="bubble.left" size={18} color={secondaryTextColor} />
          <ThemedText type="body1" style={[styles.actionCount, { color: secondaryTextColor }]}>
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
            type="body1"
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
            type="body1"
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
          <ThemedText type="body1" style={[styles.views, { color: secondaryTextColor }]}>
            {formatNumber(post.stats.views)} views
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

export const PostItem = React.memo(PostItemComponent);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  avatarContainer: {
    marginRight: 12,
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
    marginRight: 4,
  },
  verifiedIcon: {
    marginRight: 4,
  },
  username: {
    marginRight: 4,
  },
  timestamp: {},
  moreButton: {
    padding: 4,
  },
  replyToContainer: {
    marginLeft: 52,
    marginBottom: 4,
  },
  replyTo: {},
  content: {
    marginLeft: 52,
    marginBottom: 6,
  },
  postText: {
    lineHeight: 20,
  },
  quotePost: {
    marginLeft: 52,
    marginBottom: 6,
    padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  quoteName: {
    marginRight: 4,
  },
  quoteUsername: {},
  quoteContent: {
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
    marginLeft: 6,
  },
  viewsContainer: {
    marginLeft: 52,
    marginTop: 8,
  },
  views: {},
});
