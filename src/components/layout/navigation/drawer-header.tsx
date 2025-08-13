import React from 'react';
import { StyleSheet, ImageSourcePropType, Image, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface DrawerHeaderProps {
  /**
   * Custom content to render inside the header
   */
  children?: React.ReactNode;
  /**
   * Background color
   */
  backgroundColor?: string;
  /**
   * Background image
   */
  backgroundImage?: ImageSourcePropType;
  /**
   * Custom height for header
   * @default 80
   */
  height?: number;
  /**
   * Vertical padding
   * @default 12
   */
  paddingVertical?: number;
  /**
   * Horizontal padding
   * @default 16
   */
  paddingHorizontal?: number;
  /**
   * Custom container style
   */
  style?: any;
}

/**
 * DrawerHeader - Pure layout container for drawer navigation
 *
 * A minimal, focused container component optimized for drawer headers:
 * - Compact sizing (80px height, 12px padding)
 * - Background customization (color/image)
 * - Layout structure and spacing
 * - Theme-aware background colors
 * - Content composition via children
 *
 * This is a pure layout component that does NOT handle:
 * - User interactions (onPress, gestures)
 * - Business logic or content
 * - Navigation behavior
 *
 * @example
 * ```tsx
 * // Basic usage with business component
 * <DrawerHeader>
 *   <AppBrandDrawerHeader
 *     appName="My App"
 *     tagline="Version 1.0"
 *   />
 * </DrawerHeader>
 *
 * // With custom background
 * <DrawerHeader backgroundColor="#1e40af">
 *   <MyCustomHeaderContent />
 * </DrawerHeader>
 *
 * // With background image
 * <DrawerHeader
 *   backgroundImage={require('@/assets/header-bg.jpg')}
 *   height={100}
 * >
 *   <MyHeaderContent />
 * </DrawerHeader>
 * ```
 */
export function DrawerHeader({
  children,
  backgroundColor,
  backgroundImage,
  height = 80,
  paddingVertical = 12,
  paddingHorizontal = 16,
  style,
}: DrawerHeaderProps) {
  const defaultBackgroundColor = useThemeColor('background');

  const headerStyle = [
    styles.container,
    {
      height,
      paddingVertical,
      paddingHorizontal,
      backgroundColor: backgroundColor || defaultBackgroundColor,
    },
    style,
  ];

  return (
    <View style={headerStyle}>
      {backgroundImage && <Image source={backgroundImage} style={StyleSheet.absoluteFill} />}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
});
