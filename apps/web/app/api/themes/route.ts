import { NextResponse } from "next/server";
import { getInitialThemes } from "@/lib/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const category = searchParams.get("category") || undefined;
  const userId = searchParams.get("userId") || undefined;

  try {
    const themes = await getInitialThemes(page, limit, category, userId);
    return NextResponse.json(themes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch themes" },
      { status: 500 },
    );
  }
}
