'use client';

import { useQueryState } from 'nuqs';
import { useThemeStore } from '@/lib/stores/theme-store';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function ThemeFilters() {
  const [showPublicOnly, setShowPublicOnly] = useQueryState('publicOnly', {
    defaultValue: false,
    parse: (value) => value === 'true',
    serialize: (value) => value ? 'true' : null,
    shallow: false,
  });
  
  const { useUpstashSearch, setUseUpstashSearch } = useThemeStore();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show:</span>
        <Button
          variant={!showPublicOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPublicOnly(false)}
        >
          All Themes
        </Button>
        <Button
          variant={showPublicOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPublicOnly(true)}
        >
          Public Only
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Search:</span>
        <Button
          variant={useUpstashSearch ? "default" : "outline"}
          size="sm"
          onClick={() => setUseUpstashSearch(!useUpstashSearch)}
        >
          {useUpstashSearch ? "AI Search" : "Local Search"}
        </Button>
        {useUpstashSearch && (
          <Badge variant="secondary" className="text-xs">
            Powered by Upstash
          </Badge>
        )}
      </div>
    </div>
  );
}