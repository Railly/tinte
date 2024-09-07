import useSWRInfinite from "swr/infinite";
import { useCallback } from "react";
import { ThemeConfig } from "@/lib/core/types"; // Adjust this import path as needed

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ThemeResponse {
  themes: ThemeConfig[];
  hasMore: boolean;
}

export function useInfiniteThemes(
  initialData: ThemeResponse,
  category: string,
  userId?: string | null,
) {
  const getKey = (
    pageIndex: number,
    previousPageData: ThemeResponse | null,
  ) => {
    if (previousPageData && !previousPageData.hasMore) return null;
    const url = new URL(`/api/themes`, window.location.origin);
    url.searchParams.append("page", (pageIndex + 1).toString());
    url.searchParams.append("limit", "20");
    url.searchParams.append("category", category);
    if (userId) url.searchParams.append("userId", userId);
    return url.toString();
  };

  const { data, error, size, setSize, isValidating, mutate } =
    useSWRInfinite<ThemeResponse>(getKey, fetcher, {
      fallbackData: [initialData],
      revalidateFirstPage: false,
      revalidateAll: false,
      persistSize: true,
    });

  const refreshFirstPage = useCallback(() => {
    mutate(
      async () => {
        const firstPageUrl = getKey(0, null);
        if (firstPageUrl) {
          const updatedFirstPage = await fetcher(firstPageUrl);
          return [
            updatedFirstPage,
            ...(data?.slice(1) || []),
          ] as ThemeResponse[];
        }
        return data as ThemeResponse[];
      },
      {
        optimisticData: (currentData) => {
          if (currentData && currentData.length > 0) {
            return [
              { ...currentData[0], themes: [] },
              ...currentData.slice(1),
            ] as ThemeResponse[];
          }
          return currentData as ThemeResponse[];
        },
        revalidate: false,
      },
    );
  }, [mutate, data, getKey]);

  return {
    data,
    error,
    size,
    setSize,
    isValidating,
    refreshFirstPage,
  };
}
