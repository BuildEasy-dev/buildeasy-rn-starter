import React from 'react';
import { type Edge } from 'react-native-safe-area-context';
import { type ViewStyle } from 'react-native';
import { ThemedView } from '@/components/themed/themed-view';
import { ThemedSafeAreaView } from '@/components/themed/themed-safe-area-view';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  edges?: Edge[] | boolean | 'top' | 'bottom' | 'both';
  style?: ViewStyle;
  backgroundColor?: string;
}

export function SafeAreaWrapper({ children, edges, style, backgroundColor }: SafeAreaWrapperProps) {
  const edgeArray = React.useMemo(() => {
    if (!edges) return undefined;
    if (edges === true || edges === 'both') return ['top', 'bottom'] as Edge[];
    if (edges === 'top') return ['top'] as Edge[];
    if (edges === 'bottom') return ['bottom'] as Edge[];
    if (Array.isArray(edges)) return edges;
    return undefined;
  }, [edges]);

  if (!edges) {
    return <ThemedView style={[{ flex: 1, backgroundColor }, style]}>{children}</ThemedView>;
  }

  return (
    <ThemedSafeAreaView style={[{ flex: 1, backgroundColor }, style]} edges={edgeArray}>
      {children}
    </ThemedSafeAreaView>
  );
}
