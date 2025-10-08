import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { getUserFavoriteThemes } from "@/lib/user-themes";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favoriteThemes = await getUserFavoriteThemes(userId);

    return Response.json(favoriteThemes);
  } catch (error) {
    console.error("Error fetching user favorite themes:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
