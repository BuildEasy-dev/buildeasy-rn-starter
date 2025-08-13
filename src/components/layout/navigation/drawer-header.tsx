import React from 'react';
import { StyleSheet, ImageSourcePropType, Image, Pressable } from 'react-native';
import { ThemedView, ThemedText } from '@/components/themed';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface DrawerHeaderProps {
  /**
   * Avatar image source
   */
  avatar?: ImageSourcePropType | { uri: string };
  /**
   * Primary text (usually name)
   */
  title?: string;
  /**
   * Secondary text (usually email or role)
   */
  subtitle?: string;
  /**
   * Tertiary text (usually status or additional info)
   */
  caption?: string;
  /**
   * Background color or gradient
   */
  backgroundColor?: string;
  /**
   * Background image
   */
  backgroundImage?: ImageSourcePropType;
  /**
   * Show online status indicator
   */
  showOnlineStatus?: boolean;
  /**
   * Online status (true = online, false = offline)
   */
  isOnline?: boolean;
  /**
   * Action button (e.g., edit profile)
   */
  actionIcon?: IconSymbolName;
  /**
   * Action button press handler
   */
  onActionPress?: () => void;
  /**
   * Header press handler (e.g., go to profile)
   */
  onPress?: () => void;
  /**
   * Custom height for header
   * @default 120
   */
  height?: number;
  /**
   * Vertical padding
   * @default 20
   */
  paddingVertical?: number;
  /**
   * Horizontal padding
   * @default 20
   */
  paddingHorizontal?: number;
}

/**
 * DrawerHeader - Generic header component for drawer navigation
 *
 * Features:
 * - Avatar with optional online status
 * - Title, subtitle, and caption text
 * - Background customization
 * - Optional action button
 * - Press interaction support
 * - Theme-aware styling
 *
 * @example
 * ```tsx
 * <DrawerHeader
 *   avatar={{ uri: 'https://example.com/avatar.jpg' }}
 *   title="John Doe"
 *   subtitle="john.doe@example.com"
 *   caption="Premium Member"
 *   showOnlineStatus
 *   isOnline={true}
 *   actionIcon="pencil"
 *   onActionPress={() => console.log('Edit profile')}
 *   onPress={() => console.log('Go to profile')}
 * />
 * ```
 */
export function DrawerHeader({
  avatar,
  title,
  subtitle,
  caption,
  backgroundColor,
  backgroundImage,
  showOnlineStatus = false,
  isOnline = false,
  actionIcon,
  onActionPress,
  onPress,
  height = 120,
  paddingVertical = 20,
  paddingHorizontal = 20,
}: DrawerHeaderProps) {
  const defaultBackgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const tintColor = useThemeColor('tint');
  const borderColor = useThemeColor('border');

  const renderAvatar = () => {
    if (!avatar) return null;

    return (
      <ThemedView style={styles.avatarContainer}>
        <Image source={avatar} style={styles.avatar} />
        {showOnlineStatus && (
          <ThemedView
            style={[
              styles.onlineIndicator,
              {
                backgroundColor: isOnline ? '#34C759' : '#8E8E93',
                borderColor: backgroundColor || defaultBackgroundColor,
              },
            ]}
          />
        )}
      </ThemedView>
    );
  };

  const renderTexts = () => {
    if (!title && !subtitle && !caption) return null;

    return (
      <ThemedView style={styles.textContainer}>
        {title && (
          <ThemedText style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </ThemedText>
        )}
        {subtitle && (
          <ThemedText style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
            {subtitle}
          </ThemedText>
        )}
        {caption && (
          <ThemedText style={[styles.caption, { color: textColor }]} numberOfLines={1}>
            {caption}
          </ThemedText>
        )}
      </ThemedView>
    );
  };

  const renderActionButton = () => {
    if (!actionIcon || !onActionPress) return null;

    return (
      <Pressable onPress={onActionPress} style={styles.actionButton}>
        <IconSymbol name={actionIcon} size={20} color={tintColor} />
      </Pressable>
    );
  };

  const headerStyle = [
    styles.container,
    {
      height,
      paddingVertical,
      paddingHorizontal,
      backgroundColor: backgroundColor || defaultBackgroundColor,
      borderBottomColor: borderColor,
    },
  ];

  const content = (
    <>
      {backgroundImage && <Image source={backgroundImage} style={StyleSheet.absoluteFill} />}
      <ThemedView style={styles.overlay}>
        <ThemedView style={styles.mainContent}>
          {renderAvatar()}
          {renderTexts()}
        </ThemedView>
        {renderActionButton()}
      </ThemedView>
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={headerStyle}>
        {content}
      </Pressable>
    );
  }

  return <ThemedView style={headerStyle}>{content}</ThemedView>;
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  caption: {
    fontSize: 12,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
