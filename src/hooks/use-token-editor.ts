'use client';

import { useState, useCallback, useMemo } from 'react';

export function useTokenEditor() {
  const [editedTokens, setEditedTokens] = useState<Record<string, string>>({});

  const currentTokens = useMemo(() => {
    if (typeof window === 'undefined') return {};

    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    const baseTokens = [
      'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
      'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted',
      'muted-foreground', 'accent', 'accent-foreground', 'destructive', 'border', 'input', 'ring'
    ].reduce((acc, token) => {
      const value = computedStyle.getPropertyValue(`--${token}`).trim();
      if (value) acc[token] = value;
      return acc;
    }, {} as Record<string, string>);

    return { ...baseTokens, ...editedTokens };
  }, [editedTokens]);

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