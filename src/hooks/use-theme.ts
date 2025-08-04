'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme-store';
import { useThemeExport } from '@/lib/theme-utils';

export function useTheme() {
  const store = useThemeStore();
  const themeExport = useThemeExport(store.tinteTheme);
  
  useEffect(() => {
    if (!store.mounted) {
      store.initialize();
    }
  }, [store.mounted, store.initialize]);

  return {
    // Core state
    ...store,
    
    // Export functionality
    ...themeExport,
    
    // Legacy compatibility
    theme: store.currentMode,
    setTheme: store.setMode,
    handleModeChange: store.setMode,
    toggleTheme: store.toggleMode,
    handleThemeSelect: store.selectTheme,
    handleTokenEdit: store.editToken,
    resetTokens: store.resetTokens,
  };
}
