import { useContext } from 'react';
import { ScrollToTopContext } from '@/contexts/scroll-to-top-context';

export const useScrollToTop = () => {
  const context = useContext(ScrollToTopContext);
  return context;
};
