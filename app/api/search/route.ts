"use server";

import { NextRequest } from "next/server";
import { searchThemes } from "@/lib/services/search";
import { getCurrentUserId } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const publicOnly = searchParams.get("publicOnly") === "true";

    if (!query || query.trim().length === 0) {
      return Response.json({ results: [] });
    }

    // Get current user ID for permission filtering
    let userId: string | null = null;
    try {
      userId = await getCurrentUserId();
    } catch {
      // User not authenticated - will search public only
    }

    const searchOptions = {
      limit: limit + offset, // Get more results to handle offset
      userId: userId || undefined,
      publicOnly: publicOnly || !userId, // If no user, search public only
    };

    const allResults = await searchThemes(query.trim(), searchOptions);
    
    // Apply offset and limit manually for pagination
    const results = allResults.slice(offset, offset + limit);

    // Transform search results to match Theme interface
    const themes = results.map((result) => ({
      id: result.metadata.themeId,
      name: result.content.name,
      description: result.content.description || null,
      content: result.content.content,
      user_id: result.content.userId,
      public: result.content.public,
      created_at: result.content.createdAt,
      updated_at: result.content.updatedAt,
    }));

    return Response.json({ results: themes });
  } catch (error) {
    console.error("Search API error:", error);
    return Response.json(
      { error: "Failed to search themes" },
      { status: 500 }
    );
  }
}