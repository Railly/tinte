"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { ShadcnThemeSchema, ShadcnVariables, shadcnThemes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ZodError, type ZodIssue } from "zod";

export type UpdateState =
  | {
      success: true;
      form: {
        name: string;
      };
    }
  | {
      success: false;
      errors: (ZodIssue | { message: string })[];
    };

export async function updateTheme(
  currentState: UpdateState,
  formData: FormData
): Promise<UpdateState> {
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

    if (theme.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const newTheme = ShadcnThemeSchema.parse({
      name: formData.get("name"),
      radius: formData.get("radius"),
      dark: Object.fromEntries(
        ShadcnVariables.map((variable) => [
          variable,
          formData.get(`dark-${variable}`),
        ])
      ),
      light: Object.fromEntries(
        ShadcnVariables.map((variable) => [
          variable,
          formData.get(`light-${variable}`),
        ])
      ),
    });

    await db
      .update(shadcnThemes)
      .set({
        name: newTheme.name,
        radius: newTheme.radius.toString(),
        darkThemeColors: newTheme.dark,
        lightThemeColors: newTheme.light,
      })
      .where(eq(shadcnThemes.id, themeId as string));
    return {
      success: true,
      form: {
        name: newTheme.name,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      errors: getErrors(error),
    };
  }
}

function getErrors(error: unknown) {
  try {
    if (error instanceof ZodError) {
      return error.errors;
    }

    if (error instanceof Error) {
      return [
        {
          message: error.message,
        },
      ];
    }

    return [
      {
        message: "Unknown error",
      },
    ];
  } catch (error) {
    return [
      {
        message: "Unknown error",
      },
    ];
  }
}
