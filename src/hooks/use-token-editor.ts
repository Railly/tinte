'use client';

import { useState, useCallback, useMemo } from 'react';
import { adapterRegistry } from '@/lib/adapters';
import { ThemeData } from '@/lib/theme-applier';
import { formatHex, parse } from 'culori';

function convertColorToHex(colorValue: string): string {
  try {
    if (colorValue.startsWith('#')) return colorValue;
    
    const parsed = parse(colorValue);
    if (parsed) {
      return formatHex(parsed) || colorValue;
    }
    return colorValue;
  } catch {
    return colorValue;
  }
}

export function useTokenEditor(activeTheme: ThemeData | null, isDark: boolean) {
  const [editedTokens, setEditedTokens] = useState<Record<string, string>>({});

  const baseTokens = useMemo(() => {
    if (!activeTheme) {
      if (typeof window === 'undefined') return {};
      
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      return [
        'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
        'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted',
        'muted-foreground', 'accent', 'accent-foreground', 'destructive', 'border', 'input', 'ring'
      ].reduce((acc, token) => {
        const value = computedStyle.getPropertyValue(`--${token}`).trim();
        if (value) acc[token] = convertColorToHex(value);
        return acc;
      }, {} as Record<string, string>);
    }

    try {
      let tokens: Record<string, string> = {};
      
      if (activeTheme.author === 'tweakcn' && activeTheme.rawTheme) {
        tokens = activeTheme.rawTheme[isDark ? 'dark' : 'light'] || {};
      } else if (activeTheme.rawTheme) {
        const shadcnTheme = adapterRegistry.convert("shadcn", activeTheme.rawTheme);
        tokens = shadcnTheme[isDark ? 'dark' : 'light'] || {};
      } else {
        const colors = activeTheme.colors;
        tokens = {
          background: colors.background,
          foreground: colors.foreground,
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
          'card': colors.background,
          'card-foreground': colors.foreground,
          'popover': colors.background,
          'popover-foreground': colors.foreground,
          'primary-foreground': colors.background,
          'secondary-foreground': colors.foreground,
          'accent-foreground': colors.foreground,
          'muted': colors.background,
          'muted-foreground': colors.foreground,
          'border': colors.foreground + '33',
          'input': colors.background,
          'ring': colors.primary
        };
      }

      const convertedTokens: Record<string, string> = {};
      Object.entries(tokens).forEach(([key, value]) => {
        convertedTokens[key] = convertColorToHex(value);
      });
      
      return convertedTokens;
    } catch (error) {
      console.warn('Failed to extract theme tokens:', error);
      return activeTheme.colors;
    }
  }, [activeTheme, isDark]);

  const currentTokens = useMemo(() => {
    return { ...baseTokens, ...editedTokens };
  }, [baseTokens, editedTokens]);

  const handleTokenEdit = useCallback((key: string, value: string) => {
    setEditedTokens(prev => ({ ...prev, [key]: value }));

    requestAnimationFrame(() => {
      const root = document.documentElement;
      root.style.setProperty(`--${key}`, value);
    });
  }, []);

  const resetTokens = useCallback(() => {
    setEditedTokens({});
  }, []);

  return {
    currentTokens,
    handleTokenEdit,
    resetTokens
  };
}