import React, { createContext, useContext } from 'react';

interface TabBarInsetContextValue {
  bottom: number;
}

const TabBarInsetContext = createContext<TabBarInsetContextValue>({
  bottom: 0,
});

export function TabBarInsetProvider({
  children,
  bottom,
}: {
  children: React.ReactNode;
  bottom: number;
}) {
  return <TabBarInsetContext.Provider value={{ bottom }}>{children}</TabBarInsetContext.Provider>;
}

export function useTabBarInset() {
  const context = useContext(TabBarInsetContext);
  return context.bottom;
}
