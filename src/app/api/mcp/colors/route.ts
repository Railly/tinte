import { type NextRequest, NextResponse } from "next/server";
import {
  getRaysoThemes,
  getThemesWithUsers,
  getTinteThemes,
  getTweakCNThemes,
} from "@/lib/user-themes";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50); // Max 50 themes

    // Fetch all themes
    const [userThemes, tweakCNThemes, tinteThemes, raysoThemes] =
      await Promise.all([
        getThemesWithUsers(limit),
        getTweakCNThemes(),
        getTinteThemes(),
        getRaysoThemes(),
      ]);

    const allThemes = [
      ...userThemes,
      ...tweakCNThemes,
      ...tinteThemes,
      ...raysoThemes,
    ];

    // If specific slug requested
    if (slug) {
      const theme = allThemes.find((t) => t.slug === slug);
      if (!theme) {
        return NextResponse.json({ error: "Theme not found" }, { status: 404 });
      }

      return NextResponse.json({
        slug: theme.slug,
        name: theme.name,
        description: theme.description || theme.concept,
        author: theme.author,
        provider: theme.provider,
        colors: {
          light: {
            background: theme.rawTheme?.light?.bg || "#ffffff",
            foreground: theme.rawTheme?.light?.tx || "#000000",
            primary: theme.rawTheme?.light?.pr || "#3b82f6",
            secondary: theme.rawTheme?.light?.sc || "#6b7280",
            accent: theme.rawTheme?.light?.ac_1 || "#f59e0b",
            muted: theme.rawTheme?.light?.ui || "#f3f4f6",
            border: theme.rawTheme?.light?.ui_2 || "#e5e7eb",
          },
          dark: {
            background: theme.rawTheme?.dark?.bg || "#000000",
            foreground: theme.rawTheme?.dark?.tx || "#ffffff",
            primary: theme.rawTheme?.dark?.pr || "#3b82f6",
            secondary: theme.rawTheme?.dark?.sc || "#6b7280",
            accent: theme.rawTheme?.dark?.ac_1 || "#f59e0b",
            muted: theme.rawTheme?.dark?.ui || "#374151",
            border: theme.rawTheme?.dark?.ui_2 || "#4b5563",
          },
        },
      });
    }

    // Return list of available themes with basic info
    const themesList = allThemes
      .filter((theme) => theme.slug) // Only themes with slugs
      .slice(0, limit)
      .map((theme) => ({
        slug: theme.slug,
        name: theme.name,
        description: theme.description || theme.concept,
        author: theme.author,
        provider: theme.provider,
        preview: {
          light: {
            background: theme.rawTheme?.light?.bg,
            foreground: theme.rawTheme?.light?.tx,
            primary: theme.rawTheme?.light?.pr,
          },
          dark: {
            background: theme.rawTheme?.dark?.bg,
            foreground: theme.rawTheme?.dark?.tx,
            primary: theme.rawTheme?.dark?.pr,
          },
        },
      }));

    return NextResponse.json(
      {
        total: themesList.length,
        themes: themesList,
        usage: {
          listAll: "GET /api/mcp/colors",
          getSpecific: "GET /api/mcp/colors?slug=theme-slug",
          parameters: {
            slug: "Theme slug to get specific theme colors",
            limit: "Number of themes to return (default: 10, max: 50)",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
          "Cache-Control": "public, max-age=300", // Cache for 5 minutes
        },
      },
    );
  } catch (error) {
    console.error("Error in MCP colors endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
