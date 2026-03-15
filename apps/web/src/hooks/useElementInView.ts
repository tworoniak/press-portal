import { useEffect, useState, type RefObject } from 'react';

export function useElementInView<T extends Element>(
  ref: RefObject<T | null> | undefined,
) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref?.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}
