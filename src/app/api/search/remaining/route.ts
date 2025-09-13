import { NextResponse } from "next/server";
import { searchService } from "@/lib/services/search.service";
import { UserThemeService } from "@/lib/services/user-theme.service";

export async function GET() {
  try {
    console.log("Getting remaining themes list...");
    
    // Get all themes from database
    const allThemes = await UserThemeService.getAllPublicThemes();
    
    // Get remaining themes to upload
    const remainingThemes = await searchService.getRemainingThemes(allThemes);
    
    return NextResponse.json({
      totalThemes: allThemes.length,
      remainingCount: remainingThemes.length,
      remainingThemes: remainingThemes.map(theme => ({
        id: theme.id,
        name: theme.name,
        author: theme.author,
        createdAt: theme.createdAt
      }))
    });
  } catch (error) {
    console.error("Remaining themes API error:", error);
    return NextResponse.json({ 
      error: "Failed to get remaining themes", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}