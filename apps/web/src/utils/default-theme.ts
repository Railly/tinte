import type { ThemeData } from "@/lib/theme";
import type { TinteTheme } from "@tinte/core";

export const DEFAULT_THEME_ID = "default-theme";
export const DEFAULT_THEME_NAME = "text0";

export const DEFAULT_THEME_PRESET: TinteTheme = {
  light: {
    tx: "#000000",
    pr: "#000000",
    tx_2: "#666666",
    tx_3: "#999999",
    sc: "#000000",
    ac_2: "#000000",
    ac_3: "#000000",
    ui: "#e5e5e5",
    ac_1: "#DDF2FF",
    bg: "#ffffff",
    ui_2: "#d4d4d4",
    ui_3: "#b5b5b5",
    bg_2: "#f5f5f5",
  },
  dark: {
    tx: "#ffffff",
    pr: "#ffffff",
    tx_2: "#a3a3a3",
    tx_3: "#737373",
    sc: "#ffffff",
    ac_2: "#ffffff",
    ac_3: "#ffffff",
    ui: "#404040",
    ac_1: "#DDF2FF",
    bg: "#000000",
    ui_2: "#525252",
    ui_3: "#666666",
    bg_2: "#262626",
  },
};

// Pre-compute tokens for default theme (computed by algorithm, not stored)
const DEFAULT_COMPUTED_TOKENS = {
  light: {
    background: "#FFFFFF",
    foreground: "#000000",
    primary: "#464646",
    secondary: "#616161",
    accent: "#9C9B9B",
    card: "#FFFFFF",
    "card-foreground": "#000000",
    popover: "#FFFFFF",
    "popover-foreground": "#000000",
    "primary-foreground": "#FFFFFF",
    "secondary-foreground": "#000000",
    "accent-foreground": "#000000",
    muted: "#f2f2f2",
    "muted-foreground": "#333333",
    border: "#e6e6e6",
    input: "#e6e6e6",
    text: "#000000",
    text_2: "#666666",
    text_3: "#999999",
    accent_2: "#000000",
    accent_3: "#000000",
    interface: "#e5e5e5",
    interface_2: "#d4d4d4",
    interface_3: "#b5b5b5",
    background_2: "#f5f5f5",
  },
  dark: {
    background: "#000000",
    foreground: "#ffffff",
    primary: "#464646",
    secondary: "#616161",
    accent: "#9C9B9B",
    card: "#000000",
    "card-foreground": "#ffffff",
    popover: "#000000",
    "popover-foreground": "#ffffff",
    "primary-foreground": "#000000",
    "secondary-foreground": "#ffffff",
    "accent-foreground": "#ffffff",
    muted: "#262626",
    "muted-foreground": "#cccccc",
    border: "#404040",
    input: "#404040",
    text: "#ffffff",
    text_2: "#a3a3a3",
    text_3: "#737373",
    accent_2: "#ffffff",
    accent_3: "#ffffff",
    interface: "#404040",
    interface_2: "#525252",
    interface_3: "#666666",
    background_2: "#262626",
  },
};

export const DEFAULT_THEME: ThemeData & {
  computedTokens: typeof DEFAULT_COMPUTED_TOKENS;
} = {
  id: DEFAULT_THEME_ID,
  name: "text0",
  description: "Default theme based on current design system",
  author: "tinte",
  provider: "tinte",
  downloads: 0,
  likes: 0,
  installs: 0,
  createdAt: "2024-01-20",
  colors: {
    primary: "#464646",
    secondary: "#616161",
    accent: "#9C9B9B",
    background: "#FFF",
    foreground: "#000000",
  },
  tags: ["default", "system"],
  rawTheme: DEFAULT_THEME_PRESET,
  computedTokens: DEFAULT_COMPUTED_TOKENS,
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generateThemeFromChatId(chatId: string): TinteTheme {
  const hash = hashString(chatId);
  const baseHue = hash % 360;

  const primaryHue = baseHue;
  const secondaryHue = (baseHue + 120) % 360;
  const accentHue = (baseHue + 240) % 360;

  const primaryColor = hslToHex(primaryHue, 70, 50);
  const secondaryColor = hslToHex(secondaryHue, 60, 55);
  const accent1 = hslToHex(accentHue, 65, 60);
  const accent2 = hslToHex((primaryHue + 60) % 360, 55, 45);
  const accent3 = hslToHex((primaryHue + 180) % 360, 50, 40);

  return {
    light: {
      tx: "#1D2127",
      pr: primaryColor,
      tx_2: "#666666",
      tx_3: "#999999",
      sc: secondaryColor,
      ac_2: accent2,
      ac_3: accent3,
      ui: "#e5e5e5",
      ac_1: accent1,
      bg: "#ffffff",
      ui_2: "#d4d4d4",
      ui_3: "#b5b5b5",
      bg_2: "#f5f5f5",
    },
    dark: {
      tx: "#EDEDED",
      pr: hslToHex(primaryHue, 60, 70),
      tx_2: "#A3A3A3",
      tx_3: "#737373",
      sc: hslToHex(secondaryHue, 55, 75),
      ac_2: hslToHex((primaryHue + 60) % 360, 50, 65),
      ac_3: hslToHex((primaryHue + 180) % 360, 45, 60),
      ui: "#404040",
      ac_1: hslToHex(accentHue, 60, 75),
      bg: "#000000",
      ui_2: "#525252",
      ui_3: "#666666",
      bg_2: "#262626",
    },
  };
}
