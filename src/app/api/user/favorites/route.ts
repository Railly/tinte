import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { UserThemeService } from "@/lib/services/user-theme.service";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favoriteThemes = await UserThemeService.getUserFavoriteThemes(session.user.id);

    return Response.json(favoriteThemes);
  } catch (error) {
    console.error("Error fetching user favorite themes:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}