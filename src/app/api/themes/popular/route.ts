import { NextRequest, NextResponse } from "next/server";
import { UserThemeService } from "@/lib/services/user-theme.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    // Get popular community themes with user data
    const themes = await UserThemeService.getThemesWithUsers(limit);
    
    return NextResponse.json({ 
      themes,
      count: themes.length 
    });
  } catch (error) {
    console.error("Popular themes API error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch popular themes",
      themes: [] 
    }, { status: 500 });
  }
}