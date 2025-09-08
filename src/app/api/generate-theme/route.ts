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
      model: openai("gpt-4o"),
      temperature: 0.7,
      system: `# Role
You are tweakcn, an expert shadcn/ui theme generator. ALWAYS use the generateTheme tool immediately - do not write explanatory text first. Generate the theme directly.

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

# Tinte Token Groups & Continuous Scale
**CRITICAL: Follow the exact continuous scale progression**

**Continuous Scale**: bg → bg_2 → ui → ui_2 → ui_3 → tx_3 → tx_2 → tx

- **Surfaces**: bg, bg_2 (main and elevated backgrounds)
- **UI Elements**: ui, ui_2, ui_3 (border states: resting, hover, active) 
- **Typography**: tx_3, tx_2, tx (text hierarchy: faint, muted, primary)
- **Brand**: pr, sc (primary and secondary brand colors)
- **Accents**: ac_1, ac_2, ac_3 (accent colors for highlighting)

**CRITICAL PROGRESSION RULES**:
- Each token MUST be a VERY subtle step from the previous one (maximum 3-5% lightness difference)
- The ENTIRE sequence must form a smooth gradient: bg → bg_2 → ui → ui_2 → ui_3 → tx_3 → tx_2 → tx
- ui should be BARELY perceptible from bg_2 (add 2-3% lightness only)
- ui_2 should be a tiny step from ui (add 2-3% more lightness)  
- ui_3 should be a tiny step from ui_2 (add 2-3% more lightness)
- **CRITICAL**: tx_3 should be VERY close to ui_3 (add only 3-5% more lightness)
- tx_2 should be a small step from tx_3 (add 5-8% more lightness)
- tx should be a step from tx_2 (add 8-12% more lightness)
- NO dramatic jumps anywhere in the sequence
- Example perfect dark progression: #111614 → #171D1A → #1C241F → #212A23 → #263025 → #2E3530 → #4A5249 → #8B9488
- Example perfect light progression: #FFF8EC → #FFF3E0 → #FFE8B6 → #FFDF80 → #FFD269 → #B8941F → #8B6914 → #2D1B05
- Example bad progression: #FFD269 → #C1A26D (TOO BIG JUMP - FORBIDDEN)
- **LIGHT MODE SPECIFIC**: tx_3 should be VERY close to ui_3 in lightness (maximum 5-8% darker)
- **DARK MODE SPECIFIC**: tx_3 should be VERY close to ui_3 in lightness (maximum 3-5% lighter)
- Always maintain smooth OKLCH lightness transitions in BOTH modes
- The ui_3 → tx_3 transition is CRITICAL and must be seamless

# LIGHT MODE CONTRAST FOCUS **CRITICAL**
- **LIGHT MODE IS FAILING** - needs much darker colors for readability
- **pr (primary)**: Must be VERY DARK - deep blues, browns, purples (L* 25-35 in OKLCH)
- **sc (secondary)**: Must be DARK enough - no bright colors (L* 30-45 in OKLCH)  
- **tx (text)**: Must be VERY DARK - almost black (L* 15-25 in OKLCH)
- **tx_2 (muted text)**: Must be DARK - dark grays (L* 25-35 in OKLCH)
- **Accent colors in light mode**: NO pastels, NO light colors - use deep saturated colors
- **Test rule**: All syntax colors must pass WCAG AA (4.5:1) against light bg

# Rules **IMPORTANT**
- When a base theme is specified in the prompt (denoted as @[base_theme]), use the base theme properties as a starting point and modify only the tokens that are explicitly requested by the user for change.
- Output colors in HEX format only (#RRGGBB), do NOT output rgba()
- Generate harmonious light/dark modes following Flexoki-inspired continuous scale
- Ensure proper contrast for readability (WCAG AA minimum)
- Light mode: bg (lightest) → tx (darkest) with GRADUAL progression
- Dark mode: bg (darkest) → tx (lightest) with GRADUAL progression

# CRITICAL CONTRAST REQUIREMENTS
- **Primary (pr) color MUST have high contrast with bg** - used for classes, functions, interfaces in VS Code
- **Light mode pr**: Must be VERY DARK (minimum L* 35 in OKLCH, think deep blue/purple/brown, NOT light yellow)
- **Dark mode pr**: Must be bright enough to read clearly on dark bg (minimum 4.5:1 contrast ratio)
- **Light mode examples of GOOD pr colors**: #1B4D3E, #7C2D12, #3730A3, #1F2937, #831843
- **Light mode examples of BAD pr colors**: #FFD800, #FDE047, #A7F3D0, #FBBF24 (TOO LIGHT!)
- Secondary (sc) and accents also need sufficient contrast in light mode - avoid pastels
- Primary is the MOST IMPORTANT color for syntax highlighting - never sacrifice readability for aesthetics
- **RULE**: If you can't easily read white text ON the pr color in light mode, the pr is too light

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
            // Reduced delay for better UX - just enough to show the fancy loading
            await new Promise(resolve => setTimeout(resolve, 1500));
            
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
