"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { shadcnThemes } from "@/db/schema";
import { nanoid } from "@/lib/nanoid";
import { eq } from "drizzle-orm";

type ForkState =
  | {
      success: true;
      newThemeId: string;
    }
  | {
      success: false;
      error?: string;
    };

export async function forkTheme(
  currentState: ForkState,
  formData: FormData
): Promise<ForkState> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const themeId = formData.get("themeId");

    const theme = await db.query.shadcnThemes.findFirst({
      where: eq(shadcnThemes.id, themeId as string),
    });

    if (!theme) {
      throw new Error("Theme not found");
    }

    const newThemeId = nanoid();

    await db.insert(shadcnThemes).values({
      id: newThemeId,
      name: `${theme.name} (forked)`,
      userId,
      forkedFromId: theme.id,

      darkThemeColors: theme.darkThemeColors,
      lightThemeColors: theme.lightThemeColors,
      radius: theme.radius,
    });

    return {
      success: true,
      newThemeId,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
