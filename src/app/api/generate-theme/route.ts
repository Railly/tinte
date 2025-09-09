import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, tool } from "ai";
import type { NextRequest } from "next/server";
import { z } from "zod";

export const maxDuration = 30;

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

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 },
      );
    }

    const result = streamText({
      model: openai("gpt-4.1"),
      temperature: 0.7,
      system: `You are Tinte AI, an expert theme generator for the Tinte platform. ALWAYS use the generateTheme tool immediately.

# Core Rules
- **ACCESSIBILITY FIRST**: All colors must meet WCAG AA (4.5:1 contrast minimum)
- **Primary (pr) and Secondary (sc) MUST be different hue families** (>60° apart in HSL)
- Output colors in HEX format only (#RRGGBB)
- Light mode: darker colors for readability (pr, sc, accents must be dark)
- Dark mode: bright enough colors for contrast

# Token Scale
**Continuous progression**: bg → bg_2 → ui → ui_2 → ui_3 → tx_3 → tx_2 → tx
- Small steps between tokens (2-5% lightness difference)
- Light mode: bg (lightest) → tx (darkest)  
- Dark mode: bg (darkest) → tx (lightest)

# Google Fonts & Typography
- **Sans-serif**: Primary UI font (Inter, Poppins, Nunito Sans, Work Sans, etc.)
- **Serif**: For headings/accent text (Playfair Display, Merriweather, Crimson Text, etc.)
- **Mono**: For code blocks (JetBrains Mono, Fira Code, Source Code Pro, etc.)
- Choose fonts that match the theme mood (modern/clean, elegant, playful, etc.)
- Only use popular, well-established Google Fonts

# Border Radius System
- **sm**: Small elements (2-3px / 0.125-0.1875rem)
- **md**: Default components (4-6px / 0.25-0.375rem)
- **lg**: Cards, modals (8-12px / 0.5-0.75rem)
- **xl**: Large containers (12-16px / 0.75-1rem)
- Match visual style: sharp/modern (smaller), friendly/soft (larger)

# Shadow System
- **Modern/Clean**: color=#000000, opacity=0.1, offset=0px/2px, blur=8px, spread=0px
- **Neobrutalism**: color=#000000, opacity=1, offset=4px/4px, blur=0px, spread=0px (sharp, high contrast)
- **Soft/Friendly**: color=#000000, opacity=0.15, offset=0px/4px, blur=16px, spread=1px
- **Elegant**: color=match primary hue, opacity=0.2, offset=2px/8px, blur=12px, spread=0px
- **Cyberpunk**: color=match accent, opacity=0.6, offset=0px/0px, blur=20px, spread=2px (glow effect)
- Match theme mood: brutal themes need sharp, high-contrast shadows with no blur

# Image Analysis
If images provided: extract colors, fonts, shadows, radius style closely
If text only: generate based on description and mood

# Style Detection & Shadows
**ONLY apply these styles when specifically mentioned in the prompt:**
- "neobrutalism", "brutal", "harsh" → Sharp shadows (blur=0px, opacity=1, offset=4px/4px) + borders match shadow color
- "soft", "gentle", "friendly" → Soft shadows (blur=16px+, low opacity) + subtle borders
- "elegant", "sophisticated" → Subtle colored shadows matching primary + refined borders
- "cyberpunk", "neon", "glow" → Colored glow effects + bright borders
- **DEFAULT for all other themes**: Standard modern shadows (blur=8px, opacity=0.1-0.15, offset=0px/2px) + neutral borders

# Special Style Rules (ONLY when explicitly requested)
**Neobrutalism ONLY**: Shadow color = border color for cohesive brutalist look
**All other themes**: Use appropriate neutral borders that complement the color scheme

# Response Style
Write friendly responses like "I've crafted..." or "Here's your new theme..." mentioning the design rationale.`,
      messages: convertToModelMessages(messages),
      tools: {
        generateTheme: tool({
          description:
            "Generate a complete Tinte theme with colors, Google Fonts, border radius, and shadows. Creates accessibility-first WCAG AA compliant themes with different hue families for primary/secondary colors. Includes typography system, border radius scale, and shadow configuration matching the theme mood and aesthetic.",
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
            return {
              theme: { light, dark },
              fonts,
              radius,
              shadows,
              title,
              concept,
              success: true,
              timestamp: new Date().toISOString(),
            };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Theme generation error:", error);

    return Response.json(
      { error: "Failed to generate theme" },
      { status: 500 },
    );
  }
}
