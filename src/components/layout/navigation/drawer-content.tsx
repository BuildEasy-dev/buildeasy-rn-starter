import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { ThemedView, ThemedText, ThemedSafeAreaView } from '@/components/themed';
import { Separator } from '@/components/ui/separator';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface DrawerSection {
  key: string;
  title?: string;
  routes: string[];
}

export interface DrawerContentProps extends DrawerContentComponentProps {
  /**
   * Header - can be DrawerHeader component or any React component
   * - React component (including DrawerHeader)
   */
  header?: React.ReactNode;
  /**
   * Footer - can be DrawerFooter component or any React component
   * - React component (including DrawerFooter)
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
 * import { AppBrandDrawerHeader, DrawerHeader, DrawerFooter } from '@/components/layout';
 * import { LogoutButton } from './logout-button';
 *
 * // Using header/footer as React components
 * <Drawer
 *   drawerContent={(props) => (
 *     <DrawerContent
 *       {...props}
 *       header={<AppBrandDrawerHeader appName="My App" tagline="Version 1.0" />}
 *       footer={
 *         <DrawerFooter
 *           actions={[
 *             {
 *               id: 'logout',
 *               label: 'Sign Out',
 *               icon: 'arrow.right.square',
 *               type: 'button',
 *               onPress: handleLogout,
 *             },
 *           ]}
 *           version="v1.0.0"
 *           copyright="© 2024 My Company"
 *         />
 *       }
 *       sections={[
 *         { key: 'main', title: 'Main', routes: ['home', 'profile'] },
 *         { key: 'settings', title: 'Settings', routes: ['settings', 'about'] }
 *       ]}
 *     />
 *   )}
 * />
 *
 * // Using generic DrawerHeader with custom content
 * <Drawer
 *   drawerContent={(props) => (
 *     <DrawerContent
 *       {...props}
 *       header={
 *         <DrawerHeader backgroundColor="#1e40af">
 *           <CustomHeaderContent />
 *         </DrawerHeader>
 *       }
 *       footer={<CustomFooterComponent />}
 *     />
 *   )}
 * />
 * ```
 */
export function DrawerContent({
  header,
  footer,
  sections,
  hiddenRoutes = [],
  renderItem,
  ...props
}: DrawerContentProps) {
  const textColor = useThemeColor('text');
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
            <ThemedView style={styles.sectionHeader}>
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
    if (!header) return null;

    return (
      <ThemedView style={styles.header}>
        {header}
        <Separator style={styles.headerSeparator} />
      </ThemedView>
    );
  };

  const renderFooter = () => {
    if (!footer) return null;

    return (
      <ThemedView style={styles.footer}>
        <Separator style={styles.footerSeparator} />
        {footer}
      </ThemedView>
    );
  };

  return (
    <ThemedSafeAreaView style={styles.drawerContainer}>
      {/* Fixed Header */}
      <ThemedView style={styles.fixedHeader}>{renderHeader()}</ThemedView>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollableContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>
          {sections ? renderSections() : <DrawerItemList {...props} />}
        </ThemedView>
      </ScrollView>

      {/* Fixed Footer */}
      <ThemedView style={styles.fixedFooter}>{renderFooter()}</ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  drawerContainer: {
    flex: 1,
  },
  fixedHeader: {
    // Header stays at the top
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  fixedFooter: {
    // Footer stays at the bottom
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerSeparator: {
    marginTop: 20,
    marginHorizontal: -16,
  },
  content: {
    paddingVertical: 8,
  },
  footer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  footerSeparator: {
    marginBottom: 20,
    marginHorizontal: -16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 2,
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
