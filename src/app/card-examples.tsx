import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';
import { ThemedScrollView } from '@/components/themed/themed-scroll-view';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/layout/content/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CardExamplesScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const primaryColor = useThemeColor('primary');
  const iconColor = useThemeColor('icon');

  const handleCardPress = (cardName: string) => {
    Alert.alert('Card Pressed', `You pressed: ${cardName}`);
  };

  return (
    <ThemedScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.pageTitle}>
          Card Component Examples
        </ThemedText>
        <View style={styles.themeToggle}>
          <ThemedText>Dark Mode</ThemedText>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
        </View>
      </ThemedView>

      {/* Section 1: Basic Card Variants */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          1. Basic Card Variants
        </ThemedText>

        <Card variant="elevated" padding="medium" style={styles.card}>
          <ThemedText type="defaultSemiBold">Elevated Card</ThemedText>
          <ThemedText>This card has a shadow effect (elevation)</ThemedText>
        </Card>

        <Card variant="outlined" padding="medium" style={styles.card}>
          <ThemedText type="defaultSemiBold">Outlined Card</ThemedText>
          <ThemedText>This card has a border outline</ThemedText>
        </Card>

        <Card variant="filled" padding="medium" style={styles.card}>
          <ThemedText type="defaultSemiBold">Filled Card</ThemedText>
          <ThemedText>This card has a filled background</ThemedText>
        </Card>
      </ThemedView>

      {/* Section 2: Padding Variations */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          2. Padding Variations
        </ThemedText>

        <Card variant="outlined" padding="none" style={styles.card}>
          <ThemedView style={styles.customPadding}>
            <ThemedText>No Padding (custom content padding)</ThemedText>
          </ThemedView>
        </Card>

        <Card variant="outlined" padding="small" style={styles.card}>
          <ThemedText>Small Padding (8px)</ThemedText>
        </Card>

        <Card variant="outlined" padding="medium" style={styles.card}>
          <ThemedText>Medium Padding (16px)</ThemedText>
        </Card>

        <Card variant="outlined" padding="large" style={styles.card}>
          <ThemedText>Large Padding (24px)</ThemedText>
        </Card>
      </ThemedView>

      {/* Section 3: Complete Structure Cards */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          3. Complete Structure Cards
        </ThemedText>

        {/* User Profile Card */}
        <Card variant="elevated" padding="medium" style={styles.card}>
          <CardHeader
            leading={
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>JD</ThemedText>
              </View>
            }
            title="John Doe"
            subtitle="Software Developer"
            trailing={<IconSymbol name="ellipsis" size={24} color={iconColor} />}
          />
          <CardContent spacing="medium">
            <ThemedText>
              Passionate developer with 5+ years of experience in React Native and mobile
              development.
            </ThemedText>
          </CardContent>
          <CardFooter alignment="right" spacing="medium">
            <ThemedView style={styles.button}>
              <ThemedText style={styles.buttonText}>Message</ThemedText>
            </ThemedView>
            <ThemedView style={[styles.button, styles.primaryButton]}>
              <ThemedText style={styles.primaryButtonText}>Follow</ThemedText>
            </ThemedView>
          </CardFooter>
        </Card>

        {/* Product Card */}
        <Card variant="elevated" padding="none" style={styles.card}>
          <View style={styles.productImage}>
            <ThemedText style={styles.imagePlaceholder}>Product Image</ThemedText>
          </View>
          <View style={styles.productContent}>
            <CardHeader title="Premium Headphones" subtitle="Wireless Bluetooth 5.0" />
            <CardContent spacing="small">
              <ThemedText style={styles.price}>$199.99</ThemedText>
              <ThemedText style={styles.originalPrice}>$249.99</ThemedText>
            </CardContent>
            <CardFooter alignment="space-between" spacing="medium">
              <View style={styles.rating}>
                <IconSymbol name="star.fill" size={16} color="#FFB800" />
                <ThemedText style={styles.ratingText}>4.5 (128)</ThemedText>
              </View>
              <ThemedView style={[styles.button, styles.primaryButton]}>
                <ThemedText style={styles.primaryButtonText}>Add to Cart</ThemedText>
              </ThemedView>
            </CardFooter>
          </View>
        </Card>

        {/* Article Preview Card */}
        <Card variant="outlined" padding="medium" style={styles.card}>
          <CardHeader
            leading={
              <View style={styles.smallAvatar}>
                <ThemedText style={styles.smallAvatarText}>AM</ThemedText>
              </View>
            }
            title="Alice Morgan"
            subtitle="2 hours ago"
          />
          <CardContent spacing="medium">
            <ThemedText type="defaultSemiBold" style={styles.articleTitle}>
              Getting Started with React Native
            </ThemedText>
            <ThemedText numberOfLines={3}>
              React Native is a powerful framework that allows developers to build mobile
              applications using JavaScript and React. In this article, we&apos;ll explore the
              fundamentals...
            </ThemedText>
          </CardContent>
          <CardFooter alignment="space-between" spacing="medium">
            <View style={styles.stats}>
              <IconSymbol name="heart" size={20} color={iconColor} />
              <ThemedText style={styles.statText}>42</ThemedText>
              <IconSymbol name="bubble.left" size={20} color={iconColor} style={styles.statIcon} />
              <ThemedText style={styles.statText}>12</ThemedText>
            </View>
            <ThemedText style={styles.readMore}>Read More →</ThemedText>
          </CardFooter>
        </Card>
      </ThemedView>

      {/* Section 4: Interactive Cards */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          4. Interactive Cards
        </ThemedText>

        <Card
          variant="elevated"
          padding="medium"
          style={styles.card}
          onPress={() => handleCardPress('Settings Card')}
        >
          <View style={styles.interactiveCard}>
            <IconSymbol name="gearshape.fill" size={24} color={primaryColor} />
            <View style={styles.interactiveContent}>
              <ThemedText type="defaultSemiBold">Settings</ThemedText>
              <ThemedText style={styles.subtitle}>Manage your preferences</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color={iconColor} />
          </View>
        </Card>

        <Card
          variant="outlined"
          padding="medium"
          style={styles.card}
          onPress={() => handleCardPress('Notification Card')}
        >
          <View style={styles.interactiveCard}>
            <IconSymbol name="bell.fill" size={24} color={primaryColor} />
            <View style={styles.interactiveContent}>
              <ThemedText type="defaultSemiBold">Notifications</ThemedText>
              <ThemedText style={styles.subtitle}>3 new messages</ThemedText>
            </View>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>3</ThemedText>
            </View>
          </View>
        </Card>

        <Card
          variant="filled"
          padding="medium"
          style={styles.card}
          onPress={() => handleCardPress('Account Card')}
        >
          <View style={styles.interactiveCard}>
            <IconSymbol name="person.circle.fill" size={24} color={primaryColor} />
            <View style={styles.interactiveContent}>
              <ThemedText type="defaultSemiBold">Account</ThemedText>
              <ThemedText style={styles.subtitle}>View profile details</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color={iconColor} />
          </View>
        </Card>
      </ThemedView>

      {/* Section 5: Complex Layout Cards */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          5. Complex Layout Cards
        </ThemedText>

        {/* Statistics Card */}
        <Card variant="elevated" padding="medium" style={styles.card}>
          <CardHeader title="Weekly Statistics" subtitle="Last 7 days" />
          <CardContent spacing="medium">
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>1,234</ThemedText>
                <ThemedText style={styles.statLabel}>Views</ThemedText>
                <ThemedText style={styles.statChange}>+12%</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>89</ThemedText>
                <ThemedText style={styles.statLabel}>Likes</ThemedText>
                <ThemedText style={styles.statChange}>+5%</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>23</ThemedText>
                <ThemedText style={styles.statLabel}>Comments</ThemedText>
                <ThemedText style={[styles.statChange, styles.negative]}>-2%</ThemedText>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Media Card */}
        <Card variant="elevated" padding="none" style={styles.card}>
          <View style={styles.mediaContainer}>
            <ThemedText style={styles.mediaPlaceholder}>Video Thumbnail</ThemedText>
            <View style={styles.playButton}>
              <IconSymbol name="play.fill" size={30} color="#FFF" />
            </View>
            <View style={styles.duration}>
              <ThemedText style={styles.durationText}>12:34</ThemedText>
            </View>
          </View>
          <View style={styles.mediaContent}>
            <CardHeader title="Introduction to TypeScript" subtitle="Programming Tutorial" />
            <CardFooter alignment="space-between" spacing="small">
              <ThemedText style={styles.viewCount}>23K views • 1 week ago</ThemedText>
              <IconSymbol name="bookmark" size={20} color={iconColor} />
            </CardFooter>
          </View>
        </Card>

        {/* Grid Layout Example */}
        <ThemedText type="default" style={styles.subsectionTitle}>
          Grid Layout Example
        </ThemedText>
        <View style={styles.gridContainer}>
          {['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'].map((feature, index) => (
            <Card
              key={index}
              variant="outlined"
              padding="small"
              style={styles.gridCard}
              onPress={() => handleCardPress(feature)}
            >
              <IconSymbol name="sparkles" size={24} color={primaryColor} />
              <ThemedText style={styles.gridCardText}>{feature}</ThemedText>
            </Card>
          ))}
        </View>
      </ThemedView>

      {/* Section 6: Custom Themed Cards */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          6. Custom Themed Cards
        </ThemedText>

        <Card
          variant="elevated"
          padding="medium"
          style={styles.card}
          lightColor="#E8F5E9"
          darkColor="#1B5E20"
        >
          <ThemedText type="defaultSemiBold">Success Card</ThemedText>
          <ThemedText>Custom themed card with success colors</ThemedText>
        </Card>

        <Card
          variant="elevated"
          padding="medium"
          style={styles.card}
          lightColor="#FFF3E0"
          darkColor="#E65100"
        >
          <ThemedText type="defaultSemiBold">Warning Card</ThemedText>
          <ThemedText>Custom themed card with warning colors</ThemedText>
        </Card>

        <Card
          variant="elevated"
          padding="medium"
          style={styles.card}
          lightColor="#FFEBEE"
          darkColor="#B71C1C"
        >
          <ThemedText type="defaultSemiBold">Error Card</ThemedText>
          <ThemedText>Custom themed card with error colors</ThemedText>
        </Card>
      </ThemedView>

      <View style={styles.footer} />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  pageTitle: {
    marginBottom: 20,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 20,
  },
  subsectionTitle: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '600',
  },
  card: {
    marginBottom: 16,
  },
  customPadding: {
    padding: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9C27B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  productImage: {
    height: 200,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    color: '#666',
    fontSize: 16,
  },
  productContent: {
    padding: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
  },
  articleTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    marginRight: 12,
    fontSize: 14,
  },
  statIcon: {
    marginLeft: 8,
  },
  readMore: {
    color: '#007AFF',
    fontWeight: '600',
  },
  interactiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactiveContent: {
    flex: 1,
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginVertical: 4,
  },
  statChange: {
    fontSize: 12,
    color: '#4CD964',
    fontWeight: '600',
  },
  negative: {
    color: '#FF3B30',
  },
  mediaContainer: {
    height: 200,
    backgroundColor: '#000',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaPlaceholder: {
    color: '#FFF',
    fontSize: 16,
  },
  playButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  duration: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFF',
    fontSize: 12,
  },
  mediaContent: {
    padding: 16,
  },
  viewCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  gridCard: {
    width: '47%',
    marginHorizontal: '1.5%',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  gridCardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    height: 40,
  },
});
