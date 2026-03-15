import { useEffect } from 'react';

export default function useBodyClassOnIntersect(
  targetSelector: string,
  className: string,
) {
  useEffect(() => {
    const element = document.querySelector(targetSelector);

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.body.classList.add(className);
        } else {
          document.body.classList.remove(className);
        }
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [targetSelector, className]);
}
