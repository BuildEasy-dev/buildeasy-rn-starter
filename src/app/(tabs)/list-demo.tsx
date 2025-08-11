import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { ScrollableListView, ListItem } from '@/components/layout';
import { TabScreenWrapper } from '@/components/layout/wrappers';
import { ThemedText, ThemedView } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';

interface DemoItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: number;
  icon?: 'doc.text' | 'person.circle' | 'gear' | 'bell.circle' | 'star.fill';
}

const DEMO_DATA: DemoItem[] = [
  {
    id: '1',
    title: 'Document Item',
    subtitle: 'Subtitle for first item',
    description:
      'This is a longer description that can span multiple lines if needed for demonstration',
    badge: 3,
    icon: 'doc.text',
  },
  {
    id: '2',
    title: 'User Profile',
    subtitle: 'John Doe',
    description: 'Active user account',
    badge: 1,
    icon: 'person.circle',
  },
  {
    id: '3',
    title: 'Settings',
    subtitle: 'Application preferences',
    icon: 'gear',
  },
  {
    id: '4',
    title: 'Notifications',
    description: 'You have new messages',
    badge: 12,
    icon: 'bell.circle',
  },
  {
    id: '5',
    title: 'Featured Item',
    subtitle: 'Premium content',
    badge: 5,
    icon: 'star.fill',
  },
];

export default function ListDemoScreen() {
  const [data, setData] = useState<DemoItem[]>(DEMO_DATA);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const tintColor = useThemeColor('tint');
  const switchTrackColor = {
    false: useThemeColor('gray6'),
    true: tintColor,
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setData(DEMO_DATA);
    setShowEmpty(false);
    setRefreshing(false);
  }, []);

  const handleItemPress = useCallback((item: DemoItem) => {
    console.log('Pressed item:', item.title);
    // You can navigate or perform any action here
  }, []);

  const handleEmptyAction = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setData(DEMO_DATA);
      setShowEmpty(false);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || data.length >= 20) return;

    setLoadingMore(true);
    setTimeout(() => {
      const newItems: DemoItem[] = Array.from({ length: 5 }, (_, i) => ({
        id: `${data.length + i + 1}`,
        title: `Item ${data.length + i + 1}`,
        subtitle: `Dynamically loaded item`,
        icon: 'doc.text' as const,
      }));
      setData([...data, ...newItems]);
      setLoadingMore(false);
    }, 1500);
  }, [data, loadingMore]);

  const toggleEmptyState = useCallback(() => {
    setShowEmpty(!showEmpty);
    if (!showEmpty) {
      setData([]);
    } else {
      setData(DEMO_DATA);
    }
  }, [showEmpty]);

  const renderItem = useCallback(
    ({ item }: { item: DemoItem }) => (
      <ListItem
        title={item.title}
        subtitle={item.subtitle}
        description={item.description}
        badge={item.badge}
        leadingIcon={item.icon}
        showChevron
        onPress={() => handleItemPress(item)}
      />
    ),
    [handleItemPress]
  );

  const ListHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedText type="title" style={styles.headerTitle}>
        ListLayout Demo
      </ThemedText>
      <ThemedText style={styles.headerSubtitle}>
        Pull to refresh • Tap items • Scroll for more
      </ThemedText>
      <View style={styles.toggleContainer}>
        <ThemedText>Show empty state</ThemedText>
        <Switch value={showEmpty} onValueChange={toggleEmptyState} trackColor={switchTrackColor} />
      </View>
    </ThemedView>
  );

  return (
    <TabScreenWrapper safeArea="top" scrollToTopOnPress>
      <ScrollableListView
        data={showEmpty ? [] : data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        loading={loading}
        loadingMore={loadingMore}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        emptyTitle="No items available"
        emptyMessage="Try toggling the switch above or pull to refresh"
        emptyIcon="doc.text"
        emptyAction={handleEmptyAction}
        emptyActionLabel="Load Sample Data"
        showSeparator
        ListHeaderComponent={ListHeader}
      />
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    marginBottom: 8,
  },
  headerSubtitle: {
    opacity: 0.7,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
});
