'use client';

import { useCallback, useEffect, useRef } from 'react';

export function useScrollDirection() {
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('down');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current) {
        scrollDirection.current = 'down';
      } else if (currentScrollY < lastScrollY.current) {
        scrollDirection.current = 'up';
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollDirection.current;
}

export function useScrollToTop() {
  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({ top: 0, behavior });
  }, []);

  return scrollToTop;
}

export function useScrollIntoView() {
  const scrollIntoView = useCallback(
    (element: HTMLElement | null, options?: ScrollIntoViewOptions) => {
      element?.scrollIntoView({ behavior: 'smooth', block: 'center', ...options });
    },
    []
  );

  return scrollIntoView;
}
