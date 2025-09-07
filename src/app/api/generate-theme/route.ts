import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, tool } from "ai";
import { type NextRequest } from "next/server";
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
  pr: z.string().describe("Primary accent color in hex format"),
  sc: z.string().describe("Secondary accent color in hex format"),
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
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const result = streamText({
      model: openai("gpt-4.1"),
      system: `# Role
You are tweakcn, an expert shadcn/ui theme generator adapted for Tinte's canonical color system.

# Image & SVG Analysis Instructions (when visual content is provided)
- If one or more images are provided (with or without a text prompt), always analyze the image(s) and extract dominant color tokens, mood, border radius, fonts, and shadows to create a theme based on them 
- If SVG markup is provided, analyze the SVG code to extract colors, styles, and visual elements for theme generation
- **Always match the colors, border radius and shadows of the source image(s) or SVG elements** as closely as possible
- If both visual content and a text prompt are provided, use the prompt as additional guidance
- Translate visual elements into appropriate theme tokens
- If only a text prompt is provided (no visual content), generate the theme based on the prompt

# Typography & Design Elements
- Consider the mood and style of the design when choosing the theme aesthetic (modern/clean, elegant/refined, playful/rounded, etc.)
- Match design styles to the visual content when images or SVGs are provided

# Tinte Token Groups
- **Surfaces**: bg, bg_2 (main and elevated backgrounds)
- **UI Elements**: ui, ui_2, ui_3 (border states: resting, hover, active)
- **Typography**: tx_3, tx_2, tx (text hierarchy: faint, muted, primary)
- **Brand**: pr, sc (primary and secondary brand colors)
- **Accents**: ac_1, ac_2, ac_3 (accent colors for highlighting)

# Rules **IMPORTANT**
- When a base theme is specified in the prompt (denoted as @[base_theme]), use the base theme properties as a starting point and modify only the tokens that are explicitly requested by the user for change.
- Output colors in HEX format only (#RRGGBB), do NOT output rgba()
- Generate harmonious light/dark modes following Flexoki-inspired continuous scale
- Ensure proper contrast for readability (WCAG AA minimum)
- Light mode: bg (lightest) → tx (darkest)
- Dark mode: bg (darkest) → tx (lightest)

# Color Change Logic
- "Make it [color]" → modify brand colors (pr, sc) primarily
- "Background darker/lighter" → modify surface colors (bg, bg_2) only
- Specific token requests → change those tokens + maintain harmony
- "Change [colors] in light/dark mode" → change those colors only in the requested mode, leave the other mode unchanged
- Maintain color harmony across all related tokens

# Text Description
Fill the colorStory field in a friendly, concise way, for example: "I've generated..." or "Here's a refined..." Focus on the design rationale and color relationships.`,
      messages: convertToModelMessages(messages),
      tools: {
        generateTheme: tool({
          description:
            "Generate a complete Tinte theme palette with scientifically crafted light and dark variants. This tool creates harmonious color systems following perceptual uniformity principles and Flexoki design philosophy. Use this after conceptualizing the color story and mood.",
          inputSchema: z.object({
            concept: z
              .string()
              .describe(
                "The theme concept, mood, and design rationale (e.g., 'Ocean sunset with warm-cool temperature dance, golden hour magic transitioning from coral warmth to deep ocean coolness')"
              ),
            colorStory: z
              .string()
              .describe(
                "Detailed explanation of the color choices, relationships, and intended emotional experience"
              ),
            light: TinteBlockSchema.describe(
              "Light mode palette with perceptual luminance progression from bg (lightest) to tx (darkest)"
            ),
            dark: TinteBlockSchema.describe(
              "Dark mode palette with perceptual luminance progression from bg (darkest) to tx (lightest)"
            ),
            accessibility: z
              .object({
                contrastRatio: z
                  .string()
                  .describe("Achieved contrast ratio level (e.g., 'WCAG AAA')"),
                colorBlindSafe: z
                  .boolean()
                  .describe("Whether the theme is color-blind friendly"),
              })
              .describe("Accessibility validation and compliance details"),
          }),
          execute: async ({
            concept,
            colorStory,
            light,
            dark,
            accessibility,
          }) => {
            return {
              theme: { light, dark },
              concept,
              colorStory,
              accessibility,
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
      { status: 500 }
    );
  }
}
