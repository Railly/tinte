import { NextResponse } from "next/server";
import { searchService } from "@/lib/services/search.service";
import { getAllPublicThemes } from "@/lib/user-themes";

export async function POST() {
  try {
    console.log("Starting resume upload...");

    // Get all themes from database
    const allThemes = await getAllPublicThemes();

    // Resume upload for missing themes
    const result = await searchService.resumeUpload(allThemes);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Resume upload API error:", error);

    // Check if it's the daily limit error
    if (
      error instanceof Error &&
      error.message.includes("Exceeded daily write limit")
    ) {
      return NextResponse.json(
        {
          error: "Daily write limit exceeded",
          message:
            "You've reached Upstash's daily write limit. Please try again in 24 hours.",
          canRetryAfter: "24 hours",
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        error: "Resume upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
