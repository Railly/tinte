import { Theme } from "@/lib/atoms";
import {
  DarkLightPalette,
  Palette,
  ThemeConfig,
  TokenColorMap,
} from "@/lib/core/types";
import {
  ShadcnThemes,
  ThemePalettes,
  Themes,
  TokenColors,
  Users,
} from "@prisma/client";
import { hexToRgba, rgbaToHex } from "@uiw/color-convert";

export function formatPalette(palette: ThemePalettes | undefined) {
  if (!palette) return {};
  return {
    id: palette.xata_id,
    text: palette.text,
    "text-2": palette.text_2,
    "text-3": palette.text_3,
    interface: palette.interface,
    "interface-2": palette.interface_2,
    "interface-3": palette.interface_3,
    background: palette.background,
    "background-2": palette.background_2,
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    "accent-2": palette.accent_2,
    "accent-3": palette.accent_3,
  };
}

export function formatTokenColors(tokenColors: TokenColors | undefined) {
  if (!tokenColors) return {};
  return {
    plain: tokenColors.plain,
    classes: tokenColors.classes,
    interfaces: tokenColors.interfaces,
    structs: tokenColors.structs,
    enums: tokenColors.enums,
    keys: tokenColors.keys,
    methods: tokenColors.methods,
    functions: tokenColors.functions,
    variables: tokenColors.variables,
    variablesOther: tokenColors.variables_other,
    globalVariables: tokenColors.global_variables,
    localVariables: tokenColors.local_variables,
    parameters: tokenColors.parameters,
    properties: tokenColors.properties,
    strings: tokenColors.strings,
    stringEscapeSequences: tokenColors.string_escape_sequences,
    keywords: tokenColors.keywords,
    keywordsControl: tokenColors.keywords_control,
    storageModifiers: tokenColors.storage_modifiers,
    comments: tokenColors.comments,
    docComments: tokenColors.doc_comments,
    numbers: tokenColors.numbers,
    booleans: tokenColors.booleans,
    operators: tokenColors.operators,
    macros: tokenColors.macros,
    preprocessor: tokenColors.preprocessor,
    urls: tokenColors.urls,
    tags: tokenColors.tags,
    jsxTags: tokenColors.jsx_tags,
    attributes: tokenColors.attributes,
    types: tokenColors.types,
    constants: tokenColors.constants,
    labels: tokenColors.labels,
    namespaces: tokenColors.namespaces,
    modules: tokenColors.modules,
    typeParameters: tokenColors.type_parameters,
    exceptions: tokenColors.exceptions,
    decorators: tokenColors.decorators,
    calls: tokenColors.calls,
    punctuation: tokenColors.punctuation,
  };
}

export function invertPalette(palette: Palette): Record<string, string> {
  return {
    xata_id: palette.id,
    text: palette.text,
    text_2: palette["text-2"],
    text_3: palette["text-3"],
    interface: palette.interface,
    interface_2: palette["interface-2"],
    interface_3: palette["interface-3"],
    background: palette.background,
    background_2: palette["background-2"],
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    accent_2: palette["accent-2"],
    accent_3: palette["accent-3"],
  };
}

export function invertPaletteWithoutId(
  palette: Palette,
): Record<string, string> {
  return {
    text: palette.text,
    text_2: palette["text-2"],
    text_3: palette["text-3"],
    interface: palette.interface,
    interface_2: palette["interface-2"],
    interface_3: palette["interface-3"],
    background: palette.background,
    background_2: palette["background-2"],
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    accent_2: palette["accent-2"],
    accent_3: palette["accent-3"],
  };
}

export function invertTokenColors(
  tokenColors: TokenColorMap,
): Record<string, keyof Palette> {
  return {
    plain: tokenColors.plain,
    classes: tokenColors.classes,
    interfaces: tokenColors.interfaces,
    structs: tokenColors.structs,
    enums: tokenColors.enums,
    keys: tokenColors.keys,
    methods: tokenColors.methods,
    functions: tokenColors.functions,
    variables: tokenColors.variables,
    variables_other: tokenColors.variablesOther,
    global_variables: tokenColors.globalVariables,
    local_variables: tokenColors.localVariables,
    parameters: tokenColors.parameters,
    properties: tokenColors.properties,
    strings: tokenColors.strings,
    string_escape_sequences: tokenColors.stringEscapeSequences,
    keywords: tokenColors.keywords,
    keywords_control: tokenColors.keywordsControl,
    storage_modifiers: tokenColors.storageModifiers,
    comments: tokenColors.comments,
    doc_comments: tokenColors.docComments,
    numbers: tokenColors.numbers,
    booleans: tokenColors.booleans,
    operators: tokenColors.operators,
    macros: tokenColors.macros,
    preprocessor: tokenColors.preprocessor,
    urls: tokenColors.urls,
    tags: tokenColors.tags,
    jsx_tags: tokenColors.jsxTags,
    attributes: tokenColors.attributes,
    types: tokenColors.types,
    constants: tokenColors.constants,
    labels: tokenColors.labels,
    namespaces: tokenColors.namespaces,
    modules: tokenColors.modules,
    type_parameters: tokenColors.typeParameters,
    exceptions: tokenColors.exceptions,
    decorators: tokenColors.decorators,
    calls: tokenColors.calls,
    punctuation: tokenColors.punctuation,
  };
}

export function formatTheme(
  theme: Themes & {
    ThemePalettes: ThemePalettes[];
    TokenColors: TokenColors[];
    Users: Users | null;
  },
) {
  const darkPalette = theme.ThemePalettes.find((p) => p.mode === "dark");
  const lightPalette = theme.ThemePalettes.find((p) => p.mode === "light");
  const tokenColors = theme.TokenColors[0];

  return {
    id: theme.xata_id,
    name: theme.name,
    displayName: theme.display_name,
    isPublic: theme.is_public,
    category: theme.category,
    createdAt: theme.xata_createdat,
    user: theme.Users,
    palette: {
      dark: formatPalette(darkPalette),
      light: formatPalette(lightPalette),
    },
    tokenColors: formatTokenColors(tokenColors),
  } as ThemeConfig;
}

export function sortThemes(formattedThemes: ThemeConfig[]) {
  const featuredOrder = [
    "one-hunter",
    "flexoki",
    "vercel",
    "tailwind",
    "supabase",
  ];

  const sortedThemes = formattedThemes.sort((a, b) => {
    if (a.category === "user" && b.category === "user") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (a.category === "user") return -1;
    if (b.category === "user") return 1;

    if (a.name && b.name) {
      if (a.category === "featured" && b.category === "featured") {
        return featuredOrder.indexOf(a.name) - featuredOrder.indexOf(b.name);
      }
      if (a.category === "featured") return -1;
      if (b.category === "featured") return 1;

      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return sortedThemes;
}

export const fetchGeneratedTheme = async (
  prompt: string,
): Promise<Record<string, DarkLightPalette>> => {
  const response = await fetch("/api/generate/vscode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate theme");
  }

  const { formattedResult } = await response.json();
  if (Object.keys(formattedResult).length === 0) {
    throw new Error("No theme generated");
  }

  return formattedResult;
};

export const UI_COLORS = [
  "background",
  "background-2",
  "interface",
  "interface-2",
  "interface-3",
  "text",
  "text-2",
  "text-3",
] as const;

export type UIColor = (typeof UI_COLORS)[number];

export const ORDERED_KEYS = [
  "primary",
  "secondary",
  "ui-progression",
  "accent",
  "accent-2",
  "accent-3",
  ...UI_COLORS,
] as const;

export const calculateProgression = (
  startColor: string,
  endColor: string,
  steps: number,
): string[] => {
  const startRgba = hexToRgba(startColor);
  const endRgba = hexToRgba(endColor);

  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    const r = Math.round(startRgba.r + (endRgba.r - startRgba.r) * t);
    const g = Math.round(startRgba.g + (endRgba.g - startRgba.g) * t);
    const b = Math.round(startRgba.b + (endRgba.b - startRgba.b) * t);
    return rgbaToHex({ r, g, b, a: 1 });
  });
};

export const adjustUIProgression = (
  palette: Palette,
  mode: "light" | "dark",
  newBackgroundColor: string,
): Palette => {
  const steps = UI_COLORS.length;
  const updatedPalette = { ...palette };

  const orderedUIColors = [
    "background",
    "background-2",
    "interface",
    "interface-2",
    "interface-3",
    "text-3",
    "text-2",
    "text",
  ];

  const endColor = mode === "dark" ? "#FFFFFF" : "#000000";
  const progression = calculateProgression(newBackgroundColor, endColor, steps);

  if (mode === "dark") {
    orderedUIColors.forEach((key, index) => {
      updatedPalette[key as keyof Palette] = progression[index] as string;
    });
  } else {
    // Light mode
    orderedUIColors.forEach((key, index) => {
      if (key === "background") {
        updatedPalette[key] = newBackgroundColor;
      } else {
        updatedPalette[key as keyof Palette] = progression[index] as string;
      }
    });
  }

  return updatedPalette;
};

export function getThemeCategories(
  allThemes: (ThemeConfig | undefined)[],
  userId?: string,
) {
  const featuredThemes = allThemes.filter(
    (theme) => theme?.category === "featured",
  );
  const raysoThemes = allThemes.filter((theme) => theme?.category === "rayso");
  const communityThemes = allThemes.filter(
    (theme) =>
      theme?.isPublic &&
      theme?.category === "user" &&
      !isThemeOwner(userId, theme),
  );
  const userThemes = allThemes.filter(
    (theme) => theme?.category === "user" && isThemeOwner(userId, theme),
  );

  return {
    featuredThemes,
    raysoThemes,
    communityThemes,
    userThemes,
    allThemes,
  };
}

export const getThemeCategoryLabel = (category: string) => {
  switch (category) {
    case "rayso":
      return "Ray.so";
    case "featured":
      return "Featured";
    case "user":
      return "User";
    case "community":
      return "Community";
    default:
      return "Unknown";
  }
};

export const getThemeName = (displayName: string | undefined) =>
  displayName ? displayName.toLocaleLowerCase().replace(/\s/g, "-") : "";

export function isThemeOwner(
  userId: string | null | undefined,
  themeConfig: ThemeConfig,
): boolean {
  if (!userId || !themeConfig.user) {
    return false;
  }

  return userId === themeConfig.user.clerk_id;
}

export const convertShadcnThemeToTheme = (shadcnTheme: ShadcnThemes): Theme => {
  const lightScheme =
    typeof shadcnTheme.light_scheme === "string"
      ? JSON.parse(shadcnTheme.light_scheme)
      : shadcnTheme.light_scheme;
  const darkScheme =
    typeof shadcnTheme.dark_scheme === "string"
      ? JSON.parse(shadcnTheme.dark_scheme)
      : shadcnTheme.dark_scheme;
  //const fonts =
  //  typeof shadcnTheme.fonts === "string"
  //    ? JSON.parse(shadcnTheme.fonts)
  //    : shadcnTheme.fonts;
  const charts =
    typeof shadcnTheme.charts === "string"
      ? JSON.parse(shadcnTheme.charts)
      : shadcnTheme.charts;

  return {
    id: shadcnTheme.xata_id,
    name: shadcnTheme.name,
    displayName: shadcnTheme.display_name as string,
    light: lightScheme,
    dark: darkScheme,
    user: shadcnTheme.User,
    //fonts: fonts,
    radius: shadcnTheme.radius as string,
    //space: shadcnTheme.space as string,
    //shadow: shadcnTheme.shadow as string,
    charts: charts,
    //icons: shadcnTheme.icons as string,
  };
};
