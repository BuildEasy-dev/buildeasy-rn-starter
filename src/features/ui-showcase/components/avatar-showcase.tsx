import { View, StyleSheet } from 'react-native';

import { TextAvatar, ImageAvatar } from '@/components/ui/avatar';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';

/**
 * Avatar Component Showcase
 * Demonstrates different types and sizes of avatar components
 */
export const AvatarShowcase = () => {
  return (
    <ThemedView style={styles.container}>
      {/* Text Avatars */}
      <ThemedText type="h6" style={styles.firstSectionTitle}>
        Text Avatars
      </ThemedText>
      <View style={styles.row}>
        <TextAvatar name="John Doe" size={40} />
        <TextAvatar name="Jane Smith" size={40} />
        <TextAvatar name="Mike Johnson" size={40} />
        <TextAvatar name="Sarah Wilson" size={40} />
      </View>

      {/* Different sizes */}
      <ThemedText type="h6" style={styles.sectionTitle}>
        Avatar Sizes
      </ThemedText>
      <View style={styles.row}>
        <TextAvatar name="Small" size={24} />
        <TextAvatar name="Medium" size={40} />
        <TextAvatar name="Large" size={60} />
        <TextAvatar name="XL" size={80} />
      </View>

      {/* Custom colors */}
      <ThemedText type="h6" style={styles.sectionTitle}>
        Custom Colors
      </ThemedText>
      <View style={styles.row}>
        <TextAvatar
          name="Red"
          size={50}
          backgroundColor={{ light: '#FF5722', dark: '#FF5722' }}
          textColor={{ light: 'white', dark: 'white' }}
        />
        <TextAvatar
          name="Green"
          size={50}
          backgroundColor={{ light: '#4CAF50', dark: '#4CAF50' }}
          textColor={{ light: 'white', dark: 'white' }}
        />
        <TextAvatar
          name="Purple"
          size={50}
          backgroundColor={{ light: '#9C27B0', dark: '#9C27B0' }}
          textColor={{ light: 'white', dark: 'white' }}
        />
        <TextAvatar
          name="Orange"
          size={50}
          backgroundColor={{ light: '#FF9800', dark: '#FF9800' }}
          textColor={{ light: 'white', dark: 'white' }}
        />
      </View>

      {/* Image Avatars */}
      <ThemedText type="h6" style={styles.sectionTitle}>
        Anime Avatars
      </ThemedText>
      <View style={styles.row}>
        <ImageAvatar
          source={{ uri: 'https://api.dicebear.com/7.x/adventurer/png?seed=sakura&size=200' }}
          size={50}
        />
        <ImageAvatar
          source={{ uri: 'https://api.dicebear.com/7.x/adventurer/png?seed=yuki&size=200' }}
          size={50}
        />
        <ImageAvatar
          source={{ uri: 'https://api.dicebear.com/7.x/adventurer/png?seed=hiroshi&size=200' }}
          size={50}
        />
        <ImageAvatar
          source={{ uri: 'https://api.dicebear.com/7.x/adventurer/png?seed=ami&size=200' }}
          size={50}
        />
      </View>

      {/* Mixed sizes with images */}
      <ThemedText type="h6" style={styles.sectionTitle}>
        Anime Avatar Sizes
      </ThemedText>
      <View style={styles.row}>
        <ImageAvatar
          source={{ uri: 'https://api.dicebear.com/7.x/adventurer/png?seed=kenji&size=200' }}
          size={30}
        />
        <ImageAvatar
          source={{ uri: 'https://api.dicebear.com/7.x/adventurer/png?seed=miku&size=200' }}
          size={45}
        />
        <ImageAvatar
          source={{ uri: 'https://api.dicebear.com/7.x/adventurer/png?seed=akira&size=200' }}
          size={60}
        />
        <ImageAvatar
          source={{ uri: 'https://api.dicebear.com/7.x/adventurer/png?seed=rei&size=200' }}
          size={75}
        />
      </View>

      {/* Mixed types in a group */}
      <ThemedText type="h6" style={styles.sectionTitle}>
        Mixed Avatar Group
      </ThemedText>
      <View style={styles.row}>
        <TextAvatar name="Alice Brown" size={50} />
        <ImageAvatar
          source={{ uri: 'https://api.dicebear.com/7.x/adventurer/png?seed=shinji&size=200' }}
          size={50}
        />
        <TextAvatar
          name="Charlie Davis"
          size={50}
          backgroundColor={{ light: '#2196F3', dark: '#2196F3' }}
          textColor={{ light: 'white', dark: 'white' }}
        />
        <ImageAvatar
          source={{ uri: 'https://api.dicebear.com/7.x/adventurer/png?seed=nanami&size=200' }}
          size={50}
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  firstSectionTitle: {
    marginTop: 0,
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
});
