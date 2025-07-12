'use client';

import { useQueryState } from 'nuqs';
import { useThemeStore } from '@/lib/stores/theme-store';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

export function ThemeSearch() {
  const [searchQuery, setSearchQuery] = useQueryState('q', {
    defaultValue: '',
    shallow: false,
  });
  
  const { useUpstashSearch } = useThemeStore();

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={useUpstashSearch ? "Search themes with AI..." : "Search themes..."}
        value={searchQuery || ''}
        onChange={(e) => setSearchQuery(e.target.value || null)}
        className="pl-9 pr-9"
      />
    </div>
  );
}