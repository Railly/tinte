"use client";

import { useCallback, useEffect, useState } from "react";
import type { ThemeData } from "@/lib/theme";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface UseThemeSearchResult {
  searchResults: ThemeData[];
  localResults: ThemeData[];
  isSearching: boolean;
  searchError: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchLocal: (themes: ThemeData[], query: string) => ThemeData[];
}

export function useThemeSearch(): UseThemeSearchResult {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ThemeData[]>([]);
  const [localResults, setLocalResults] = useState<ThemeData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const searchLocal = useCallback(
    (themes: ThemeData[], query: string): ThemeData[] => {
      if (!query.trim()) return [];

      const lowerQuery = query.toLowerCase();

      return themes.filter((theme) => {
        const nameMatch = theme.name?.toLowerCase().includes(lowerQuery);
        const authorMatch = theme.author?.toLowerCase().includes(lowerQuery);
        const tagsMatch = theme.tags?.some((tag) =>
          tag.toLowerCase().includes(lowerQuery),
        );
        const providerMatch = theme.provider
          ?.toLowerCase()
          .includes(lowerQuery);

        return nameMatch || authorMatch || tagsMatch || providerMatch;
      });
    },
    [],
  );

  const searchThemes = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setLocalResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&limit=20`,
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError(error instanceof Error ? error.message : "Search failed");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    searchThemes(debouncedSearchQuery);
  }, [debouncedSearchQuery, searchThemes]);

  return {
    searchResults,
    localResults,
    isSearching,
    searchError,
    searchQuery,
    setSearchQuery,
    searchLocal,
  };
}
