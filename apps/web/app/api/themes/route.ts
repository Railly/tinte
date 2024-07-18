import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Themes, ThemePalettes, TokenColors } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const themes = await prisma.themes.findMany({
      include: {
        ThemePalettes: true,
        TokenColors: true,
      },
    });

    const formattedThemes = themes.map((theme) => formatTheme(theme));

    return NextResponse.json(formattedThemes);
  } catch (error) {
    console.error("Error fetching themes:", error);
    return NextResponse.json(
      { error: "Failed to fetch themes" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

function formatTheme(
  theme: Themes & { ThemePalettes: ThemePalettes[]; TokenColors: TokenColors[] }
) {
  const darkPalette = theme.ThemePalettes.find((p) => p.mode === "dark");
  const lightPalette = theme.ThemePalettes.find((p) => p.mode === "light");
  const tokenColors = theme.TokenColors[0]; // Assuming there's only one TokenColors entry per theme

  return {
    name: theme.name,
    displayName: theme.display_name,
    category: theme.category,
    palette: {
      dark: formatPalette(darkPalette),
      light: formatPalette(lightPalette),
    },
    tokenColors: formatTokenColors(tokenColors),
  };
}

function formatPalette(palette: ThemePalettes | undefined) {
  if (!palette) return {};
  return {
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

function formatTokenColors(tokenColors: TokenColors | undefined) {
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
