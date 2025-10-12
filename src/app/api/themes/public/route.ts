import { type NextRequest, NextResponse } from "next/server";
import { getPublicThemes, getPublicThemesCount } from "@/lib/user-themes";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || undefined;
    const offset = (page - 1) * limit;

    const publicThemes = await getPublicThemes(limit, offset, undefined, search);
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
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching public themes:", error);
    return NextResponse.json(
      { error: "Failed to fetch public themes" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
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
