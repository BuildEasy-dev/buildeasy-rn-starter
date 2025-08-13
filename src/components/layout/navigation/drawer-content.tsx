import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { ThemedView, ThemedText } from '@/components/themed';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DrawerHeader, DrawerHeaderProps } from './drawer-header';
import { DrawerFooter, DrawerFooterProps } from './drawer-footer';

export interface DrawerSection {
  key: string;
  title?: string;
  routes: string[];
}

export interface DrawerContentProps extends DrawerContentComponentProps {
  /**
   * Header configuration (use generic DrawerHeader)
   */
  headerProps?: DrawerHeaderProps;
  /**
   * Footer configuration (use generic DrawerFooter)
   */
  footerProps?: DrawerFooterProps;
  /**
   * Custom header component (legacy support)
   * @deprecated Use headerProps instead
   */
  header?: React.ReactNode;
  /**
   * Custom footer component (legacy support)
   * @deprecated Use footerProps instead
   */
  footer?: React.ReactNode;
  /**
   * Group routes into sections
   */
  sections?: DrawerSection[];
  /**
   * Routes to hide from the drawer
   */
  hiddenRoutes?: string[];
  /**
   * Custom item render function
   */
  renderItem?: (route: any, index: number, focused: boolean) => React.ReactNode;
  /**
   * Whether to show default header
   * @default true
   */
  showHeader?: boolean;
  /**
   * Whether to show default footer
   * @default true
   */
  showFooter?: boolean;
}

/**
 * DrawerContent - Custom drawer content component for Expo Router
 *
 * Features:
 * - Custom header/footer support
 * - Route sections with titles
 * - Hide specific routes
 * - Theme-aware styling
 * - Custom item rendering
 *
 * @example
 * ```tsx
 * <Drawer
 *   drawerContent={(props) => (
 *     <DrawerContent
 *       {...props}
 *       header={<UserProfile />}
 *       sections={[
 *         { key: 'main', title: 'Main', routes: ['home', 'profile'] },
 *         { key: 'settings', title: 'Settings', routes: ['settings', 'about'] }
 *       ]}
 *       footer={<LogoutButton />}
 *     />
 *   )}
 * />
 * ```
 */
export function DrawerContent({
  headerProps,
  footerProps,
  header,
  footer,
  sections,
  hiddenRoutes = [],
  renderItem,
  showHeader = true,
  showFooter = true,
  ...props
}: DrawerContentProps) {
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const borderColor = useThemeColor('border');
  const tintColor = useThemeColor('tint');

  const { state, descriptors, navigation } = props;

  const filteredRoutes = state.routes.filter((route) => !hiddenRoutes.includes(route.name));

  const renderSections = () => {
    if (!sections) {
      return <DrawerItemList {...props} />;
    }

    return sections.map((section) => {
      const sectionRoutes = filteredRoutes.filter((route) => section.routes.includes(route.name));

      if (sectionRoutes.length === 0) return null;

      return (
        <View key={section.key}>
          {section.title && (
            <ThemedView style={[styles.sectionHeader, { borderBottomColor: borderColor }]}>
              <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
            </ThemedView>
          )}
          {sectionRoutes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.drawerLabel !== undefined
                ? options.drawerLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === state.routes.findIndex((r) => r.key === route.key);

            if (renderItem) {
              return renderItem(route, index, isFocused);
            }

            const onPress = () => {
              const event = navigation.emit({
                type: 'drawerItemPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={[styles.drawerItem, isFocused && styles.drawerItemFocused]}
              >
                <View style={styles.drawerItemContent}>
                  {options.drawerIcon && (
                    <View style={styles.drawerItemIcon}>
                      {options.drawerIcon({
                        focused: isFocused,
                        size: 24,
                        color: isFocused ? tintColor : textColor,
                      })}
                    </View>
                  )}
                  <ThemedText
                    style={[styles.drawerItemLabel, isFocused && styles.drawerItemLabelFocused]}
                  >
                    {label as string}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>
      );
    });
  };

  const renderHeader = () => {
    // New generic header takes priority
    if (headerProps && showHeader) {
      return <DrawerHeader {...headerProps} />;
    }

    // Legacy custom header support
    if (header && showHeader) {
      return (
        <ThemedView style={[styles.header, { borderBottomColor: borderColor }]}>
          {header}
        </ThemedView>
      );
    }

    return null;
  };

  const renderFooter = () => {
    // New generic footer takes priority
    if (footerProps && showFooter) {
      return <DrawerFooter {...footerProps} />;
    }

    // Legacy custom footer support
    if (footer && showFooter) {
      return (
        <ThemedView style={[styles.footer, { borderTopColor: borderColor }]}>{footer}</ThemedView>
      );
    }

    return null;
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[styles.container, { backgroundColor }]}
    >
      {renderHeader()}

      <ThemedView style={styles.content}>
        {sections ? renderSections() : <DrawerItemList {...props} />}
      </ThemedView>

      {renderFooter()}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
    paddingVertical: 8,
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  drawerItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  drawerItemFocused: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  drawerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerItemIcon: {
    marginRight: 12,
  },
  drawerItemLabel: {
    fontSize: 16,
  },
  drawerItemLabelFocused: {
    fontWeight: '600',
  },
});
