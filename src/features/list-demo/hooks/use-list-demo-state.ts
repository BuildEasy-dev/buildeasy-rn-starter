import { useState, useCallback } from 'react';
import type { DemoItem } from '../types';
import { DEMO_DATA } from '../data';

export function useListDemoState() {
  const [data, setData] = useState<DemoItem[]>(DEMO_DATA);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

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

  return {
    data,
    refreshing,
    loading,
    showEmpty,
    loadingMore,
    handleRefresh,
    handleItemPress,
    handleEmptyAction,
    handleLoadMore,
    toggleEmptyState,
  };
}
