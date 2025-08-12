export interface PhotoPost {
  id: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  image: {
    url: string;
    width: number;
    height: number;
    aspectRatio: number;
    alt?: string;
    blur?: string; // base64 blur placeholder
  };
  caption?: string;
  location?: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  timestamp: Date;
  stats: {
    likes: number;
    comments: number;
    shares?: number;
  };
  tags?: string[];
  isLiked?: boolean;
  isBookmarked?: boolean;
  comments?: PhotoComment[];
}

export interface PhotoComment {
  id: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked?: boolean;
  replies?: PhotoComment[];
}

export interface PhotoFeedState {
  posts: PhotoPost[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  hasMore: boolean;
  lastPage: number;
}
