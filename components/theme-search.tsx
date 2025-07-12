'use client';

import { useThemeStore } from '@/lib/stores/theme-store';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

export function ThemeSearch() {
  const { searchQuery, setSearchQuery } = useThemeStore();

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search themes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}