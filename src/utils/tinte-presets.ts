import type { ThemeData } from "@/lib/theme-tokens";
import type { TinteTheme } from "@/types/tinte";

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

// Extract themes for theme showcase
export function extractTinteThemeData(isDark = false) {
  const _presets = tintePresets.map((preset, index) => {
    const colorData = isDark ? preset.dark : preset.light;
    return {
      id: `tinte-${index + 1}`,
      name: preset.name,
      colors: {
        primary: colorData.sc,
        secondary: colorData.ac_1,
        accent: colorData.pr,
        background: colorData.bg,
        foreground: colorData.tx,
      },
      createdAt: "2024-01-20",
      rawTheme: {
        light: preset.light,
        dark: preset.dark,
      } as TinteTheme,
    };
  });
  return [DEFAULT_THEME, ..._presets];
}

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

export const tintePresets = [
  {
    name: "Vercel",
    light: {
      tx: "#1D2127",
      pr: "#7D00CC",
      tx_2: "#808080",
      tx_3: "#b3b3b3",
      sc: "#C31562",
      ac_2: "#0F7E32",
      ac_3: "#000000",
      ui: "#e6e6e6",
      ac_1: "#0060F1",
      bg: "#FFFFFF",
      ui_2: "#d9d9d9",
      ui_3: "#cccccc",
      bg_2: "#f2f2f2",
    },
    dark: {
      tx: "#EDEDED",
      pr: "#C372FC",
      tx_2: "#A3A3A3",
      tx_3: "#8F8F8F",
      sc: "#FF4C8D",
      ac_2: "#00CA51",
      ac_3: "#EDEDED",
      ui: "#171717",
      ac_1: "#47A8FF",
      bg: "#000000",
      ui_2: "#212121",
      ui_3: "#2B2B2B",
      bg_2: "#0D0D0D",
    },
  },
  {
    name: "One Hunter",
    light: {
      tx: "#1D2127",
      pr: "#0483c5",
      tx_2: "#808080",
      tx_3: "#b3b3b3",
      sc: "#bb1b3f",
      ac_2: "#178a78",
      ac_3: "#e26d14",
      ui: "#dedede",
      ac_1: "#1D2128",
      bg: "#F7F7F7",
      ui_2: "#d1d1d1",
      ui_3: "#c4c4c4",
      bg_2: "#ebebeb",
    },
    dark: {
      tx: "#E3E1E1",
      pr: "#50C2F7",
      tx_2: "#A3A3A3",
      tx_3: "#8F8F8F",
      sc: "#F06293",
      ac_2: "#66DFC4",
      ac_3: "#F7BC62",
      ui: "#35373A",
      ac_1: "#E3E1E2",
      bg: "#131519",
      ui_2: "#3E4043",
      ui_3: "#47494D",
      bg_2: "#2C2E31",
    },
  },
  {
    name: "Tailwind",
    light: {
      tx: "#1D2127",
      pr: "#0d9488",
      tx_2: "#808080",
      tx_3: "#b3b3b3",
      sc: "#7c3aed",
      ac_2: "#5046e5",
      ac_3: "#d97708",
      ui: "#e6e6e6",
      ac_1: "#0084c7",
      bg: "#FFFFFF",
      ui_2: "#d9d9d9",
      ui_3: "#cccccc",
      bg_2: "#f2f2f2",
    },
    dark: {
      tx: "#F9FAFB",
      pr: "#D1D5DB",
      tx_2: "#98aecd",
      tx_3: "#6486b4",
      sc: "#F471B5",
      ac_2: "#7DD3FC",
      ac_3: "#FDE68A",
      ui: "#293e5b",
      ac_1: "#98F6E4",
      bg: "#121a25",
      ui_2: "#32496c",
      ui_3: "#38537a",
      bg_2: "#21324a",
    },
  },
  {
    name: "Supabase",
    light: {
      tx: "#171717",
      pr: "#019A55",
      tx_2: "#595959",
      tx_3: "#8c8c8c",
      sc: "#A0A0A0",
      ac_2: "#019A55",
      ac_3: "#171717",
      ui: "#e6e6e6",
      ac_1: "#019A55",
      bg: "#FFFFFF",
      ui_2: "#d9d9d9",
      ui_3: "#cccccc",
      bg_2: "#f2f2f2",
    },
    dark: {
      tx: "#FFFFFF",
      pr: "#3ECF8E",
      tx_2: "#A3A3A3",
      tx_3: "#8F8F8F",
      sc: "#A0A0A0",
      ac_2: "#3ECF8E",
      ac_3: "#EDEDED",
      ui: "#262c29",
      ac_1: "#3ECF8E",
      bg: "#171717",
      ui_2: "#343c38",
      ui_3: "#4e5651",
      bg_2: "#212121",
    },
  },
  {
    name: "Flexoki",
    light: {
      tx: "#100F0F",
      pr: "#BC5214",
      tx_2: "#6F6E68",
      tx_3: "#B7B5AC",
      sc: "#66800C",
      ac_2: "#24837B",
      ac_3: "#205EA6",
      ui: "#E6E4D9",
      ac_1: "#A02F6F",
      bg: "#FEFCF0",
      ui_2: "#DAD8CE",
      ui_3: "#CECDC3",
      bg_2: "#F2F0E5",
    },
    dark: {
      tx: "#CECDC3",
      pr: "#DA702C",
      tx_2: "#87857F",
      tx_3: "#575653",
      sc: "#889A39",
      ac_2: "#39A99F",
      ac_3: "#4485BE",
      ui: "#282726",
      ac_1: "#CE5D97",
      bg: "#100F0F",
      ui_2: "#343331",
      ui_3: "#403E3C",
      bg_2: "#1C1B1A",
    },
  },
];
