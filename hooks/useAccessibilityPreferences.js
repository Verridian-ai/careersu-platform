/**
 * useAccessibilityPreferences - Hook for detecting system accessibility preferences
 *
 * Detects:
 * - prefers-reduced-motion
 * - prefers-reduced-transparency
 * - prefers-contrast
 */

import { useEffect, useState } from 'react';

export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    reducedTransparency: false,
    highContrast: false,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window === 'undefined') return;

    // Check reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPreferences(prev => ({
      ...prev,
      reducedMotion: motionQuery.matches
    }));

    // Check reduced transparency preference
    const transparencyQuery = window.matchMedia('(prefers-reduced-transparency: reduce)');
    setPreferences(prev => ({
      ...prev,
      reducedTransparency: transparencyQuery.matches
    }));

    // Check high contrast preference
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');
    setPreferences(prev => ({
      ...prev,
      highContrast: contrastQuery.matches
    }));

    // Listen for changes
    const handleMotionChange = (e) => {
      setPreferences(prev => ({
        ...prev,
        reducedMotion: e.matches
      }));
    };

    const handleTransparencyChange = (e) => {
      setPreferences(prev => ({
        ...prev,
        reducedTransparency: e.matches
      }));
    };

    const handleContrastChange = (e) => {
      setPreferences(prev => ({
        ...prev,
        highContrast: e.matches
      }));
    };

    // Add event listeners
    motionQuery.addEventListener('change', handleMotionChange);
    transparencyQuery.addEventListener('change', handleTransparencyChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      transparencyQuery.removeEventListener('change', handleTransparencyChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  return { ...preferences, isClient };
}

export default useAccessibilityPreferences;
