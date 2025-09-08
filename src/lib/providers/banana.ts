import { BananaPreview } from "@/components/preview/banana/banana-preview";
import { BananaIcon } from "@/components/shared/icons/banana";
import type { TinteTheme } from "@/types/tinte";
import { createPolineColorMapping, getThemeName } from "./poline-base";
import type { PreviewableProvider, ProviderOutput } from "./types";

export interface BananaTheme {
  // Brand colors for design generation
  primaryBrand: string; // Main brand color
  secondaryBrand: string; // Secondary brand color
  accentColor: string; // Accent color for CTAs
  
  // Background system
  backgroundColor: string; // Main background
  surfaceColor: string; // Surface/card backgrounds
  borderColor: string; // Border colors
  
  // Text hierarchy
  headingColor: string; // Heading text
  bodyColor: string; // Body text
  mutedColor: string; // Muted text
  
  // Status colors for marketing
  successColor: string; // Success/positive messaging
  warningColor: string; // Warning/attention messaging
  errorColor: string; // Error/negative messaging
  
  // Special marketing colors
  ctaColor: string; // Call-to-action buttons
  linkColor: string; // Link colors
  highlightColor: string; // Highlight/featured content
}

function generateBananaTheme(
  theme: TinteTheme,
  mode: "light" | "dark",
): BananaTheme {
  const block = theme[mode];
  const colorMapping = createPolineColorMapping(block);

  return {
    // Brand colors - use primary and secondary from theme
    primaryBrand: colorMapping.primary,
    secondaryBrand: colorMapping.secondary,
    accentColor: colorMapping.accent,
    
    // Background system
    backgroundColor: colorMapping.bg,
    surfaceColor: colorMapping.bg2,
    borderColor: colorMapping.ui,
    
    // Text hierarchy
    headingColor: colorMapping.tx,
    bodyColor: colorMapping.tx2,
    mutedColor: colorMapping.tx3,
    
    // Status colors for marketing
    successColor: colorMapping.green,
    warningColor: colorMapping.yellow,
    errorColor: colorMapping.red,
    
    // Special marketing colors
    ctaColor: colorMapping.primary, // Use primary for CTAs
    linkColor: colorMapping.blue, // Use blue for links
    highlightColor: colorMapping.accent2, // Use accent2 for highlights
  };
}

export const bananaProvider: PreviewableProvider<{
  light: BananaTheme;
  dark: BananaTheme;
}> = {
  metadata: {
    id: "banana",
    name: "Nano Banana",
    description: "AI-powered creative partner for marketing assets and digital design",
    category: "other",
    tags: ["ai", "design", "marketing", "creative", "assets", "branding"],
    icon: BananaIcon,
    website: "https://tinte.com/banana",
    documentation: "https://tinte.com/docs/banana",
  },

  fileExtension: "json",
  mimeType: "application/json",

  convert: (theme: TinteTheme) => ({
    light: generateBananaTheme(theme, "light"),
    dark: generateBananaTheme(theme, "dark"),
  }),

  export: (theme: TinteTheme, filename?: string): ProviderOutput => {
    const converted = bananaProvider.convert(theme);
    const themeName = filename || getThemeName("banana-brand-theme");

    const brandKit = {
      name: themeName,
      version: "1.0.0",
      description: "Brand colors and design tokens for Nano Banana creative assets",
      modes: {
        light: converted.light,
        dark: converted.dark,
      },
      generated: new Date().toISOString(),
      tool: "Tinte + Nano Banana",
    };

    return {
      content: JSON.stringify(brandKit, null, 2),
      filename: `${themeName}-banana-brand.json`,
      mimeType: "application/json",
    };
  },

  validate: (output: { light: BananaTheme; dark: BananaTheme }) => {
    const validateTheme = (theme: BananaTheme) =>
      !!(
        theme.primaryBrand &&
        theme.secondaryBrand &&
        theme.accentColor &&
        theme.backgroundColor &&
        theme.surfaceColor &&
        theme.borderColor &&
        theme.headingColor &&
        theme.bodyColor &&
        theme.mutedColor &&
        theme.successColor &&
        theme.warningColor &&
        theme.errorColor &&
        theme.ctaColor &&
        theme.linkColor &&
        theme.highlightColor
      );

    return validateTheme(output.light) && validateTheme(output.dark);
  },

  preview: {
    component: BananaPreview,
  },
};