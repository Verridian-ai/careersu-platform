/**
 * useBackdropFilterSupport - Hook for detecting backdrop-filter support
 *
 * Detects whether the browser supports CSS backdrop-filter property
 * and returns fallback styling if needed
 */

import { useEffect, useState } from 'react';

export function useBackdropFilterSupport() {
  const [isSupported, setIsSupported] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window === 'undefined') return;

    // Check if backdrop-filter is supported
    const element = document.createElement('div');
    const style = element.style;

    const isSupported = (
      style.backdropFilter !== undefined ||
      style.WebkitBackdropFilter !== undefined
    );

    setIsSupported(isSupported);
  }, []);

  return {
    isSupported,
    isClient,
    // Returns class name for fallback styling
    getFallbackClass: () => isSupported ? '' : 'backdrop-filter-fallback'
  };
}

export default useBackdropFilterSupport;
