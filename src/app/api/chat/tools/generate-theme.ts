import { tool } from "ai";
import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { saveThemeToDatabase } from "@/lib/save-theme-to-db";
import { createAnonymousUser } from "@/lib/create-anonymous-user";
import description from './generate-theme.md';

const TinteBlockSchema = z.object({
  bg: z.string().describe("Main background color in hex format"),
  bg_2: z.string().describe("Secondary background color in hex format"),
  ui: z.string().describe("Border color in hex format"),
  ui_2: z.string().describe("Hovered border color in hex format"),
  ui_3: z.string().describe("Active border color in hex format"),
  tx_3: z.string().describe("Faint text/comment color in hex format"),
  tx_2: z.string().describe("Muted text/punctuation color in hex format"),
  tx: z.string().describe("Primary text color in hex format"),
  pr: z
    .string()
    .describe(
      "Primary accent color in hex format - must meet WCAG AA contrast and be different hue family from secondary",
    ),
  sc: z
    .string()
    .describe(
      "Secondary accent color in hex format - must be >60° apart from primary and meet WCAG AA contrast",
    ),
  ac_1: z.string().describe("Accent color 1 in hex format"),
  ac_2: z.string().describe("Accent color 2 in hex format"),
  ac_3: z.string().describe("Accent color 3 in hex format"),
});

export const generateThemeTool = tool({
  description: description,
  inputSchema: z.object({
    title: z
      .string()
      .max(20)
      .describe(
        "Short theme title, maximum 2 words (e.g., 'Ocean Sunset', 'Dark Forest')",
      ),
    concept: z.string().describe("Brief theme description and mood"),
    light: TinteBlockSchema.describe(
      "Light mode palette with perceptual luminance progression from bg (lightest) to tx (darkest)",
    ),
    dark: TinteBlockSchema.describe(
      "Dark mode palette with perceptual luminance progression from bg (darkest) to tx (lightest)",
    ),
    fonts: z
      .object({
        sans: z
          .string()
          .describe(
            "Primary sans-serif font family from Google Fonts (e.g., 'Inter', 'Poppins')",
          ),
        serif: z
          .string()
          .describe(
            "Serif font family from Google Fonts (e.g., 'Playfair Display', 'Merriweather')",
          ),
        mono: z
          .string()
          .describe(
            "Monospace font family from Google Fonts (e.g., 'JetBrains Mono', 'Fira Code')",
          ),
      })
      .describe("Google Fonts selection for theme typography"),
    radius: z
      .object({
        sm: z
          .string()
          .describe("Small border radius (e.g., '0.125rem', '2px')"),
        md: z
          .string()
          .describe("Medium border radius (e.g., '0.375rem', '6px')"),
        lg: z
          .string()
          .describe("Large border radius (e.g., '0.5rem', '8px')"),
        xl: z
          .string()
          .describe(
            "Extra large border radius (e.g., '0.75rem', '12px')",
          ),
      })
      .describe("Border radius scale for rounded corners"),
    shadows: z
      .object({
        color: z
          .string()
          .describe("Shadow color in hex format (e.g., '#000000')"),
        opacity: z
          .string()
          .describe(
            "Shadow opacity as decimal string (e.g., '0.1', '0.25')",
          ),
        offsetX: z
          .string()
          .describe("Shadow horizontal offset (e.g., '0px', '2px')"),
        offsetY: z
          .string()
          .describe("Shadow vertical offset (e.g., '2px', '4px')"),
        blur: z
          .string()
          .describe("Shadow blur radius (e.g., '4px', '8px')"),
        spread: z
          .string()
          .describe("Shadow spread radius (e.g., '0px', '1px')"),
      })
      .describe("Shadow system configuration"),
  }),
  execute: async ({
    title,
    concept,
    light,
    dark,
    fonts,
    radius,
    shadows,
  }) => {
    try {
      // Get current session
      const headersList = await headers();
      const session = await auth.api.getSession({
        headers: headersList,
      });

      let userId: string | undefined;

      if (session?.user) {
        // User is authenticated
        userId = session.user.id;
        console.log(`🔐 Authenticated user generating theme: ${session.user.name} (${userId})`);
      } else {
        // Create anonymous user for this theme
        const anonymousUser = await createAnonymousUser();
        userId = anonymousUser.id;
        console.log(`👤 Anonymous user created for theme: ${anonymousUser.id}`);
      }

      // Save theme to database
      const { theme: savedTheme, slug } = await saveThemeToDatabase(
        {
          title,
          concept,
          light,
          dark,
          fonts,
          radius,
          shadows,
        },
        userId
      );

      console.log(`🎨 Theme "${title}" saved with slug: ${slug}`);

      return {
        theme: { light, dark },
        fonts,
        radius,
        shadows,
        title,
        concept,
        slug, // Return the slug for redirect
        databaseId: savedTheme.id,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error in generateTheme tool:", error);

      // Fallback to in-memory theme without database save
      return {
        theme: { light, dark },
        fonts,
        radius,
        shadows,
        title,
        concept,
        success: true,
        error: "Theme generated but not saved to database",
        timestamp: new Date().toISOString(),
      };
    }
  },
});
