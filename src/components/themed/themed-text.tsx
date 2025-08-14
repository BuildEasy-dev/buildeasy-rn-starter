/**
 * ThemedText Typography System
 *
 * This component implements a comprehensive typography system following modern design principles:
 *
 * 1. Hierarchical structure:
 *    - Headings (h1-h6): For titles and section headers with decreasing prominence
 *    - Body text (body1, body2): Main text content in different sizes
 *    - Supporting text types (caption, label, overline): For UI elements and secondary information
 *
 * 2. Weight variations:
 *    - Regular: Default weight for most text (400)
 *    - Medium: Slightly emphasized text (500)
 *    - SemiBold: Strong emphasis (600)
 *    - Bold: Highest emphasis (700)
 *
 * 3. Special variants:
 *    - Link: Interactive text for navigation
 *    - Error: For error messages and warnings
 *    - Success: For success messages
 *    - Warning: For warnings
 *    - Muted: For secondary/disabled text
 *
 * 4. Consistent line-height ratios:
 *    - Line heights follow a 1.5x ratio for body text (optimal readability)
 *    - Headings use 1.25-1.5x for tighter leading with larger text
 *
 * Usage examples:
 *   <ThemedText type="h1">Page Title</ThemedText>
 *   <ThemedText type="body1" weight="medium">Emphasized body text</ThemedText>
 *   <ThemedText type="caption" variant="error">Error message</ThemedText>
 */

import { forwardRef, useMemo, memo } from 'react';
import { Text, type TextProps, type StyleProp, type TextStyle } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type TextType =
  // Headings
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  // Body text
  | 'body1'
  | 'body2'
  // Supporting text
  | 'caption'
  | 'label'
  | 'overline';

export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type TextVariant = 'default' | 'link' | 'error' | 'success' | 'warning' | 'muted';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: TextType;
  weight?: TextWeight;
  variant?: TextVariant;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

// Typography mapping - maps our semantic types to actual font sizes
const typographyMapping = {
  // Headings
  h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const },
  h2: { fontSize: 28, lineHeight: 36, fontWeight: '700' as const },
  h3: { fontSize: 24, lineHeight: 32, fontWeight: '600' as const },
  h4: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  h5: { fontSize: 18, lineHeight: 26, fontWeight: '500' as const },
  h6: { fontSize: 16, lineHeight: 24, fontWeight: '500' as const },

  // Body text
  body1: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  body2: { fontSize: 14, lineHeight: 21, fontWeight: '400' as const },

  // Supporting text
  caption: { fontSize: 12, lineHeight: 18, fontWeight: '400' as const },
  label: { fontSize: 14, lineHeight: 18, fontWeight: '500' as const },
  overline: {
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '500' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
};

// Weight mapping
const weightMapping = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/**
 * ThemedText component with enhanced typography system
 *
 * Features:
 * - Comprehensive text type hierarchy (h1-h6, body1-2, caption, label, overline)
 * - Flexible weight system (regular, medium, semibold, bold)
 * - Multiple variants for different UI states (default, link, error, success, warning, muted)
 * - Performance optimized with memo and forwardRef
 * - Full TypeScript support with proper inference
 */
export const ThemedText = memo(
  forwardRef<Text, ThemedTextProps>(
    (
      {
        type = 'body1',
        weight = 'regular',
        variant = 'default',
        lightColor,
        darkColor,
        style,
        ...props
      },
      ref
    ) => {
      // Get theme color using the existing hook
      const themeColor = useThemeColor('text', { light: lightColor, dark: darkColor });

      // Get typography styles
      const typeStyle = typographyMapping[type];

      // Get weight style (override type weight if specified)
      const weightStyle = weight !== 'regular' ? { fontWeight: weightMapping[weight] } : {};

      // Get variant styles - use direct color references for better compatibility
      const variantStyle = useMemo(() => {
        switch (variant) {
          case 'link':
            return {
              color: '#007AFF', // iOS blue
              textDecorationLine: 'underline' as const,
            };
          case 'error':
            return { color: '#FF3B30' }; // iOS red
          case 'success':
            return { color: '#34C759' }; // iOS green
          case 'warning':
            return { color: '#FF9500' }; // iOS orange
          case 'muted':
            return {
              color: '#8E8E93', // iOS gray
              opacity: 0.6,
            };
          default:
            return {}; // Use theme's default text color
        }
      }, [variant]);

      return (
        <Text
          ref={ref}
          style={[
            // Apply theme color first as a fallback
            { color: themeColor },
            // Apply typography styles
            typeStyle,
            // Apply weight styles
            weightStyle,
            // Apply variant styles, which can override the theme color
            variantStyle,
            // Apply custom styles from props (highest priority)
            style,
          ]}
          {...props}
        />
      );
    }
  )
);

ThemedText.displayName = 'ThemedText';
