import { Search } from "@upstash/search";
import type { Theme } from "@/lib/db/queries";

if (!process.env.UPSTASH_SEARCH_REST_URL || !process.env.UPSTASH_SEARCH_REST_TOKEN) {
  throw new Error("Missing Upstash Search environment variables");
}

const client = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN,
});

const THEMES_INDEX = "themes";
const index = client.index<{
  name: string;
  description: string;
  content: string;
  public: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}>(THEMES_INDEX);

export interface SearchableTheme {
  id: string;
  content: {
    name: string;
    description: string;
    content: string;
    public: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
  metadata: {
    themeId: number;
    userId: string;
    public: boolean;
    url?: string;
  };
}

export async function indexTheme(theme: Theme): Promise<void> {
  try {
    const searchableTheme: SearchableTheme = {
      id: `theme-${theme.id}`,
      content: {
        name: theme.name,
        description: theme.description || "",
        content: theme.content,
        public: theme.public,
        userId: theme.user_id,
        createdAt: theme.created_at,
        updatedAt: theme.updated_at,
      },
      metadata: {
        themeId: theme.id,
        userId: theme.user_id,
        public: theme.public,
        url: `/themes/${theme.id}`,
      },
    };

    await index.upsert([searchableTheme]);
    console.log(`Theme ${theme.id} indexed successfully`);
  } catch (error) {
    console.error(`Failed to index theme ${theme.id}:`, error);
    throw error;
  }
}

export async function deleteThemeFromIndex(themeId: number): Promise<void> {
  try {
    await index.delete([`theme-${themeId}`]);
    console.log(`Theme ${themeId} removed from search index`);
  } catch (error) {
    console.error(`Failed to remove theme ${themeId} from index:`, error);
    throw error;
  }
}

export async function searchThemes(
  query: string,
  options: {
    limit?: number;
    userId?: string;
    publicOnly?: boolean;
  } = {}
): Promise<SearchableTheme[]> {
  try {
    const { limit = 10, userId, publicOnly = false } = options;
    
    let results = await index.search({
      query,
      limit,
      reranking: true,
    });

    // Filter results based on access permissions
    if (publicOnly) {
      results = results.filter((result) => (result.metadata as any)?.public === true);
    } else if (userId) {
      results = results.filter(
        (result) =>
          (result.metadata as any)?.public === true || (result.metadata as any)?.userId === userId
      );
    }

    return results.map(result => ({
      id: result.id,
      content: result.content,
      metadata: result.metadata as SearchableTheme['metadata']
    }));
  } catch (error) {
    console.error("Failed to search themes:", error);
    throw error;
  }
}

export async function reindexAllThemes(themes: Theme[]): Promise<void> {
  try {
    const searchableThemes: SearchableTheme[] = themes.map((theme) => ({
      id: `theme-${theme.id}`,
      content: {
        name: theme.name,
        description: theme.description || "",
        content: theme.content,
        public: theme.public,
        userId: theme.user_id,
        createdAt: theme.created_at,
        updatedAt: theme.updated_at,
      },
      metadata: {
        themeId: theme.id,
        userId: theme.user_id,
        public: theme.public,
        url: `/themes/${theme.id}`,
      },
    }));

    await index.upsert(searchableThemes);
    console.log(`Reindexed ${themes.length} themes successfully`);
  } catch (error) {
    console.error("Failed to reindex themes:", error);
    throw error;
  }
}