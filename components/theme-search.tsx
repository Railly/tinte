'use client';

import { useQueryState } from 'nuqs';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

export function ThemeSearch() {
  const [searchQuery, setSearchQuery] = useQueryState('q', {
    defaultValue: '',
    shallow: false,
  });


  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search themes..."
        value={searchQuery || ''}
        onChange={(e) => setSearchQuery(e.target.value || null)}
        className="pl-9 pr-9"
      />
    </div>
  );
}