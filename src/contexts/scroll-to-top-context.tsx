import { createContext } from 'react';

// Context to provide scroll function to child components
export interface ScrollToTopContextType {
  registerScrollHandler: (
    scrollTo: (options?: { x?: number; y?: number; animated?: boolean }) => void
  ) => void;
  triggerScrollToTop: () => void;
}

export const ScrollToTopContext = createContext<ScrollToTopContextType | null>(null);
