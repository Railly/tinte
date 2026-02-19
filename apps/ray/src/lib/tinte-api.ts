import type { TinteBlock } from "@tinte/core";

const API_BASE = "https://www.tinte.dev/api/themes/public";

export interface CommunityTheme {
  id: string;
  name: string;
  slug: string;
  author: string;
  light: TinteBlock;
  dark: TinteBlock;
}

interface ApiTheme {
  id: string;
  name: string;
  slug: string;
  rawTheme: {
    light: TinteBlock;
    dark: TinteBlock;
  };
  user?: {
    name: string;
  } | null;
}

interface ApiResponse {
  themes: ApiTheme[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

function mapApiTheme(t: ApiTheme): CommunityTheme {
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    author: t.user?.name ?? "Anonymous",
    light: t.rawTheme.light,
    dark: t.rawTheme.dark,
  };
}

export async function fetchCommunityThemes(options: {
  search?: string;
  page?: number;
  limit?: number;
  vendor?: "tinte" | "tweakcn" | "rayso";
}): Promise<{ themes: CommunityTheme[]; total: number; hasMore: boolean }> {
  const params = new URLSearchParams();
  if (options.search) params.set("search", options.search);
  if (options.page) params.set("page", String(options.page));
  if (options.vendor) params.set("vendor", options.vendor);
  params.set("limit", String(options.limit ?? 50));

  const res = await fetch(`${API_BASE}?${params.toString()}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const data: ApiResponse = await res.json();
  return {
    themes: data.themes.map(mapApiTheme),
    total: data.pagination.total,
    hasMore: data.pagination.hasMore,
  };
}
