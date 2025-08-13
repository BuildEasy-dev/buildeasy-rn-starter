import { Image } from 'expo-image';

/**
 * Preload images to improve scrolling performance
 * @param urls - Array of image URLs to preload
 */
export async function preloadImages(urls: string[]): Promise<void> {
  try {
    await Promise.all(
      urls.map((url) =>
        Image.prefetch(url, {
          cachePolicy: 'memory-disk',
        })
      )
    );
  } catch (error) {
    console.warn('Failed to preload some images:', error);
  }
}

/**
 * Generate optimized image URL with specific dimensions
 * @param url - Original image URL
 * @param width - Target width
 * @param quality - Image quality (1-100)
 */
export function getOptimizedImageUrl(url: string, width: number, quality: number = 80): string {
  // For Unsplash URLs, optimize the parameters
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    const height = url.includes('h=1350') ? Math.round(width * 1.25) : width;
    return `${baseUrl}?w=${width}&h=${height}&fit=crop&q=${quality}`;
  }
  return url;
}

/**
 * Get appropriate image size based on view type
 */
export const IMAGE_SIZES = {
  THUMBNAIL: 400, // Grid view
  FEED: 720, // List view
  FULL: 1080, // Detail view
} as const;

/**
 * Default blurhash for placeholder
 */
export const DEFAULT_BLURHASH = 'LIGbh_9F~q?b_3ofRjWB_3IUofj[';
