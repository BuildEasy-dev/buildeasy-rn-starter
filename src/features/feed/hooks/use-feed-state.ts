import { useState, useCallback } from 'react';
import type { Post } from '../types/post.types';
import { FEED_DATA } from '../data/feed-data';

export function useFeedState() {
  const [posts, setPosts] = useState<Post[]>(FEED_DATA);
  const [refreshing, setRefreshing] = useState(false);
  const [loading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Debug states for testing ListLayout empty/error states
  const [debugEmptyState, setDebugEmptyState] = useState(false);
  const [debugErrorState, setDebugErrorState] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    setHasMore(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPosts(FEED_DATA);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh'));
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            stats: {
              ...post.stats,
              likes: isLiked ? post.stats.likes + 1 : post.stats.likes - 1,
            },
          };
        }
        return post;
      })
    );
  }, []);

  const handleRepost = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isReposted = !post.isReposted;
          return {
            ...post,
            isReposted,
            stats: {
              ...post.stats,
              reposts: isReposted ? post.stats.reposts + 1 : post.stats.reposts - 1,
            },
          };
        }
        return post;
      })
    );
  }, []);

  const handleBookmark = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isBookmarked: !post.isBookmarked,
          };
        }
        return post;
      })
    );
  }, []);

  const handleReply = useCallback((post: Post) => {
    console.log('Reply to post:', post.author.username);
  }, []);

  const handleShare = useCallback((post: Post) => {
    console.log('Share post:', post.id);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      const newPosts: Post[] = Array.from({ length: 5 }, (_, i) => ({
        id: `${posts.length + i + 1}`,
        author: {
          name: `User ${posts.length + i + 1}`,
          username: `user${posts.length + i + 1}`,
          verified: Math.random() > 0.5,
        },
        content: `This is a dynamically loaded post #${posts.length + i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        timestamp: new Date(Date.now() - (posts.length + i + 1) * 60 * 60 * 1000),
        stats: {
          likes: Math.floor(Math.random() * 500),
          reposts: Math.floor(Math.random() * 100),
          replies: Math.floor(Math.random() * 50),
          views: Math.floor(Math.random() * 5000),
        },
      }));
      const updatedPosts = [...posts, ...newPosts];
      setPosts(updatedPosts);

      // Check if we've reached the maximum number of posts
      if (updatedPosts.length >= 50) {
        setHasMore(false);
      }

      setLoadingMore(false);
    }, 1500);
  }, [posts, loadingMore, hasMore]);

  const handleRetry = useCallback(() => {
    setError(null);
    handleRefresh();
  }, [handleRefresh]);

  // Debug handlers
  const toggleEmptyState = useCallback(() => {
    setDebugEmptyState((prev) => !prev);
    if (!debugEmptyState) {
      setDebugErrorState(false); // Only one debug state at a time
    }
  }, [debugEmptyState]);

  const toggleErrorState = useCallback(() => {
    setDebugErrorState((prev) => !prev);
    if (!debugErrorState) {
      setDebugEmptyState(false); // Only one debug state at a time
    }
  }, [debugErrorState]);

  // Override data and error for debug states
  const finalPosts = debugEmptyState || debugErrorState ? [] : posts;
  const finalError = debugErrorState ? new Error('Debug error state') : error;

  return {
    posts: finalPosts,
    refreshing,
    loading,
    error: finalError,
    loadingMore,
    hasMore,
    handleRefresh,
    handleLike,
    handleRepost,
    handleBookmark,
    handleReply,
    handleShare,
    handleLoadMore,
    handleRetry,
    // Debug controls
    debugEmptyState,
    debugErrorState,
    toggleEmptyState,
    toggleErrorState,
  };
}
