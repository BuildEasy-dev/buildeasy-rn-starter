import { useState, useEffect, useCallback } from 'react';
import { fetchPhotoPosts, togglePhotoLike, togglePhotoBookmark } from '../data/photos-data';
import { preloadImages, getOptimizedImageUrl, IMAGE_SIZES } from '../utils/image-utils';
import type { PhotoPost, PhotoFeedState } from '../types/photo.types';

export function usePhotosFeed() {
  const [state, setState] = useState<PhotoFeedState>({
    posts: [],
    loading: false,
    error: null,
    refreshing: false,
    hasMore: true,
    lastPage: 0,
  });

  const loadPosts = useCallback(async (page: number = 1, refresh: boolean = false) => {
    setState((prev) => {
      if (prev.loading || (!prev.hasMore && !refresh)) return prev;

      return {
        ...prev,
        loading: !refresh,
        refreshing: refresh,
        error: null,
      };
    });

    try {
      const newPosts = await fetchPhotoPosts(page);

      // Preload thumbnail images for better scrolling performance
      if (newPosts.length > 0) {
        const thumbnailUrls = newPosts.map((post) =>
          getOptimizedImageUrl(post.image.url, IMAGE_SIZES.THUMBNAIL)
        );
        // Preload next batch of images in background
        preloadImages(thumbnailUrls.slice(0, 9)); // Preload first 9 images immediately
        setTimeout(() => {
          preloadImages(thumbnailUrls.slice(9)); // Preload rest after a delay
        }, 100);
      }

      setState((prev) => ({
        ...prev,
        posts: refresh ? newPosts : [...prev.posts, ...newPosts],
        loading: false,
        refreshing: false,
        hasMore: newPosts.length > 0 && newPosts.length >= 18, // Only continue if we got a full page
        lastPage: page,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: error instanceof Error ? error.message : 'Failed to load posts',
      }));
    }
  }, []); // Remove dependencies to prevent infinite loop

  const refresh = useCallback(() => {
    loadPosts(1, true);
  }, [loadPosts]);

  const loadMore = useCallback(() => {
    setState((prev) => {
      if (!prev.loading && !prev.refreshing && prev.hasMore) {
        loadPosts(prev.lastPage + 1);
      }
      return prev;
    });
  }, [loadPosts]);

  const toggleLike = useCallback(async (postId: string) => {
    // Optimistic update
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              stats: {
                ...post.stats,
                likes: post.isLiked ? post.stats.likes - 1 : post.stats.likes + 1,
              },
            }
          : post
      ),
    }));

    try {
      await togglePhotoLike(postId);
    } catch {
      // Revert on error
      setState((prev) => ({
        ...prev,
        posts: prev.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                stats: {
                  ...post.stats,
                  likes: post.isLiked ? post.stats.likes + 1 : post.stats.likes - 1,
                },
              }
            : post
        ),
      }));
    }
  }, []);

  const toggleBookmark = useCallback(async (postId: string) => {
    // Optimistic update
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((post) =>
        post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
      ),
    }));

    try {
      await togglePhotoBookmark(postId);
    } catch {
      // Revert on error
      setState((prev) => ({
        ...prev,
        posts: prev.posts.map((post) =>
          post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
        ),
      }));
    }
  }, []);

  const handleComment = useCallback((post: PhotoPost) => {
    // In a real app, this would open a comments modal/screen
    console.log('Open comments for post:', post.id);
  }, []);

  const handleShare = useCallback((post: PhotoPost) => {
    // In a real app, this would open a share sheet
    console.log('Share post:', post.id);
  }, []);

  const handleUserPress = useCallback((userId: string) => {
    // In a real app, this would navigate to user profile
    console.log('Navigate to user:', userId);
  }, []);

  // Load initial posts only once on mount
  useEffect(() => {
    loadPosts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  return {
    ...state,
    refresh,
    loadMore,
    toggleLike,
    toggleBookmark,
    handleComment,
    handleShare,
    handleUserPress,
  };
}
