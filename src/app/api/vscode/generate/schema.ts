import { z } from "zod";

export function getThemeColorDescription(colorKey: string): string {
  switch (colorKey) {
    case "text":
      return "Foreground Text - Primary. Should have high contrast against the background for readability.";
    case "text-2":
      return "Muted text - Secondary. Slightly less prominent than the primary text color.";
    case "text-3":
      return "Faint text - Tertiary. Used for less important text or subtle visual elements.";
    case "interface":
      return "Selected Indentation Guide, Selected Line Border, Matching Brackets, Spaces. Should be distinct from the background colors.";
    case "interface-2":
      return "UI borders, Indentation Guides. Subtle and harmonious with the background.";
    case "interface-3":
      return "Line Numbers, Selection Background. Should provide enough contrast with the text color.";
    case "background":
      return "Primary Background Color. Sets the overall tone of the theme. Should be easy on the eyes.";
    case "background-2":
      return "Secondary Background Color - Selected Line Background. Slightly different from the primary background for visual distinction.";
    case "primary":
      return "Keywords, Operators, Tags, Storage Modifiers. Should be prominent and easily distinguishable.";
    case "secondary":
      return "Methods, Types, Constants. Should complement the primary color and maintain good readability.";
    case "accent":
      return "Functions, Classes, Enums, Interfaces, Attributes. Should add visual interest without being overwhelming.";
    case "accent-2":
      return "Strings, Labels, Global Variables. Should be distinct from other code elements.";
    case "accent-3":
      return "Numbers, Booleans. Should be easily identifiable and consistent throughout the theme.";
    default:
      return "Custom color. Should harmonize with the overall color scheme.";
  }
}

const DESCRIPTION =
  "A 6-digit hex color code, including the '#' at the beginning.";

const getColorSchema = (colorKey: string, extraDescription = "") =>
  z
    .string()
    .describe(
      `${DESCRIPTION + getThemeColorDescription(colorKey)} ${extraDescription}`
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

export const schema = z.object({
  name: z.string().min(3).describe("Shorty theme name"),
  light: getPaletteSchema("light").required().describe("Light theme palette"),
  dark: getPaletteSchema("dark").required().describe("Dark theme palette"),
});
