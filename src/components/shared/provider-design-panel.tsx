'use client';

import * as React from 'react';
import { useMemo } from 'react';
import { motion, stagger, useAnimate } from 'motion/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPickerInput } from '@/components/ui/color-picker-input';
import { TinteThemeSwitcher } from './tinte-theme-switcher';
import { ThemeData } from '@/lib/theme-tokens';

export function ProviderDesignPanel({
  allThemes,
  activeTheme,
  onThemeSelect,
  currentTokens,
  onTokenEdit,
  tokensLoading = false,
}: {
  activeTheme: ThemeData | null;
  allThemes: ThemeData[];
  onThemeSelect: (theme: ThemeData) => void;
  currentTokens: Record<string, string>;
  onTokenEdit: (key: string, value: string) => void;
  tokensLoading?: boolean;
}) {
  const [scope, animate] = useAnimate();
  const tokenEntries = Object.entries(currentTokens);

  // Animate tokens when they change
  React.useEffect(() => {
    if (tokenEntries.length > 0) {
      animate(
        ".token-item",
        { opacity: [0, 1], y: [8, 0] },
        { 
          duration: 0.3,
          delay: stagger(0.05, { startDelay: 0.1 })
        }
      );
    }
  }, [animate, tokenEntries.length]);
  const convertedThemes = useMemo(
    () =>
      allThemes.map((t): ThemeData => ({
        id: t.id,
        name: t.name,
        description: t.description,
        author: t.author,
        downloads: t.downloads,
        likes: t.likes,
        views: t.views,
        createdAt: t.createdAt,
        colors: t.colors,
        tags: t.tags,
        rawTheme: t.rawTheme,
      })),
    [allThemes]
  );

  // Show activeTheme immediately, even if allThemes hasn't loaded yet
  const activeId = activeTheme?.id || null;

  // If activeTheme exists but not in allThemes yet, add it temporarily
  const themesWithActive = useMemo(() => {
    if (!activeTheme) return convertedThemes;
    
    // Check if activeTheme is already in the list
    const hasActiveTheme = convertedThemes.some(t => t.id === activeTheme.id);
    
    if (hasActiveTheme) {
      return convertedThemes;
    } else {
      // Add activeTheme at the beginning so it's available immediately
      return [activeTheme, ...convertedThemes];
    }
  }, [activeTheme, convertedThemes]);

  return (
    <ScrollArea className="h-[calc(100dvh-var(--header-height)_-_4.5rem)]">
      {/* Fixed controls section */}
      <div className="px-3 space-y-4 border-b flex-shrink-0">
        {/* Theme switcher (popover + search) */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Theme</div>
          <TinteThemeSwitcher
            themes={themesWithActive}
            activeId={activeId}
            onSelect={onThemeSelect}
            triggerClassName="w-full"
            label="Browse themes…"
          />
        </div>
      </div>

      {/* Scrollable token editor section */}
      <div className="flex-1 min-h-0" ref={scope}>
        <div className="p-3 space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Tokens</div>
          <div className="space-y-2">
            {tokenEntries.length === 0 || tokensLoading ? (
              <div className="space-y-2">
                {/* Loading skeleton with choreographic animation */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    className="space-y-1"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="h-3 bg-muted/50 rounded w-20"></div>
                    <div className="h-9 bg-muted/30 rounded"></div>
                  </motion.div>
                ))}
              </div>
            ) : (
              tokenEntries.map(([key, value], index) => (
                <motion.div
                  key={key}
                  className="token-item space-y-1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05 + 0.1
                  }}
                >
                  <div className="text-xs font-mono text-muted-foreground">{key}</div>
                  <ColorPickerInput
                    color={value}
                    onChange={(newValue) => onTokenEdit(key, newValue)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}