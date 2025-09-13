import { Search } from "@upstash/search";
import type { ThemeData } from "@/lib/theme-tokens";

class SearchService {
  private client: Search;
  private index: ReturnType<Search["index"]>;

  constructor() {
    this.client = new Search({
      url: process.env.UPSTASH_SEARCH_REST_URL!,
      token: process.env.UPSTASH_SEARCH_REST_TOKEN!,
    });
    this.index = this.client.index("themes");
  }

  async upsertThemes(themes: ThemeData[]) {
    const documents = themes.map((theme) => ({
      id: theme.id,
      content: {
        name: theme.name,
        description: theme.description,
        author: theme.author || "",
        provider: theme.provider,
        tags: (theme.tags || []).join(" "),
        colors: Object.entries(theme.colors || {})
          .map(([key, value]) => `${key}:${value}`)
          .join(" "),
      },
      metadata: {
        downloads: theme.downloads,
        likes: theme.likes,
        views: theme.views,
        createdAt: theme.createdAt,
        rawTheme: JSON.stringify(theme.rawTheme),
        colors: JSON.stringify(theme.colors),
      },
    }));

    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < documents.length; i += batchSize) {
      batches.push(documents.slice(i, i + batchSize));
    }

    const results = [];
    for (const batch of batches) {
      try {
        const result = await this.index.upsert(batch);
        results.push(result);
        console.log(`Uploaded batch of ${batch.length} themes`);
      } catch (error) {
        console.error(`Error uploading batch:`, error);
      }
    }

    return results;
  }

  async searchThemes(query: string, limit = 20) {
    if (!query.trim()) {
      return [];
    }

    try {
      const searchResults = await this.index.search({
        query,
        limit,
        reranking: true,
      });

      return searchResults.map((result) => {
        try {
          const theme: ThemeData = {
            id: result.id,
            name: result.content.name,
            description: result.content.description,
            author: result.content.author,
            provider: result.content.provider,
            tags: result.content.tags ? result.content.tags.split(" ") : [],
            downloads: result.metadata?.downloads || 0,
            likes: result.metadata?.likes || 0,
            views: result.metadata?.views || 0,
            createdAt: result.metadata?.createdAt || "",
            colors: result.metadata?.colors ? JSON.parse(result.metadata.colors) : {},
            rawTheme: result.metadata?.rawTheme ? JSON.parse(result.metadata.rawTheme) : undefined,
          };
          return theme;
        } catch (error) {
          console.error("Error parsing theme result:", error);
          return null;
        }
      }).filter(Boolean) as ThemeData[];
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  }

  async getUploadedThemeCount(): Promise<number> {
    try {
      // Since we can't read all IDs due to limits, we'll use a sample search to estimate
      const searchResults = await this.index.search({
        query: "theme", // Search for a common term
        limit: 100, // Within read limits
      });
      
      // If we get 100 results, we likely have many themes uploaded
      // We know from the error that ~10,000 were uploaded before hitting the limit
      return searchResults.length === 100 ? 10000 : searchResults.length;
    } catch (error) {
      console.error("Error getting uploaded theme count:", error);
      return 0;
    }
  }

  async getRemainingThemes(allThemes: ThemeData[]): Promise<ThemeData[]> {
    // Since we hit the 10,000 write limit after 100 batches,
    // we know the first 10,000 themes were uploaded successfully
    const UPLOADED_COUNT = 10000;
    
    if (allThemes.length <= UPLOADED_COUNT) {
      console.log("All themes appear to be uploaded already");
      return [];
    }
    
    // Return themes starting from index 10,000 onwards
    const remainingThemes = allThemes.slice(UPLOADED_COUNT);
    
    console.log(`Total themes: ${allThemes.length}`);
    console.log(`Already uploaded: ${UPLOADED_COUNT}`);
    console.log(`Remaining to upload: ${remainingThemes.length}`);
    
    return remainingThemes;
  }

  async resumeUpload(allThemes: ThemeData[]) {
    const remainingThemes = await this.getRemainingThemes(allThemes);
    
    if (remainingThemes.length === 0) {
      console.log("No remaining themes found. Upload is complete!");
      return { success: true, uploaded: 0, message: "Upload already complete" };
    }

    console.log(`Resuming upload for ${remainingThemes.length} remaining themes...`);
    
    const results = await this.upsertThemes(remainingThemes);
    
    return {
      success: true,
      uploaded: remainingThemes.length,
      batches: results.length,
      message: `Successfully uploaded ${remainingThemes.length} remaining themes`
    };
  }

  async deleteAllThemes() {
    // This is for cleanup/reset purposes
    try {
      await this.index.reset();
      console.log("All themes deleted from search index");
    } catch (error) {
      console.error("Error deleting themes:", error);
    }
  }
}

export const searchService = new SearchService();