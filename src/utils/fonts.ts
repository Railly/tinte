import type { FontInfo } from "@/types/fonts";

// Categories mapped to their display names and common fallbacks
export const FONT_CATEGORIES = {
  "sans-serif": {
    label: "Sans Serif",
    fallback: "ui-sans-serif, system-ui, sans-serif",
  },
  serif: {
    label: "Serif",
    fallback: "ui-serif, Georgia, serif",
  },
  monospace: {
    label: "Monospace",
    fallback:
      "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
  display: {
    label: "Display",
    fallback: "ui-serif, Georgia, serif",
  },
  handwriting: {
    label: "Handwriting",
    fallback: "cursive",
  },
} as const;

export const SYSTEM_FONTS = [
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
  "system-ui",
  "sans-serif",
  "serif",
  "monospace",
  "cursive",
  "fantasy",
];

// Default font fallbacks by category
export const SYSTEM_FONTS_FALLBACKS = {
  "sans-serif": "ui-sans-serif, sans-serif, system-ui",
  serif: "ui-serif, serif",
  monospace: "ui-monospace, monospace",
  display: "ui-serif, serif",
  handwriting: "cursive",
};

// Comprehensive fallback font list for FontSelector component
export const FALLBACK_FONTS: FontInfo[] = [
  // Popular Sans Serif
  {
    family: "Inter",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: true,
  },
  {
    family: "Roboto",
    category: "sans-serif",
    variants: ["100", "300", "400", "500", "700", "900"],
    variable: false,
  },
  {
    family: "Open Sans",
    category: "sans-serif",
    variants: ["300", "400", "500", "600", "700", "800"],
    variable: true,
  },
  {
    family: "Poppins",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: false,
  },
  {
    family: "Montserrat",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: true,
  },
  {
    family: "Outfit",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: true,
  },
  {
    family: "Plus Jakarta Sans",
    category: "sans-serif",
    variants: ["200", "300", "400", "500", "600", "700", "800"],
    variable: true,
  },
  {
    family: "DM Sans",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: true,
  },
  {
    family: "Geist",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: true,
  },
  {
    family: "Oxanium",
    category: "sans-serif",
    variants: ["200", "300", "400", "500", "600", "700", "800"],
    variable: true,
  },
  {
    family: "Work Sans",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: true,
  },
  {
    family: "Nunito",
    category: "sans-serif",
    variants: ["200", "300", "400", "500", "600", "700", "800", "900"],
    variable: true,
  },

  // Serif Fonts
  {
    family: "Merriweather",
    category: "serif",
    variants: ["300", "400", "700", "900"],
    variable: false,
  },
  {
    family: "Playfair Display",
    category: "serif",
    variants: ["400", "500", "600", "700", "800", "900"],
    variable: true,
  },
  {
    family: "Lora",
    category: "serif",
    variants: ["400", "500", "600", "700"],
    variable: true,
  },
  {
    family: "Source Serif Pro",
    category: "serif",
    variants: ["200", "300", "400", "600", "700", "900"],
    variable: true,
  },
  {
    family: "Libre Baskerville",
    category: "serif",
    variants: ["400", "700"],
    variable: false,
  },
  {
    family: "Crimson Text",
    category: "serif",
    variants: ["400", "600", "700"],
    variable: false,
  },
  {
    family: "Cormorant",
    category: "serif",
    variants: ["300", "400", "500", "600", "700"],
    variable: true,
  },

  // Monospace Fonts
  {
    family: "JetBrains Mono",
    category: "monospace",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800"],
    variable: true,
  },
  {
    family: "Fira Code",
    category: "monospace",
    variants: ["300", "400", "500", "600", "700"],
    variable: true,
  },
  {
    family: "Source Code Pro",
    category: "monospace",
    variants: ["200", "300", "400", "500", "600", "700", "800", "900"],
    variable: true,
  },
  {
    family: "IBM Plex Mono",
    category: "monospace",
    variants: ["100", "200", "300", "400", "500", "600", "700"],
    variable: false,
  },
  {
    family: "Roboto Mono",
    category: "monospace",
    variants: ["100", "200", "300", "400", "500", "600", "700"],
    variable: true,
  },
  {
    family: "Space Mono",
    category: "monospace",
    variants: ["400", "700"],
    variable: false,
  },
  {
    family: "Geist Mono",
    category: "monospace",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: true,
  },

  // Display Fonts
  {
    family: "Space Grotesk",
    category: "display",
    variants: ["300", "400", "500", "600", "700"],
    variable: true,
  },
  {
    family: "Clash Display",
    category: "display",
    variants: ["200", "300", "400", "500", "600", "700"],
    variable: true,
  },
  {
    family: "Cabinet Grotesk",
    category: "display",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: true,
  },

  // Handwriting
  {
    family: "Architects Daughter",
    category: "handwriting",
    variants: ["400"],
    variable: false,
  },
  {
    family: "Caveat",
    category: "handwriting",
    variants: ["400", "500", "600", "700"],
    variable: true,
  },
  {
    family: "Dancing Script",
    category: "handwriting",
    variants: ["400", "500", "600", "700"],
    variable: true,
  },
];

// Legacy font mapping for backward compatibility
export const fonts: Record<string, string> = Object.fromEntries(
  FALLBACK_FONTS.map((font) => [
    font.family,
    buildFontFamily(font.family, font.category),
  ]),
);

// Extract font arrays by category
const sansSerifFontNames = FALLBACK_FONTS.filter(
  (font) => font.category === "sans-serif",
).map((font) => font.family);

const serifFontNames = FALLBACK_FONTS.filter(
  (font) => font.category === "serif",
).map((font) => font.family);

const monoFontNames = FALLBACK_FONTS.filter(
  (font) => font.category === "monospace",
).map((font) => font.family);

export const sansSerifFonts = Object.fromEntries(
  Object.entries(fonts).filter(([key]) => sansSerifFontNames.includes(key)),
);
export const serifFonts = Object.fromEntries(
  Object.entries(fonts).filter(([key]) => serifFontNames.includes(key)),
);
export const monoFonts = Object.fromEntries(
  Object.entries(fonts).filter(([key]) => monoFontNames.includes(key)),
);

// Extract the font family name from a CSS font value
export function extractFontFamily(fontValue: string): string | null {
  if (!fontValue) return null;

  // Handle both old format ("Outfit, sans-serif") and new format ("Outfit", ui-sans-serif, ...)
  const firstFont = fontValue.split(",")[0].trim();
  const cleanFont = firstFont.replace(/['"]/g, "");

  // Skip system fonts
  if (SYSTEM_FONTS.includes(cleanFont.toLowerCase())) return null;
  return cleanFont;
}

// Build Google Fonts CSS API URL
export function buildFontCssUrl(
  family: string,
  weights: string[] = ["400"],
): string {
  const encodedFamily = encodeURIComponent(family);
  const weightsParam = weights.join(";"); // Use semicolon for Google Fonts API v2
  return `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weightsParam}&display=swap`;
}

/**
 * Load Google Font dynamically
 * Google Fonts API automatically handles unavailable weights by ignoring them
 * This means requesting weights like 400,500,600,700 will work for all fonts
 * even if some weights don't exist - they're simply not included in the response
 */
export function loadGoogleFont(
  family: string,
  weights: string[] = ["400", "700"],
): void {
  if (typeof document === "undefined") return;

  // Check if already loaded
  const href = buildFontCssUrl(family, weights);
  const existing = document.querySelector(`link[href="${href}"]`);
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

// Build font family CSS value with proper fallbacks
export function buildFontFamily(
  family: string,
  category: "sans-serif" | "serif" | "monospace" | "display" | "handwriting",
): string {
  const fallbacks: Record<string, string> = {
    "sans-serif": "sans-serif",
    serif: "serif",
    monospace: "monospace",
    display: "sans-serif",
    handwriting: "sans-serif",
  };

  return `${family}, ${fallbacks[category] || fallbacks["sans-serif"]}`;
}

// Extract default weights for font loading
export function getDefaultWeights(variants: string[]): string[] {
  const weights = variants
    .filter((v) => /^\d+$/.test(v)) // Only numeric weights
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  if (weights.length === 0) return ["400"];

  // Always include 400 if available, plus 700 if available
  const result = [];
  if (weights.includes("400")) result.push("400");
  else result.push(weights[0]); // Fallback to first available

  if (weights.includes("700") && !result.includes("700")) {
    result.push("700");
  }

  return result;
}

// Wait for font to load using FontFaceObserver-like logic
export function waitForFont(
  family: string,
  weight: string = "400",
  timeout: number = 3000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      resolve();
      return;
    }

    const testString = "abcdefghijklmnopqrstuvwxyz0123456789";
    const fallbackFont = "monospace";
    const testFont = `${weight} 16px "${family}", ${fallbackFont}`;

    // Create test elements
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.visibility = "hidden";

    const fallbackSpan = document.createElement("span");
    fallbackSpan.style.font = `${weight} 16px ${fallbackFont}`;
    fallbackSpan.textContent = testString;

    const testSpan = document.createElement("span");
    testSpan.style.font = testFont;
    testSpan.textContent = testString;

    container.appendChild(fallbackSpan);
    container.appendChild(testSpan);
    document.body.appendChild(container);

    const fallbackWidth = fallbackSpan.offsetWidth;

    let attempts = 0;
    const maxAttempts = timeout / 50; // Check every 50ms

    const checkFont = () => {
      attempts++;
      const testWidth = testSpan.offsetWidth;

      if (testWidth !== fallbackWidth) {
        // Font has loaded
        document.body.removeChild(container);
        resolve();
      } else if (attempts >= maxAttempts) {
        // Timeout
        document.body.removeChild(container);
        reject(new Error(`Font ${family} failed to load within ${timeout}ms`));
      } else {
        setTimeout(checkFont, 50);
      }
    };

    checkFont();
  });
}
