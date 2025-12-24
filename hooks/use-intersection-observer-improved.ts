import { useEffect, RefObject } from 'react';

export interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  onIntersect?: () => void;
  enabled?: boolean;
}

export function useIntersectionObserver(
  ref: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
) {
  const { threshold = 0, root = null, rootMargin = '0px', onIntersect, enabled = true } = options;

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect?.();
          }
        });
      },
      { threshold, root, rootMargin }
    );

    const element = ref.current;
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [ref, threshold, root, rootMargin, onIntersect, enabled]);
}

// Lazy load image hook
export function useLazyImage(ref: RefObject<HTMLImageElement>, src: string) {
  useIntersectionObserver(ref, {
    threshold: 0.1,
    onIntersect: () => {
      if (ref.current && !ref.current.src) {
        ref.current.src = src;
      }
    },
  });
}
