import { NextResponse } from "next/server";
import { searchService } from "@/lib/search.service";
import { getAllPublicThemes } from "@/lib/theme-operations";

export async function GET() {
  try {
    console.log("Checking upload status...");

    // Get all themes from database
    const allThemes = await getAllPublicThemes();

    // Get uploaded theme count estimate
    const uploadedCount = await searchService.getUploadedThemeCount();

    // Find remaining themes to upload
    const remainingThemes = await searchService.getRemainingThemes(allThemes);

    const status = {
      totalThemes: allThemes.length,
      uploadedThemes: uploadedCount,
      remainingThemes: remainingThemes.length,
      uploadComplete: remainingThemes.length === 0,
      remainingThemeIds: remainingThemes
        .slice(0, 50)
        .map((t) => ({ id: t.id, name: t.name })), // First 50 for preview
      note: "Approximately 10,000 themes were uploaded before hitting the daily limit",
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error("Status API error:", error);
    return NextResponse.json(
      {
        error: "Failed to get status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
