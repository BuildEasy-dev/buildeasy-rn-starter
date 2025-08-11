export interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
    verified?: boolean;
  };
  content: string;
  timestamp: Date;
  stats: {
    likes: number;
    reposts: number;
    replies: number;
    views?: number;
  };
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  isLiked?: boolean;
  isReposted?: boolean;
  isBookmarked?: boolean;
  replyTo?: string;
  quotePost?: {
    author: {
      name: string;
      username: string;
    };
    content: string;
  };
}
