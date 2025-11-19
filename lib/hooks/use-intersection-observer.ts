import { useEffect, useRef, useState } from 'react'

interface IntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  freezeOnceVisible?: boolean
}

/**
 * Custom hook for intersection observer
 * Useful for lazy loading and infinite scroll
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: IntersectionObserverOptions = {}
) {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false
  } = options

  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const [node, setNode] = useState<T | null>(null)

  const frozen = entry?.isIntersecting && freezeOnceVisible

  useEffect(() => {
    if (!node || frozen) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      observerParams
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [node, threshold, root, rootMargin, frozen])

  return {
    ref: setNode,
    entry,
    isIntersecting: !!entry?.isIntersecting
  }
}

