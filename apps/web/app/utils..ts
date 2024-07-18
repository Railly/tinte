import { Palette, TokenColorMap } from "@/lib/core/types";
import { ThemePalettes, Themes, TokenColors } from "@prisma/client";

export function formatPalette(palette: ThemePalettes | undefined) {
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

export function invertTokenColors(
  tokenColors: TokenColorMap
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
  theme: Themes & { ThemePalettes: ThemePalettes[]; TokenColors: TokenColors[] }
) {
  const darkPalette = theme.ThemePalettes.find((p) => p.mode === "dark");
  const lightPalette = theme.ThemePalettes.find((p) => p.mode === "light");
  const tokenColors = theme.TokenColors[0];

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

export function sortThemes(formattedThemes: any) {
  const featuredOrder = [
    "one-hunter",
    "flexoki",
    "vercel",
    "tailwind",
    "supabase",
  ];

  const sortedThemes = formattedThemes.sort((a: any, b: any) => {
    if (a.category === "featured" && b.category === "featured") {
      return featuredOrder.indexOf(a.name) - featuredOrder.indexOf(b.name);
    }
    if (a.category === "featured") return -1;
    if (b.category === "featured") return 1;
    return a.name.localeCompare(b.name);
  });

  return sortedThemes;
}
