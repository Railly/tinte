import { useCallback, useEffect, useRef, useState } from "react";
import { type CommunityTheme, fetchCommunityThemes } from "@/lib/tinte-api";

export function useCommunityThemes() {
  const [themes, setThemes] = useState<CommunityTheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const pageRef = useRef(1);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(
    async (query: string, page: number, append: boolean) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const result = await fetchCommunityThemes({
          search: query || undefined,
          page,
          limit: 50,
        });
        if (controller.signal.aborted) return;
        setThemes((prev) =>
          append ? [...prev, ...result.themes] : result.themes,
        );
        setHasMore(result.hasMore);
        setTotal(result.total);
        pageRef.current = page;
      } catch {
        if (!controller.signal.aborted) {
          setHasMore(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    load(search, 1, false);
  }, [search, load]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      load(search, pageRef.current + 1, true);
    }
  }, [loading, hasMore, search, load]);

  return { themes, loading, search, setSearch, hasMore, total, loadMore };
}
