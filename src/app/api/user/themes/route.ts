import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserThemes } from "@/lib/user-themes";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;

    const userThemes = await getUserThemes(session.user.id, limit, session.user);

    return NextResponse.json(userThemes);

  } catch (error) {
    console.error("Error fetching user themes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}