import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { ThemedView, ThemedText, ThemedSafeAreaView } from '@/components/themed';
import { Separator } from '@/components/ui/separator';
import { DrawerItem } from './drawer-item';
import { IconSymbolName } from '@/components/ui/icon-symbol';

export interface DrawerRoute {
  name: string;
  label?: string;
  icon?: IconSymbolName;
  badge?: string | number;
  badgeVariant?: 'default' | 'danger';
}

export interface DrawerSection {
  title?: string;
  routes: DrawerRoute[];
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
   * Group routes into sections with unified configuration
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
 * // Simplified unified configuration
 * <Drawer
 *   drawerContent={(props) => (
 *     <DrawerContent
 *       {...props}
 *       sections={[
 *         {
 *           title: 'Main',
 *           routes: [
 *             { name: 'home', label: 'Home', icon: 'house.fill' },
 *             { name: 'profile', label: 'Profile', icon: 'person.fill', badge: 'New' },
 *             { name: 'dashboard', label: 'Dashboard', icon: 'square.grid.2x2', badge: 5 }
 *           ]
 *         },
 *         {
 *           title: 'Settings',
 *           routes: [
 *             { name: 'settings', label: 'Settings', icon: 'gear', badge: 2 },
 *             { name: 'help', label: 'Help', icon: 'questionmark.circle', badge: '!', badgeVariant: 'danger' }
 *           ]
 *         }
 *       ]}
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
  const { state, descriptors, navigation } = props;

  const filteredRoutes = state.routes.filter((route) => !hiddenRoutes.includes(route.name));

  const renderSections = () => {
    if (!sections) {
      return <DrawerItemList {...props} />;
    }

    return sections.map((section, sectionIndex) => {
      const sectionRouteNames = section.routes.map((route) => route.name);
      const sectionRoutes = filteredRoutes.filter((route) =>
        sectionRouteNames.includes(route.name)
      );

      if (sectionRoutes.length === 0) return null;

      return (
        <View key={sectionIndex}>
          {section.title && (
            <ThemedView style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
            </ThemedView>
          )}
          {sectionRoutes.map((route, index) => {
            const { options } = descriptors[route.key];

            // Find the route configuration from our sections
            const routeConfig = section.routes.find((r) => r.name === route.name);

            const label =
              routeConfig?.label ||
              (options.drawerLabel !== undefined
                ? options.drawerLabel
                : options.title !== undefined
                  ? options.title
                  : route.name);

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
              <DrawerItem
                key={route.key}
                label={label as string}
                icon={routeConfig?.icon}
                focused={isFocused}
                badge={routeConfig?.badge}
                badgeVariant={routeConfig?.badgeVariant}
                onPress={onPress}
              />
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
});
