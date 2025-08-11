import type { Post } from '../types/post.types';

export const FEED_DATA: Post[] = [
  {
    id: '1',
    author: {
      name: 'John Doe',
      username: 'johndoe',
      verified: true,
    },
    content:
      'Just shipped a major update to our React Native app! 🚀 Performance improvements across the board and new dark mode support.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    stats: {
      likes: 245,
      reposts: 32,
      replies: 18,
      views: 5234,
    },
    isLiked: true,
  },
  {
    id: '2',
    author: {
      name: 'Sarah Chen',
      username: 'sarahchen',
      verified: false,
    },
    content:
      'Working on implementing the new React Native architecture. The performance gains are incredible! Has anyone else made the switch yet?',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    stats: {
      likes: 182,
      reposts: 28,
      replies: 43,
      views: 3421,
    },
  },
  {
    id: '3',
    author: {
      name: 'Tech News',
      username: 'technews',
      verified: true,
    },
    content:
      'BREAKING: Expo SDK 53 is now available! 🎉\n\n✅ React Native 0.79.5 support\n✅ New Architecture enabled by default\n✅ Improved build times\n✅ Better TypeScript support',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    stats: {
      likes: 892,
      reposts: 234,
      replies: 67,
      views: 12453,
    },
    isReposted: true,
  },
  {
    id: '4',
    author: {
      name: 'Emily Rodriguez',
      username: 'emilydev',
      verified: false,
    },
    content:
      'Pro tip: Use react-native-mmkv for storage instead of AsyncStorage. The performance difference is night and day! 💡',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    stats: {
      likes: 456,
      reposts: 89,
      replies: 23,
      views: 6789,
    },
    quotePost: {
      author: {
        name: 'React Native',
        username: 'reactnative',
      },
      content: 'What are your favorite React Native libraries for 2025?',
    },
  },
  {
    id: '5',
    author: {
      name: 'Alex Thompson',
      username: 'alexcodes',
      verified: true,
    },
    content:
      'Just discovered Tamagui and it is amazing for building cross-platform UIs! The performance optimizations are next level.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    stats: {
      likes: 334,
      reposts: 45,
      replies: 29,
      views: 4567,
    },
    isBookmarked: true,
  },
  {
    id: '6',
    author: {
      name: 'Dev Community',
      username: 'devcommunity',
      verified: true,
    },
    content:
      'What is your biggest challenge with React Native development?\n\nA) Performance optimization\nB) Platform-specific issues\nC) Navigation complexity\nD) State management',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    stats: {
      likes: 567,
      reposts: 123,
      replies: 234,
      views: 8901,
    },
  },
  {
    id: '7',
    author: {
      name: 'Maria Gonzalez',
      username: 'mariag',
      verified: false,
    },
    content:
      'Finally got gesture handling working perfectly with react-native-gesture-handler v2! The documentation has improved so much.',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
    stats: {
      likes: 123,
      reposts: 12,
      replies: 8,
      views: 2345,
    },
  },
  {
    id: '8',
    author: {
      name: 'React Native Tips',
      username: 'rntips',
      verified: true,
    },
    content:
      'Debugging tip: Use Flipper for React Native debugging. It provides:\n\n• Network inspection\n• Layout inspector\n• Database viewer\n• Log viewer\n• Performance profiling',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    stats: {
      likes: 789,
      reposts: 234,
      replies: 45,
      views: 9876,
    },
    isLiked: true,
  },
  {
    id: '9',
    author: {
      name: 'David Kim',
      username: 'davidk',
      verified: false,
    },
    content:
      'The combination of Expo Router + TypeScript + Tamagui is absolutely powerful for building production apps. Highly recommend this stack!',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
    stats: {
      likes: 234,
      reposts: 34,
      replies: 19,
      views: 3456,
    },
  },
  {
    id: '10',
    author: {
      name: 'Mobile Dev Weekly',
      username: 'mobiledevweekly',
      verified: true,
    },
    content:
      'This week in mobile development:\n\n📱 iOS 18.2 released\n🤖 Android 15 stable\n⚛️ React Native 0.79.5\n🎯 Flutter 3.24\n📦 Expo SDK 53',
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000),
    stats: {
      likes: 445,
      reposts: 89,
      replies: 23,
      views: 5678,
    },
  },
];
