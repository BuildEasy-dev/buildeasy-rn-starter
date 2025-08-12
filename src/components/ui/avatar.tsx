import React from 'react';
import { StyleSheet, View } from 'react-native';
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

  return (
    <View style={styles.imageContainer}>
      <Image
        source={source}
        style={{ width, height, borderRadius }}
        contentFit="cover"
        transition={200}
        onError={(error) => {
          // TODO: Consider adding fallback UI (e.g., default user icon) for better UX
          // This keeps the component simple and focused on just displaying images
          console.warn('ImageAvatar: Failed to load image', { source, error });
        }}
      />
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
  },
  text: {
    fontWeight: '600',
  },
});
