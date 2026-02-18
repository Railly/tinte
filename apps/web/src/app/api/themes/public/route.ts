import { type NextRequest, NextResponse } from "next/server";
import {
  getPublicThemes,
  getPublicThemesCount,
  getTweakCNThemes,
  getTinteThemes,
  getRaysoThemes,
} from "@/lib/theme-operations";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const VALID_VENDORS = ["tweakcn", "rayso", "tinte"] as const;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || undefined;
    const vendor = searchParams.get("vendor") || undefined;
    const offset = (page - 1) * limit;

    if (vendor && VALID_VENDORS.includes(vendor as any)) {
      const vendorFetcher = {
        tweakcn: getTweakCNThemes,
        rayso: getRaysoThemes,
        tinte: getTinteThemes,
      }[vendor as (typeof VALID_VENDORS)[number]];

      const vendorThemes = await vendorFetcher();
      return NextResponse.json(
        {
          themes: vendorThemes,
          pagination: {
            page: 1,
            limit: vendorThemes.length,
            total: vendorThemes.length,
            hasMore: false,
          },
        },
        { headers: CORS_HEADERS },
      );
    }

    const publicThemes = await getPublicThemes(
      limit,
      offset,
      undefined,
      search,
    );
    const totalCount = await getPublicThemesCount();

    return NextResponse.json(
      {
        themes: publicThemes,
        pagination: {
          page,
          limit,
          total: totalCount,
          hasMore: offset + publicThemes.length < totalCount,
        },
      },
      { headers: CORS_HEADERS },
    );
  } catch (error) {
    console.error("Error fetching public themes:", error);
    return NextResponse.json(
      { error: "Failed to fetch public themes" },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
