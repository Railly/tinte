import { NextResponse } from "next/server";
import { searchService } from "@/lib/services/search.service";
import { getAllPublicThemes } from "@/lib/theme-operations";

export async function POST() {
  try {
    console.log("Starting theme upload to Upstash Search...");

    // Get all public themes from the database
    const publicThemes = await getAllPublicThemes();

    console.log(`Found ${publicThemes.length} themes to upload`);

    if (publicThemes.length === 0) {
      return NextResponse.json(
        { message: "No themes found to upload" },
        { status: 200 },
      );
    }

    // Upload to Upstash Search
    const results = await searchService.upsertThemes(publicThemes);

    console.log("Upload completed successfully");

    return NextResponse.json({
      message: `Successfully uploaded ${publicThemes.length} themes`,
      batches: results.length,
      themes: publicThemes.length,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
