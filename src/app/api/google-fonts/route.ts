import { NextRequest, NextResponse } from "next/server";
import { FontInfo, GoogleFont, GoogleFontsAPIResponse } from "@/types/fonts";
import { FALLBACK_FONTS } from "@/utils/fonts";

const GOOGLE_FONTS_API_URL = "https://www.googleapis.com/webfonts/v1/webfonts";

// Cache for Google Fonts data
let cachedFonts: FontInfo[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

async function fetchGoogleFonts(): Promise<FontInfo[]> {
  // Check if we have valid cached data
  const now = Date.now();
  if (cachedFonts && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedFonts;
  }

  try {
    const apiKey = process.env.GOOGLE_FONTS_API_KEY;
    if (!apiKey) {
      throw new Error("Google Fonts API key is required");
    }

    const response = await fetch(`${GOOGLE_FONTS_API_URL}?key=${apiKey}&sort=popularity`);
    
    if (!response.ok) {
      throw new Error(`Google Fonts API error: ${response.status}`);
    }

    const data: GoogleFontsAPIResponse = await response.json();

    // Transform to our format
    const fonts: FontInfo[] = data.items.map((font: GoogleFont) => ({
      family: font.family,
      category: font.category,
      variants: font.variants,
      variable: font.variants.some(
        (variant: string) => variant.includes("wght") || variant.includes("ital,wght")
      ),
    }));

    // Update cache
    cachedFonts = fonts;
    cacheTimestamp = now;

    console.log(`✅ Fetched ${fonts.length} fonts from Google Fonts API`);
    return fonts;
  } catch (error) {
    console.error("Failed to fetch Google Fonts:", error);
    // Return empty array on error but don't cache it
    return [];
  }
}

function filterFonts(fonts: FontInfo[], query: string, category?: string): FontInfo[] {
  let filtered = fonts;

  // Filter by category
  if (category && category !== "all") {
    filtered = filtered.filter(font => font.category === category);
  }

  // Filter by search query
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(font =>
      font.family.toLowerCase().includes(lowerQuery)
    );
  }

  return filtered;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "all";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch all fonts (from cache or API)
    const allFonts = await fetchGoogleFonts();
    
    if (allFonts.length === 0) {
      // Fallback to local fonts if API fails
      console.log("🔄 Using fallback fonts due to API failure");
      const filteredFallbacks = filterFonts(FALLBACK_FONTS, query, category);
      const paginatedFallbacks = filteredFallbacks.slice(offset, offset + limit);
      const hasMore = offset + limit < filteredFallbacks.length;
      
      return NextResponse.json({
        fonts: paginatedFallbacks,
        total: filteredFallbacks.length,
        offset,
        limit,
        hasMore,
      });
    }

    // Filter fonts based on query and category
    const filteredFonts = filterFonts(allFonts, query, category);

    // Paginate
    const paginatedFonts = filteredFonts.slice(offset, offset + limit);
    const hasMore = offset + limit < filteredFonts.length;

    return NextResponse.json({
      fonts: paginatedFonts,
      total: filteredFonts.length,
      offset,
      limit,
      hasMore,
    });
  } catch (error) {
    console.error("Google Fonts API route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fonts" },
      { status: 500 }
    );
  }
}