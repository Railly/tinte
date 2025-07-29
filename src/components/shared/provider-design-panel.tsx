'use client';

import * as React from 'react';
import { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPickerInput } from '@/components/ui/color-picker-input';
import { TinteThemeSwitcher } from './tinte-theme-switcher';
import { ThemeData } from '@/lib/theme-applier';
import { DEFAULT_THEME_ID } from '@/utils/tinte-presets';

export function ProviderDesignPanel({
  allThemes,
  activeThemeRef,
  onThemeSelect,
  currentTokens,
  onTokenEdit,
}: {
  activeThemeRef: React.RefObject<ThemeData | null>;
  allThemes: ThemeData[];
  onThemeSelect: (theme: ThemeData) => void;
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

  const activeId = activeThemeRef.current?.id ?? DEFAULT_THEME_ID;

  return (
    <ScrollArea className="h-[calc(100dvh-var(--header-height)_-_4.5rem)]">
      {/* Fixed controls section */}
      <div className="px-3 space-y-4 border-b flex-shrink-0">
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
        <div className="p-3 space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Tokens</div>
          <div className="space-y-2">
            {Object.entries(currentTokens).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="text-xs font-mono text-muted-foreground">{key}</div>
                <ColorPickerInput
                  color={value}
                  onChange={(newValue) => onTokenEdit(key, newValue)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}