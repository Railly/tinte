import { db } from "@/db";
import { theme, type ThemeInsert } from "@/db/schema";
import { generateSlug, generateThemeId } from "./generate-slug";

interface ThemeData {
  title: string;
  concept: string;
  light: {
    bg: string;
    bg_2: string;
    ui: string;
    ui_2: string;
    ui_3: string;
    tx_3: string;
    tx_2: string;
    tx: string;
    pr: string;
    sc: string;
    ac_1: string;
    ac_2: string;
    ac_3: string;
  };
  dark: {
    bg: string;
    bg_2: string;
    ui: string;
    ui_2: string;
    ui_3: string;
    tx_3: string;
    tx_2: string;
    tx: string;
    pr: string;
    sc: string;
    ac_1: string;
    ac_2: string;
    ac_3: string;
  };
  fonts?: {
    sans: string;
    serif: string;
    mono: string;
  };
  radius?: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows?: {
    color: string;
    opacity: string;
    offsetX: string;
    offsetY: string;
    blur: string;
    spread: string;
  };
}

export async function saveThemeToDatabase(
  themeData: ThemeData,
  userId?: string
): Promise<{ theme: any; slug: string }> {
  const themeId = generateThemeId();
  const slug = generateSlug(themeData.title);

  // Create shadcn override object with extended properties
  const shadcnOverride = {
    palettes: {
      light: {
        background: themeData.light.bg,
        foreground: themeData.light.tx,
        card: themeData.light.bg,
        "card-foreground": themeData.light.tx,
        popover: themeData.light.bg_2,
        "popover-foreground": themeData.light.tx,
        primary: themeData.light.pr,
        "primary-foreground": themeData.light.bg,
        secondary: themeData.light.sc,
        "secondary-foreground": themeData.light.bg,
        muted: themeData.light.ui,
        "muted-foreground": themeData.light.tx_2,
        accent: themeData.light.ac_1,
        "accent-foreground": themeData.light.tx,
        destructive: themeData.light.sc,
        "destructive-foreground": themeData.light.bg,
        border: themeData.light.ui,
        input: themeData.light.ui_2,
        ring: themeData.light.pr,
        "chart-1": themeData.light.pr,
        "chart-2": themeData.light.sc,
        "chart-3": themeData.light.ac_1,
        "chart-4": themeData.light.ac_2,
        "chart-5": themeData.light.ac_3,
        sidebar: themeData.light.bg,
        "sidebar-foreground": themeData.light.tx,
        "sidebar-primary": themeData.light.pr,
        "sidebar-primary-foreground": themeData.light.bg,
        "sidebar-accent": themeData.light.bg_2,
        "sidebar-accent-foreground": themeData.light.tx,
        "sidebar-border": themeData.light.ui,
        "sidebar-ring": themeData.light.pr,
      },
      dark: {
        background: themeData.dark.bg,
        foreground: themeData.dark.tx,
        card: themeData.dark.bg,
        "card-foreground": themeData.dark.tx,
        popover: themeData.dark.bg_2,
        "popover-foreground": themeData.dark.tx,
        primary: themeData.dark.pr,
        "primary-foreground": themeData.dark.bg,
        secondary: themeData.dark.sc,
        "secondary-foreground": themeData.dark.bg,
        muted: themeData.dark.ui,
        "muted-foreground": themeData.dark.tx_2,
        accent: themeData.dark.ac_1,
        "accent-foreground": themeData.dark.tx,
        destructive: themeData.dark.sc,
        "destructive-foreground": themeData.dark.bg,
        border: themeData.dark.ui,
        input: themeData.dark.ui_2,
        ring: themeData.dark.pr,
        "chart-1": themeData.dark.pr,
        "chart-2": themeData.dark.sc,
        "chart-3": themeData.dark.ac_1,
        "chart-4": themeData.dark.ac_2,
        "chart-5": themeData.dark.ac_3,
        sidebar: themeData.dark.bg,
        "sidebar-foreground": themeData.dark.tx,
        "sidebar-primary": themeData.dark.pr,
        "sidebar-primary-foreground": themeData.dark.bg,
        "sidebar-accent": themeData.dark.bg_2,
        "sidebar-accent-foreground": themeData.dark.tx,
        "sidebar-border": themeData.dark.ui,
        "sidebar-ring": themeData.dark.pr,
      },
    },
    fonts: themeData.fonts || {
      sans: "Inter, ui-sans-serif, system-ui, sans-serif",
      serif: "Georgia, Cambria, 'Times New Roman', serif",
      mono: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace",
    },
    radius: themeData.radius?.md || "0.5rem",
    shadow: {
      color: themeData.shadows?.color || "#000000",
      opacity: themeData.shadows?.opacity || "0.1",
      blur: themeData.shadows?.blur || "4px",
      spread: themeData.shadows?.spread || "0px",
      offset_x: themeData.shadows?.offsetX || "0px",
      offset_y: themeData.shadows?.offsetY || "2px",
    },
    letter_spacing: "0em",
  };

  const themeInsert: ThemeInsert = {
    id: themeId,
    legacy_id: themeId,
    user_id: userId || null,
    name: themeData.title,
    slug: slug,
    concept: themeData.concept,
    vendor: "tinte",

    // Light mode
    light_bg: themeData.light.bg,
    light_bg_2: themeData.light.bg_2,
    light_ui: themeData.light.ui,
    light_ui_2: themeData.light.ui_2,
    light_ui_3: themeData.light.ui_3,
    light_tx: themeData.light.tx,
    light_tx_2: themeData.light.tx_2,
    light_tx_3: themeData.light.tx_3,
    light_pr: themeData.light.pr,
    light_sc: themeData.light.sc,
    light_ac_1: themeData.light.ac_1,
    light_ac_2: themeData.light.ac_2,
    light_ac_3: themeData.light.ac_3,

    // Dark mode
    dark_bg: themeData.dark.bg,
    dark_bg_2: themeData.dark.bg_2,
    dark_ui: themeData.dark.ui,
    dark_ui_2: themeData.dark.ui_2,
    dark_ui_3: themeData.dark.ui_3,
    dark_tx: themeData.dark.tx,
    dark_tx_2: themeData.dark.tx_2,
    dark_tx_3: themeData.dark.tx_3,
    dark_pr: themeData.dark.pr,
    dark_sc: themeData.dark.sc,
    dark_ac_1: themeData.dark.ac_1,
    dark_ac_2: themeData.dark.ac_2,
    dark_ac_3: themeData.dark.ac_3,

    is_public: true,
    installs: 0,

    // Extended properties
    shadcn_override: shadcnOverride,
  };

  try {
    const [savedTheme] = await db
      .insert(theme)
      .values(themeInsert)
      .returning();

    console.log(`✅ Theme "${themeData.title}" saved to database with slug: ${slug}`);

    return { theme: savedTheme, slug };
  } catch (error) {
    console.error("Error saving theme to database:", error);
    throw new Error("Failed to save theme to database");
  }
}