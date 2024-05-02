'use client';

import { useEffect, useState } from 'react';

export default function useMediaQuery(query: string) {
  const isClient = typeof window === 'object';
  const mediaQuery = isClient ? window.matchMedia(query) : null;
  const [matches, setMatches] = useState(
    mediaQuery ? mediaQuery.matches : false,
  );

  useEffect(() => {
    if (!mediaQuery) return;

    const handler = () => setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [mediaQuery]);

  return matches;
}
