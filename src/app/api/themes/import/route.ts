import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { saveThemeToDatabase } from "@/lib/save-theme-to-db";
import type { ShadcnTheme } from "@/types/shadcn";
import type { TinteTheme } from "@/types/tinte";

interface ImportThemeRequest {
  name: string;
  concept: string;
  tinteTheme: TinteTheme;
  shadcnTheme: ShadcnTheme;
  makePublic: boolean;
}

export async function POST(request: Request) {
  try {
    const body: ImportThemeRequest = await request.json();
    const { name, concept, tinteTheme, shadcnTheme, makePublic } = body;

    // Get current session
    const { userId } = await auth();

    let clerkUserId: string | undefined;

    if (userId) {
      clerkUserId = `clerk_${userId}`;
      console.log(`🔐 Authenticated user importing theme: ${userId}`);
    }

    // Prepare theme data for database (matching AI generation structure)
    const themeData = {
      title: name,
      concept: concept,
      light: tinteTheme.light,
      dark: tinteTheme.dark,
      fonts: undefined, // Import doesn't include fonts
      radius: undefined, // Import doesn't include radius
      shadows: undefined, // Import doesn't include shadows
    };

    // Save theme to database using the same function as AI generation
    const { theme: savedTheme, slug } = await saveThemeToDatabase(
      themeData,
      clerkUserId,
    );

    console.log(`🎨 Imported theme "${name}" saved with slug: ${slug}`);

    // Build complete theme object for client (matching AI generation response)
    const completeTheme = {
      id: savedTheme.id,
      legacy_id: savedTheme.legacy_id,
      slug: savedTheme.slug,
      name: savedTheme.name,
      concept: savedTheme.concept,
      author: "Anonymous",
      provider: "tinte" as const,
      downloads: 0,
      likes: 0,
      installs: 0,
      tags: ["imported"],
      createdAt: savedTheme.created_at
        ? new Date(savedTheme.created_at).toISOString()
        : new Date().toISOString(),
      colors: {
        primary: tinteTheme.light.pr,
        secondary: tinteTheme.light.sc,
        background: tinteTheme.light.bg,
        accent: tinteTheme.light.ac_1,
        foreground: tinteTheme.light.tx,
      },
      rawTheme: tinteTheme,
      user: null,
      is_public: makePublic,
      overrides: {
        shadcn: shadcnTheme,
      },
    };

    return NextResponse.json({
      success: true,
      savedTheme: completeTheme,
      slug,
      databaseId: savedTheme.id,
    });
  } catch (error) {
    console.error("Error importing theme:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import theme",
      },
      { status: 500 },
    );
  }
}
