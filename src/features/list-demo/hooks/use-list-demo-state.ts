import { useState, useCallback } from 'react';
import type { DemoItem } from '../types';
import { DEMO_DATA } from '../data';

export function useListDemoState() {
  const [data, setData] = useState<DemoItem[]>(DEMO_DATA);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showEmpty, setShowEmpty] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setData(DEMO_DATA);
      setShowEmpty(false);
      setShowError(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh'));
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleItemPress = useCallback((item: DemoItem) => {
    console.log('Pressed item:', item.title);
    // You can navigate or perform any action here
  }, []);

  const handleEmptyAction = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setData(DEMO_DATA);
      setShowEmpty(false);
      setShowError(false);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setShowError(false);
    handleRefresh();
  }, [handleRefresh]);

  const toggleErrorState = useCallback(() => {
    setShowError(!showError);
    if (!showError) {
      setError(new Error('Demo error: Something went wrong while loading data'));
      setData([]);
    } else {
      setError(null);
      setData(DEMO_DATA);
    }
  }, [showError]);

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
      setError(null);
      setShowError(false);
    } else {
      setData(DEMO_DATA);
    }
  }, [showEmpty]);

  return {
    data,
    refreshing,
    loading,
    error: showError ? error : null,
    showEmpty,
    showError,
    loadingMore,
    handleRefresh,
    handleItemPress,
    handleEmptyAction,
    handleRetry,
    handleLoadMore,
    toggleEmptyState,
    toggleErrorState,
  };
}
