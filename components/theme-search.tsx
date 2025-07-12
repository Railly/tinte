'use client';

import { useEffect, useCallback } from 'react';
import { useThemeStore } from '@/lib/stores/theme-store';
import { Input } from './ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';

export function ThemeSearch() {
  const { 
    searchQuery, 
    setSearchQuery,
    useUpstashSearch,
    setSearchResults,
    setIsSearching,
    isSearching,
    showPublicOnly
  } = useThemeStore();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim() || !useUpstashSearch) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      
      const searchParams = new URLSearchParams({
        q: query.trim(),
        limit: '20',
        publicOnly: showPublicOnly.toString(),
      });

      const response = await fetch(`/api/search?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [useUpstashSearch, showPublicOnly, setSearchResults, setIsSearching]);

  useEffect(() => {
    if (useUpstashSearch) {
      performSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, performSearch, useUpstashSearch]);

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      {isSearching && useUpstashSearch && (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
      )}
      <Input
        placeholder={useUpstashSearch ? "Search themes with AI..." : "Search themes..."}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 pr-9"
      />
    </div>
  );
}