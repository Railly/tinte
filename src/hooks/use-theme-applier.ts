'use client';

import { useEffect, useState } from 'react';
import { addThemeChangeListener, ThemeChangeEventDetail } from '@/lib/theme-applier';

export function useThemeApplier() {
  const [currentTheme, setCurrentTheme] = useState<ThemeChangeEventDetail | null>(null);

  useEffect(() => {
    const unsubscribe = addThemeChangeListener((detail) => {
      setCurrentTheme(detail);
    });

    return unsubscribe;
  }, []);

  return currentTheme;
}