'use client';

import { useTheme } from 'next-themes';
import { useTinteTheme } from '@/stores/tinte-theme';

export function useThemeApplier() {
  const { theme } = useTheme();
  const { activeTheme } = useTinteTheme();

  return {
    currentMode: theme as 'light' | 'dark',
    activeTheme,
    isDark: theme === 'dark'
  };
}