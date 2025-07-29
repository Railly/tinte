'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ThemeColorPreview } from '@/components/shared/theme-color-preview';

interface ThemeListItem {
  id: string;
  name: string;
  colors: Record<string, string>;
  provider?: string;
  author?: string;
}

interface ThemeListProps {
  themes: ThemeListItem[];
  activeId?: string | null;
  onSelect: (theme: ThemeListItem) => void;
  className?: string;
  showProvider?: boolean;
  getProviderIcon?: (provider: string) => React.ReactNode;
}

export function ThemeList({
  themes,
  activeId,
  onSelect,
  className,
  showProvider = false,
  getProviderIcon
}: ThemeListProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {themes.map(theme => {
        const isActive = theme.id === activeId;
        
        return (
          <button
            key={theme.id}
            onClick={() => onSelect(theme)}
            className={cn(
              'w-full flex items-center gap-3 p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm text-left',
              isActive && 'bg-muted'
            )}
          >
            <ThemeColorPreview colors={theme.colors} maxColors={5} />
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <div className="text-xs font-medium truncate">{theme.name}</div>
              {theme.author && (
                <div className="text-[10px] text-muted-foreground truncate">
                  {theme.author}
                </div>
              )}
              {showProvider && theme.provider && (
                <div className="flex items-center gap-1">
                  {getProviderIcon?.(theme.provider)}
                  <span className="text-xs text-muted-foreground capitalize">{theme.provider}</span>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}