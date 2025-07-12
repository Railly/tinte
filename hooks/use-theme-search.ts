"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { searchThemesAction } from "@/lib/actions/theme-actions";
import type { Theme } from "@/lib/db/schema";

interface UseThemeSearchProps {
  // URL state (from Nuqs) - shareable
  query: string | null;
  publicOnly: boolean;
  // Server state - fallback themes
  fallbackThemes: Theme[];
}

interface UseThemeSearchReturn {
  themes: Theme[];
  isPending: boolean;
  isSearchActive: boolean;
  error: string | null;
}

/**
 * Custom hook for theme search functionality
 *
 * Follows architectural state strategy:
 * - URL params (query, filters) → Nuqs (shareable)
 * - User preferences (search type) → Zustand (client-only, persisted)
 * - Search results → Local state (ephemeral)
 */
export function useThemeSearch({
  query,
  publicOnly,
  fallbackThemes,
}: UseThemeSearchProps): UseThemeSearchReturn {
  // Local ephemeral state
  const [searchResults, setSearchResults] = useState<Theme[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Debounce query to prevent excessive API calls
  const debouncedQuery = useDebounce(query?.trim() || "", 300);

  // Memoized search conditions
  const isSearchActive = useMemo(
    () => Boolean(debouncedQuery),
    [debouncedQuery]
  );

  // Execute search when conditions change
  useEffect(() => {
    if (!isSearchActive) {
      setSearchResults([]);
      setError(null);
      return;
    }

    startTransition(async () => {
      try {
        setError(null);
        const result = await searchThemesAction(debouncedQuery, {
          limit: 50,
          publicOnly,
        });

        if (result.success) {
          setSearchResults(result.data || []);
        } else {
          setError(result.error || "Search failed");
          setSearchResults([]);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Search error";
        setError(errorMessage);
        setSearchResults([]);
        console.error("Theme search error:", err);
      }
    });
  }, [debouncedQuery, publicOnly, isSearchActive]);

  // Return appropriate themes based on search state
  const themes = isSearchActive ? searchResults : fallbackThemes;

  return {
    themes,
    isPending,
    isSearchActive,
    error,
  };
}
