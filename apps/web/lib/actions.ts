"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getThemeColorDescription } from "./core/config";

const inputSchema = z.object({
  prompt: z.string().min(3).max(150).describe("User's theme description"),
});

const DESCRIPTION = "A 6-digit hex color code. ";

const getColorSchema = (colorKey: string, extraDescription = "") =>
  z
    .string()
    .describe(
      DESCRIPTION + getThemeColorDescription(colorKey) + " " + extraDescription
    );

const getPaletteSchema = (theme: "light" | "dark") =>
  z.object({
    text: getColorSchema("text", `${theme} theme`),
    "text-2": getColorSchema("text-2", `${theme} theme`),
    "text-3": getColorSchema("text-3", `${theme} theme`),
    "interface-3": getColorSchema("interface-3", `${theme} theme`),
    "interface-2": getColorSchema("interface-2", `${theme} theme`),
    interface: getColorSchema("interface", `${theme} theme`),
    "background-2": getColorSchema("background-2", `${theme} theme`),
    background: getColorSchema("background", `${theme} theme`),
    primary: getColorSchema("primary", `${theme} theme`),
    secondary: getColorSchema("secondary", `${theme} theme`),
    accent: getColorSchema("accent", `${theme} theme`),
    "accent-2": getColorSchema("accent-2", `${theme} theme`),
    "accent-3": getColorSchema("accent-3", `${theme} theme`),
  });

const outputSchema = z.object({
  name: z.string().min(3).describe("Shorty Theme name"),
  light: getPaletteSchema("light").required().describe("Light theme palette"),
  dark: getPaletteSchema("dark").required().describe("Dark theme palette"),
});

export const generateVSCodeThemeAI = async (formData: FormData) => {
  const { prompt } = inputSchema.parse(Object.fromEntries(formData.entries()));
  const result = await generateObject({
    model: openai("gpt-3.5-turbo-0125"),
    system: `You are an expert Visual Studio Code theme generator. Create visually appealing dark/light themes based on the user's prompt:
  - Use a consistent, limited color palette with complementary colors.
  - Ensure high contrast between background and foreground for readability.
  - Use desaturated colors for large areas, saturated for accents.
  - Always use different colors for light/dark, adjusting saturation and lightness.
  - Color shade order:
  dark: bg > bg-2 > ui > ui-2 > ui-3 > tx-3 > tx-2 > tx
  light: bg < bg-2 < ui < ui-2 < ui-3 < tx-3 < tx-2 < tx
  - For light theme:
      - Never use the same brightness as the dark theme.
      - Reduce lightness to 60% and chroma (0.094) for appealing, readable colors.
      - Ensure bg, bg-2, and all shades are harmonious and not too far apart.
      - UI should be precise and carefully selected.
      - Output as hex codes.`,
    schema: outputSchema,
    prompt,
  });
  const formattedResult = {
    [result.object.name]: {
      light: result.object.light,
      dark: result.object.dark,
    },
  };
  return formattedResult;
};
