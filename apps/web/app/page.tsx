import React from "react";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ThemeSelector } from "@/components/theme-selector";
import { ThemeManager } from "@/components/theme-manager";
import { HeaderLogo } from "@/components/header-logo";
import { PrismaClient, ThemePalettes, TokenColors } from "@prisma/client";
import { ThemeConfig } from "@/lib/core/types";

const prisma = new PrismaClient();

async function getThemes() {
  const themes = await prisma.themes.findMany({
    include: {
      ThemePalettes: true,
      TokenColors: true,
    },
  });

  prisma.$disconnect();

  const formattedThemes = themes.map((theme) => ({
    name: theme.name,
    displayName: theme.display_name,
    category: theme.category,
    palette: {
      dark: formatPalette(theme.ThemePalettes.find((p) => p.mode === "dark")),
      light: formatPalette(theme.ThemePalettes.find((p) => p.mode === "light")),
    },
    tokenColors: formatTokenColors(theme.TokenColors[0]),
  })) as ThemeConfig[];

  const featuredOrder = [
    "one-hunter",
    "flexoki",
    "vercel",
    "tailwind",
    "supabase",
  ];

  const sortedThemes = formattedThemes.sort((a, b) => {
    if (a.category === "featured" && b.category === "featured") {
      return featuredOrder.indexOf(a.name) - featuredOrder.indexOf(b.name);
    }
    if (a.category === "featured") return -1;
    if (b.category === "featured") return 1;
    return a.name.localeCompare(b.name);
  });

  return sortedThemes;
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

export default async function Page() {
  const themes = await getThemes();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex h-14 items-center justify-between p-4 bg-background-2 border-b">
        <HeaderLogo />
        <ThemeSelector />
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost">Log in</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="default">Get started</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>
      <ThemeManager initialThemes={themes} />
    </div>
  );
}
