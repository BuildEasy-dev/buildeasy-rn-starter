import type { PhotoPost } from '../types/photo.types';

// Using Unsplash for free high-quality stock photos
// These URLs point to license-free photos from Unsplash
const SAMPLE_PHOTOS: Omit<PhotoPost, 'id' | 'timestamp'>[] = [
  {
    user: {
      id: '1',
      username: 'naturelover',
      name: 'Alex Chen',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1080&fit=crop',
      width: 1080,
      height: 1080,
      aspectRatio: 1,
      alt: 'Beautiful mountain landscape with lake reflection',
    },
    caption: 'Lost in the beauty of nature 🏔️ #mountains #reflection #peace',
    location: {
      name: 'Banff National Park, Canada',
    },
    stats: {
      likes: 1247,
      comments: 89,
      shares: 34,
    },
    tags: ['nature', 'mountains', 'landscape', 'canada'],
    isLiked: false,
    isBookmarked: false,
  },
  {
    user: {
      id: '2',
      username: 'urbanexplorer',
      name: 'Maya Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1080&h=1350&fit=crop',
      width: 1080,
      height: 1350,
      aspectRatio: 0.8,
      alt: 'City architecture with modern buildings',
    },
    caption: 'Concrete jungle vibes ✨ The way light hits these buildings never gets old',
    location: {
      name: 'Downtown LA',
    },
    stats: {
      likes: 892,
      comments: 45,
      shares: 12,
    },
    tags: ['architecture', 'city', 'urban', 'photography'],
    isLiked: true,
    isBookmarked: false,
  },
  {
    user: {
      id: '3',
      username: 'foodielife',
      name: 'Jordan Kim',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1080&h=1080&fit=crop',
      width: 1080,
      height: 1080,
      aspectRatio: 1,
      alt: 'Delicious homemade pizza with fresh ingredients',
    },
    caption: 'Homemade pizza night! 🍕 Nothing beats fresh basil from the garden',
    stats: {
      likes: 2156,
      comments: 134,
      shares: 67,
    },
    tags: ['food', 'pizza', 'homemade', 'cooking'],
    isLiked: false,
    isBookmarked: true,
  },
  {
    user: {
      id: '4',
      username: 'beachwalker',
      name: 'Sofia Martinez',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&h=1350&fit=crop',
      width: 1080,
      height: 1350,
      aspectRatio: 0.8,
      alt: 'Serene beach at sunset with calm waves',
    },
    caption: 'Golden hour at the beach 🌅 Perfect end to a perfect day',
    location: {
      name: 'Malibu, California',
    },
    stats: {
      likes: 3421,
      comments: 287,
      shares: 156,
    },
    tags: ['beach', 'sunset', 'ocean', 'california'],
    isLiked: true,
    isBookmarked: true,
  },
  {
    user: {
      id: '5',
      username: 'artlover',
      name: 'David Thompson',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1080&h=1080&fit=crop',
      width: 1080,
      height: 1080,
      aspectRatio: 1,
      alt: 'Abstract colorful street art mural',
    },
    caption: 'Street art speaks to the soul 🎨 Found this gem in the arts district',
    location: {
      name: 'Arts District, Los Angeles',
    },
    stats: {
      likes: 756,
      comments: 67,
      shares: 23,
    },
    tags: ['art', 'streetart', 'mural', 'creative'],
    isLiked: false,
    isBookmarked: false,
  },
  {
    user: {
      id: '6',
      username: 'petlover',
      name: 'Emma Wilson',
      avatar:
        'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=100&fit=crop&crop=face',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1080&h=1080&fit=crop',
      width: 1080,
      height: 1080,
      aspectRatio: 1,
      alt: 'Adorable golden retriever playing in the park',
    },
    caption: 'Park day with my best friend! 🐕 He brings joy to every moment',
    stats: {
      likes: 4892,
      comments: 423,
      shares: 234,
    },
    tags: ['dogs', 'pets', 'park', 'friendship'],
    isLiked: true,
    isBookmarked: false,
  },
  {
    user: {
      id: '7',
      username: 'travelgram',
      name: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1080&h=1350&fit=crop',
      width: 1080,
      height: 1350,
      aspectRatio: 0.8,
      alt: 'Scenic mountain lake with crystal clear water',
    },
    caption: 'Nature never goes out of style 🌲 What a magical place!',
    location: {
      name: 'Lake Louise, Alberta',
    },
    stats: {
      likes: 2847,
      comments: 198,
      shares: 89,
    },
    tags: ['nature', 'travel', 'mountains', 'lake'],
    isLiked: false,
    isBookmarked: true,
  },
  {
    user: {
      id: '8',
      username: 'coffeetime',
      name: 'Mike Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1080&h=1080&fit=crop',
      width: 1080,
      height: 1080,
      aspectRatio: 1,
      alt: 'Perfect latte art in white ceramic cup',
    },
    caption: 'Monday motivation ☕ Starting the week right with the perfect brew',
    stats: {
      likes: 1653,
      comments: 87,
      shares: 34,
    },
    tags: ['coffee', 'monday', 'latte', 'cafe'],
    isLiked: true,
    isBookmarked: false,
  },
  {
    user: {
      id: '9',
      username: 'minimalist_home',
      name: 'Anna White',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1080&h=1350&fit=crop',
      width: 1080,
      height: 1350,
      aspectRatio: 0.8,
      alt: 'Clean minimalist living room with plants',
    },
    caption: 'Less is more ✨ Creating spaces that breathe',
    stats: {
      likes: 987,
      comments: 45,
      shares: 67,
    },
    tags: ['interior', 'minimalism', 'home', 'design'],
    isLiked: false,
    isBookmarked: true,
  },
  {
    user: {
      id: '10',
      username: 'fitness_journey',
      name: 'Carlos Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080&fit=crop',
      width: 1080,
      height: 1080,
      aspectRatio: 1,
      alt: 'Gym equipment and workout setup',
    },
    caption: 'Push your limits! 💪 No excuses, just results #fitnessmotivation',
    stats: {
      likes: 2156,
      comments: 234,
      shares: 145,
    },
    tags: ['fitness', 'workout', 'motivation', 'gym'],
    isLiked: true,
    isBookmarked: false,
  },
  {
    user: {
      id: '11',
      username: 'bookworm',
      name: 'Lisa Park',
      avatar:
        'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1080&h=1350&fit=crop',
      width: 1080,
      height: 1350,
      aspectRatio: 0.8,
      alt: 'Stack of books with vintage aesthetic',
    },
    caption: 'Currently reading: The Seven Husbands of Evelyn Hugo 📚 What are you reading?',
    stats: {
      likes: 743,
      comments: 156,
      shares: 23,
    },
    tags: ['books', 'reading', 'literature', 'cozy'],
    isLiked: false,
    isBookmarked: true,
  },
  {
    user: {
      id: '12',
      username: 'cityscape',
      name: 'Tom Wilson',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1080&h=1080&fit=crop',
      width: 1080,
      height: 1080,
      aspectRatio: 1,
      alt: 'City skyline at night with lights',
    },
    caption: 'City lights never sleep 🌃 The energy here is unmatched',
    location: {
      name: 'New York City',
    },
    stats: {
      likes: 3421,
      comments: 287,
      shares: 198,
    },
    tags: ['city', 'night', 'skyline', 'urban'],
    isLiked: true,
    isBookmarked: false,
  },
  {
    user: {
      id: '13',
      username: 'flowergarden',
      name: 'Rose Thompson',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1080&h=1350&fit=crop',
      width: 1080,
      height: 1350,
      aspectRatio: 0.8,
      alt: 'Beautiful pink cherry blossoms in spring',
    },
    caption: 'Spring has arrived! 🌸 Cherry blossoms are in full bloom',
    stats: {
      likes: 1876,
      comments: 134,
      shares: 67,
    },
    tags: ['flowers', 'spring', 'nature', 'pink'],
    isLiked: false,
    isBookmarked: false,
  },
  {
    user: {
      id: '14',
      username: 'oceanlover',
      name: 'Jake Martinez',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1080&h=1080&fit=crop',
      width: 1080,
      height: 1080,
      aspectRatio: 1,
      alt: 'Crystal clear ocean water with tropical vibes',
    },
    caption: 'Ocean therapy 🌊 Nothing beats the sound of waves',
    location: {
      name: 'Maldives',
    },
    stats: {
      likes: 4521,
      comments: 456,
      shares: 234,
    },
    tags: ['ocean', 'tropical', 'paradise', 'blue'],
    isLiked: true,
    isBookmarked: true,
  },
  {
    user: {
      id: '15',
      username: 'fashionista',
      name: 'Chloe Davis',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1080&h=1350&fit=crop',
      width: 1080,
      height: 1350,
      aspectRatio: 0.8,
      alt: 'Stylish fashion outfit and accessories',
    },
    caption: 'Confidence is the best outfit you can wear ✨ #OOTD',
    stats: {
      likes: 2198,
      comments: 167,
      shares: 89,
    },
    tags: ['fashion', 'style', 'ootd', 'confidence'],
    isLiked: false,
    isBookmarked: false,
  },
  {
    user: {
      id: '16',
      username: 'mountainhiker',
      name: 'Alex Stone',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1080&fit=crop',
      width: 1080,
      height: 1080,
      aspectRatio: 1,
      alt: 'Mountain hiking trail with scenic views',
    },
    caption: 'The journey is the destination 🥾 Every step counts!',
    location: {
      name: 'Rocky Mountains, Colorado',
    },
    stats: {
      likes: 1423,
      comments: 89,
      shares: 45,
    },
    tags: ['hiking', 'mountains', 'adventure', 'outdoors'],
    isLiked: true,
    isBookmarked: false,
  },
  {
    user: {
      id: '17',
      username: 'bakingqueen',
      name: 'Maria Santos',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1080&h=1350&fit=crop',
      width: 1080,
      height: 1350,
      aspectRatio: 0.8,
      alt: 'Freshly baked croissants on wooden table',
    },
    caption: 'Sunday morning bliss 🥐 Nothing beats homemade pastries',
    stats: {
      likes: 2876,
      comments: 198,
      shares: 67,
    },
    tags: ['baking', 'croissants', 'sunday', 'homemade'],
    isLiked: false,
    isBookmarked: true,
  },
  {
    user: {
      id: '18',
      username: 'vintagecar',
      name: 'James Miller',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1080&h=1080&fit=crop',
      width: 1080,
      height: 1080,
      aspectRatio: 1,
      alt: 'Classic vintage car in sunset lighting',
    },
    caption: "They don't make them like this anymore 🚗 Classic beauty!",
    stats: {
      likes: 1654,
      comments: 123,
      shares: 78,
    },
    tags: ['vintage', 'cars', 'classic', 'automotive'],
    isLiked: true,
    isBookmarked: false,
  },
  {
    user: {
      id: '19',
      username: 'yogalife',
      name: 'Sophia Lee',
      avatar:
        'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&h=1350&fit=crop',
      width: 1080,
      height: 1350,
      aspectRatio: 0.8,
      alt: 'Peaceful yoga session at sunrise on the beach',
    },
    caption: 'Morning meditation by the sea 🧘‍♀️ Find your inner peace',
    location: {
      name: 'Tulum, Mexico',
    },
    stats: {
      likes: 3241,
      comments: 234,
      shares: 156,
    },
    tags: ['yoga', 'meditation', 'sunrise', 'beach'],
    isLiked: false,
    isBookmarked: true,
  },
  {
    user: {
      id: '20',
      username: 'techgeek',
      name: 'Ryan Park',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080&fit=crop',
      width: 1080,
      height: 1080,
      aspectRatio: 1,
      alt: 'Modern workspace with laptop and gadgets',
    },
    caption: 'New setup, new possibilities 💻 Ready to create something amazing!',
    stats: {
      likes: 987,
      comments: 67,
      shares: 34,
    },
    tags: ['tech', 'workspace', 'laptop', 'productivity'],
    isLiked: true,
    isBookmarked: false,
  },
];

// Valid Unsplash photo IDs for generating additional photos
const ADDITIONAL_PHOTO_IDS = [
  '1416879595882-3373a0480b5b',
  '1493225457124-a3eb161ffa5f',
  '1547036967-23d11aacaee0',
  '1507608616759-54f48f0af0ee',
  '1608270586620-248524c67de9',
  '1544723795-3fb6469f5b39',
  '1551024506-0bccd828d307',
  '1502680390469-be75c86b636f',
  '1578662996442-48f60103fc96',
  '1511818966892-d7d671e672a2',
  '1555939594-58d7cb561ad1',
  '1514539079130-25950c84af65',
  '1578985545062-69928b1d9587',
  '1541961017774-22349e4a1262',
  '1470225620780-dba8ba36b745',
  '1544551763-46a013bb70d5',
  '1515886657613-9f3515b0c78f',
  '1504851149312-7a075b496cc7',
  '1506905925346-21bda4d32df4',
  '1439066615861-d1af74d74000',
  '1586023492125-27b2c045efd7',
  '1507525428034-b723cf961d3e',
  '1541961017774-22349e4a1262',
  '1552053831-71594a27632d',
  '1469474968028-56623f02e42e',
  '1495474472287-4d71bcdd2085',
  '1586023492125-27b2c045efd7',
  '1571019613454-1cb2f99b2d8b',
  '1481627834876-b7833e8f5570',
  '1534528741775-53994a69daeb',
  '1490750967868-88aa4486c946',
  '1439066615861-d1af74d74000',
  '1552053831-71594a27632d',
  '1490750967868-88aa4486c946',
  '1503736334956-4c8f8e92946d',
  '1515886657613-9f3515b0c78f',
  '1503736334956-4c8f8e92946d',
  '1416879595882-3373a0480b5b',
  '1493225457124-a3eb161ffa5f',
  '1547036967-23d11aacaee0',
  '1507608616759-54f48f0af0ee',
  '1608270586620-248524c67de9',
  '1416879595882-3373a0480b5b',
  '1551024506-0bccd828d307',
  '1502680390469-be75c86b636f',
  '1578662996442-48f60103fc96',
  '1511818966892-d7d671e672a2',
  '1555939594-58d7cb561ad1',
  '1514539079130-25950c84af65',
  '1578985545062-69928b1d9587',
  '1541961017774-22349e4a1262',
  '1470225620780-dba8ba36b745',
  '1544551763-46a013bb70d5',
  '1515886657613-9f3515b0c78f',
  '1504851149312-7a075b496cc7',
  '1506905925346-21bda4d32df4',
  '1439066615861-d1af74d74000',
  '1586023492125-27b2c045efd7',
  '1507525428034-b723cf961d3e',
  '1541961017774-22349e4a1262',
  '1552053831-71594a27632d',
  '1469474968028-56623f02e42e',
  '1495474472287-4d71bcdd2085',
];

const CAPTIONS = [
  'Living my best life! ✨ #blessed',
  'Another day, another adventure 🌟',
  'Grateful for moments like these 🙏',
  'Life is beautiful when you look closely 📸',
  'Creating memories that last forever 💫',
  'Every sunset is a new beginning 🌅',
  'Finding beauty in everyday moments ✨',
  'Dream big, work hard, stay humble 💪',
  'Adventure awaits around every corner 🗺️',
  'Making the most of this beautiful day ☀️',
  'Good vibes only! 🌈',
  'Life happens, coffee helps ☕',
  'Stay curious, stay creative 🎨',
  'Chasing dreams and catching sunbeams 🌞',
  'Collecting moments, not things 📷',
  'Art is everywhere if you know where to look 🎭',
  'Capturing the essence of the moment 📸',
  'When light meets shadow, magic happens ✨',
  'Every picture tells a story 📖',
  'Through my lens, the world looks different 🔍',
  'Finding extraordinary in the ordinary 🌟',
  'Colors speak louder than words 🎨',
  'Frozen moments, eternal memories ❄️',
  'Life through a different perspective 👁️',
  'Creating art one shot at a time 🖼️',
  'The world is my canvas 🎨',
  'Light, camera, emotion! 🎬',
  'Every angle has a story to tell 📐',
  'Painting with light and shadows 🎨',
  'Reality enhanced through creativity ✨',
];

const LOCATIONS = [
  'Los Angeles, CA',
  'New York, NY',
  'San Francisco, CA',
  'Miami, FL',
  'Chicago, IL',
  'Tokyo, Japan',
  'Paris, France',
  'London, UK',
  'Sydney, Australia',
  'Vancouver, Canada',
  'Santorini, Greece',
  'Bali, Indonesia',
  'Machu Picchu, Peru',
  'Iceland',
  'Morocco',
  'Thailand',
  'Nepal',
  'Patagonia',
  'New Zealand',
  'Norway',
  'Costa Rica',
  'Vietnam',
  'Portugal',
  'Scotland',
  'Jordan',
  'Madagascar',
  'Chile',
  'Kenya',
  'India',
  'Turkey',
];

// Generate additional photos dynamically
function generateAdditionalPhotos(count: number): Omit<PhotoPost, 'id' | 'timestamp'>[] {
  return Array.from({ length: count }, (_, i) => {
    const photoId = ADDITIONAL_PHOTO_IDS[i % ADDITIONAL_PHOTO_IDS.length];
    const isSquare = Math.random() > 0.5;
    const height = isSquare ? 1080 : 1350;

    return {
      user: {
        id: `${21 + i}`,
        username: `user${21 + i}`,
        name: `Creator ${21 + i}`,
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        verified: Math.random() > 0.7,
      },
      image: {
        url: `https://images.unsplash.com/photo-${photoId}?w=1080&h=${height}&fit=crop`,
        width: 1080,
        height: height,
        aspectRatio: isSquare ? 1 : 0.8,
        alt: `Beautiful photo ${21 + i}`,
      },
      caption: CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)],
      stats: {
        likes: Math.floor(Math.random() * 5000) + 100,
        comments: Math.floor(Math.random() * 300) + 10,
        shares: Math.floor(Math.random() * 100) + 5,
      },
      tags: ['lifestyle', 'photography', 'inspiration', 'daily'],
      isLiked: Math.random() > 0.5,
      isBookmarked: Math.random() > 0.7,
      location:
        Math.random() > 0.6
          ? {
              name: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
            }
          : undefined,
    };
  });
}

// Generate complete photo list
const ALL_PHOTOS = [
  ...SAMPLE_PHOTOS,
  ...generateAdditionalPhotos(160), // Generate 160 additional photos for total of 180
];

// Generate unique IDs and timestamps for posts
export function generatePhotoPosts(): PhotoPost[] {
  return ALL_PHOTOS.map((post, index) => ({
    ...post,
    id: `photo_${Date.now()}_${index}`,
    timestamp: new Date(Date.now() - index * 3600000), // Spread posts over hours
  }));
}

// Simulate API call with delay
export async function fetchPhotoPosts(page: number = 1): Promise<PhotoPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

  const allPosts = generatePhotoPosts();
  const postsPerPage = 18; // 6x3 grid per page for more content
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;

  // Return posts for this page, or empty array if no more posts
  return allPosts.slice(startIndex, endIndex);
}

// Simulate like/unlike action
export async function togglePhotoLike(postId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return Math.random() > 0.5; // Random like state
}

// Simulate bookmark toggle
export async function togglePhotoBookmark(postId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return Math.random() > 0.5; // Random bookmark state
}
