import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import type { ImageSource } from 'expo-image';
import { ThemedText } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ThemedColor } from '@/components/types';

// Shared size calculations
const useAvatarSize = (size: number) => {
  const radius = size / 2;
  const fontSize = Math.max(12, size * 0.45);

  return {
    width: size,
    height: size,
    borderRadius: radius,
    fontSize,
  };
};

interface TextAvatarProps {
  name: string;
  size?: number;
  backgroundColor?: ThemedColor;
  textColor?: ThemedColor;
}

export function TextAvatar({
  name,
  size = 40,
  backgroundColor = { light: '#1DA1F2', dark: '#1DA1F2' },
  textColor = { light: 'white', dark: 'white' },
}: TextAvatarProps) {
  const { width, height, borderRadius, fontSize } = useAvatarSize(size);
  const resolvedBackgroundColor = useThemeColor('primary', backgroundColor);
  const resolvedTextColor = useThemeColor('text', textColor);

  return (
    <View
      style={[
        styles.textContainer,
        {
          width,
          height,
          borderRadius,
          backgroundColor: resolvedBackgroundColor,
        },
      ]}
    >
      <ThemedText
        type="body1"
        weight="semibold"
        style={[
          styles.text,
          {
            color: resolvedTextColor,
            fontSize,
          },
        ]}
      >
        {name.charAt(0).toUpperCase()}
      </ThemedText>
    </View>
  );
}

interface ImageAvatarProps {
  source: ImageSource;
  size?: number;
}

export function ImageAvatar({ source, size = 40 }: ImageAvatarProps) {
  const { width, height, borderRadius } = useAvatarSize(size);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = (error: any) => {
    console.warn('ImageAvatar: Failed to load image', { source, error });
    setIsLoading(false);
  };

  return (
    <View style={styles.imageContainer}>
      <Image
        source={source}
        style={{ width, height, borderRadius }}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
        recyclingKey={typeof source === 'object' && 'uri' in source ? source.uri : undefined}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        priority="high"
      />
      {isLoading && (
        <View style={[styles.loadingOverlay, { width, height, borderRadius }]}>
          <ActivityIndicator size="small" color="#666" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
  },
  text: {},
});
