'use client';

import * as React from 'react';
import { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TinteThemeSwitcher } from './tinte-theme-switcher';
import { ThemeData } from '@/lib/theme-applier';

type ThemeMode = 'light' | 'dark';

export function ProviderDesignPanel({
  allThemes,
  activeThemeRef,
  onThemeSelect,
  mode,
  setTheme,
  currentTokens,
  onTokenEdit,
}: {
  activeThemeRef: React.RefObject<ThemeData | null>;
  allThemes: ThemeData[];
  onThemeSelect: (theme: ThemeData) => void;
  mode: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  currentTokens: Record<string, string>;
  onTokenEdit: (key: string, value: string) => void;
}) {
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

  const activeId = activeThemeRef.current?.id ?? null;

  return (
    <ScrollArea className="h-[calc(100dvh-var(--header-height)_-_4.5rem)]">
      {/* Fixed controls section */}
      <div className="p-3 space-y-4 border-b flex-shrink-0">
        {/* Theme switcher (popover + search) */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Theme</div>
          <TinteThemeSwitcher
            themes={convertedThemes}
            activeId={activeId}
            onSelect={onThemeSelect}
            triggerClassName="w-full"
            label="Browse themes…"
          />
        </div>
      </div>

      {/* Scrollable token editor section */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Tokens ({mode})</div>
            <div className="space-y-2">
              {Object.entries(currentTokens).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="text-xs font-mono text-muted-foreground">{key}</div>
                  <div className="flex items-center gap-2">
                    <span
                      className="mt-0.5 inline-block h-4 w-4 flex-shrink-0 rounded border border-border"
                      style={{ backgroundColor: value }}
                    />
                    <Input
                      value={value}
                      onChange={(e) => onTokenEdit(key, e.target.value)}
                      className="h-7 text-xs font-mono"
                      placeholder="#000000"
                      spellCheck={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </ScrollArea>
  );
}