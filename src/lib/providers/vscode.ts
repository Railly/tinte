import { VSCodePreview } from "@/components/preview/vscode/vscode-preview";
import { VSCodeIcon } from "@/components/shared/icons";
import type { TinteBlock, TinteTheme } from "@/types/tinte";
import { shadcnToTinte } from "../provider-utils";
import type { PreviewableProvider, ProviderOutput } from "./types";

import type { CodeTemplate } from "@/types/code-template";
export type { CodeTemplate };
export { codeTemplates } from "./vscode-code-templates";

export function convertThemeToVSCode(
  activeTheme: any,
  fallbackTheme: { light: VSCodeTheme; dark: VSCodeTheme },
  overrides?: Partial<Record<SemanticToken, string>>,
) {
  if (!activeTheme?.rawTheme) return fallbackTheme;

  try {
    const themeData = activeTheme;

    if (themeData.author === "tweakcn" && themeData.rawTheme) {
      const shadcnTheme = {
        light: themeData.rawTheme.light || themeData.rawTheme,
        dark: themeData.rawTheme.dark || themeData.rawTheme,
      };
      const tinteTheme = shadcnToTinte(shadcnTheme);
      const vscodeTheme = convertTinteToVSCode(
        tinteTheme,
        "Tinte Theme",
        overrides,
      ) as {
        dark: VSCodeTheme;
        light: VSCodeTheme;
      };
      return vscodeTheme || fallbackTheme;
    } else {
      const tinteTheme = themeData.rawTheme;
      const vscodeTheme = convertTinteToVSCode(
        tinteTheme,
        "Tinte Theme",
        overrides,
      ) as {
        dark: VSCodeTheme;
        light: VSCodeTheme;
      };
      return vscodeTheme || fallbackTheme;
    }
  } catch (error) {
    console.warn("Failed to convert theme:", error);
    return fallbackTheme;
  }
}

export interface VSCodeTheme {
  name: string;
  displayName: string;
  type: "light" | "dark";
  colors: Record<string, string>;
  tokenColors: VSCodeTokenColor[];
}

export interface VSCodeTokenColor {
  name: string;
  scope: string | string[];
  settings: {
    foreground: string;
    fontStyle?: string;
  };
}

export type SemanticToken =
  | "plain"
  | "classes"
  | "interfaces"
  | "structs"
  | "enums"
  | "keys"
  | "methods"
  | "functions"
  | "variables"
  | "variablesOther"
  | "globalVariables"
  | "localVariables"
  | "parameters"
  | "properties"
  | "strings"
  | "stringEscapeSequences"
  | "keywords"
  | "keywordsControl"
  | "storageModifiers"
  | "comments"
  | "docComments"
  | "numbers"
  | "booleans"
  | "operators"
  | "macros"
  | "preprocessor"
  | "urls"
  | "tags"
  | "jsxTags"
  | "attributes"
  | "types"
  | "constants"
  | "labels"
  | "namespaces"
  | "modules"
  | "typeParameters"
  | "exceptions"
  | "decorators"
  | "calls"
  | "punctuation";

export type TokenColorMap = Record<SemanticToken, keyof TinteBlock>;

const defaultTokenColorMap: TokenColorMap = {
  plain: "tx",
  punctuation: "tx_2",
  classes: "pr",
  interfaces: "pr",
  structs: "pr",
  enums: "pr",
  types: "sc",
  typeParameters: "pr",
  functions: "pr",
  methods: "sc",
  calls: "tx",
  variables: "tx",
  variablesOther: "tx",
  globalVariables: "ac_2",
  localVariables: "tx",
  parameters: "tx",
  properties: "tx",
  keys: "tx",
  keywords: "sc",
  keywordsControl: "sc",
  storageModifiers: "sc",
  operators: "sc",
  strings: "ac_2",
  stringEscapeSequences: "tx",
  numbers: "ac_3",
  booleans: "ac_3",
  constants: "tx",
  comments: "tx_3",
  docComments: "tx_3",
  tags: "sc",
  jsxTags: "sc",
  attributes: "pr",
  urls: "sc",
  namespaces: "pr",
  modules: "sc",
  macros: "sc",
  preprocessor: "ac_2",
  exceptions: "sc",
  decorators: "pr",
  labels: "ac_2",
};

export const tokenToScopeMapping: Record<SemanticToken, string | string[]> = {
  classes: ["entity.name.type.class"],
  interfaces: ["entity.name.type.interface", "entity.name.type"],
  structs: ["entity.name.type.struct"],
  enums: ["entity.name.type.enum"],
  keys: ["meta.object-literal.key"],
  methods: ["entity.name.function.method", "meta.function.method"],
  functions: [
    "entity.name.function",
    "support.function",
    "meta.function-call.generic",
  ],
  variables: [
    "variable",
    "meta.variable",
    "variable.other.object.property",
    "variable.other.readwrite.alias",
  ],
  variablesOther: ["variable.other.object"],
  globalVariables: ["variable.other.global", "variable.language.this"],
  localVariables: ["variable.other.local"],
  parameters: ["variable.parameter", "meta.parameter"],
  properties: ["variable.other.property", "meta.property"],
  strings: ["string", "string.other.link", "markup.inline.raw.string.markdown"],
  stringEscapeSequences: [
    "constant.character.escape",
    "constant.other.placeholder",
  ],
  keywords: ["keyword"],
  keywordsControl: [
    "keyword.control.import",
    "keyword.control.from",
    "keyword.import",
  ],
  storageModifiers: ["storage.modifier", "keyword.modifier", "storage.type"],
  comments: ["comment", "punctuation.definition.comment"],
  docComments: ["comment.documentation", "comment.line.documentation"],
  numbers: ["constant.numeric"],
  booleans: ["constant.language.boolean", "constant.language.json"],
  operators: ["keyword.operator"],
  macros: ["entity.name.function.preprocessor", "meta.preprocessor"],
  preprocessor: ["meta.preprocessor"],
  urls: ["markup.underline.link"],
  tags: ["entity.name.tag"],
  jsxTags: ["support.class.component"],
  attributes: ["entity.other.attribute-name", "meta.attribute"],
  types: ["support.type"],
  constants: ["variable.other.constant", "variable.readonly"],
  labels: ["entity.name.label", "punctuation.definition.label"],
  namespaces: [
    "entity.name.namespace",
    "storage.modifier.namespace",
    "markup.bold.markdown",
  ],
  modules: ["entity.name.module", "storage.modifier.module"],
  typeParameters: ["variable.type.parameter", "variable.parameter.type"],
  exceptions: ["keyword.control.exception", "keyword.control.trycatch"],
  decorators: [
    "meta.decorator",
    "punctuation.decorator",
    "entity.name.function.decorator",
  ],
  calls: ["variable.function"],
  punctuation: [
    "punctuation",
    "punctuation.terminator",
    "punctuation.definition.tag",
    "punctuation.separator",
    "punctuation.definition.string",
    "punctuation.section.block",
  ],
  plain: ["source", "support.type.property-name.css"],
};

export const editorColorMap = {
  "editor.background": "bg",
  "editor.foreground": "tx",
  "editor.hoverHighlightBackground": "ui_2",
  "editor.lineHighlightBackground": "bg_2",
  "editor.selectionBackground": "ui_3",
  "editor.selectionHighlightBackground": "tx_3",
  "editor.wordHighlightBackground": "ui_2",
  "editor.wordHighlightStrongBackground": "ui",
  "editor.findMatchBackground": "pr",
  "editor.findMatchHighlightBackground": "pr",
  "editor.findRangeHighlightBackground": "bg_2",
  "editor.inactiveSelectionBackground": "ui_3",
  "editor.lineHighlightBorder": "ui",
  "editor.rangeHighlightBackground": "bg_2",
  "editorWhitespace.foreground": "ui",
  "editorIndentGuide.background1": "ui_2",
  "editorHoverWidget.background": "ui",
  "editorLineNumber.activeForeground": "tx",
  "editorLineNumber.foreground": "ui_3",
  "editorGutter.background": "bg",
  "editorGutter.modifiedBackground": "ac_2",
  "editorGutter.addedBackground": "ac_2",
  "editorGutter.deletedBackground": "sc",
  "editorBracketMatch.background": "ui",
  "editorBracketMatch.border": "ui_2",
  "editorGroupHeader.tabsBackground": "bg",
  "editorGroup.border": "ui_2",
  "tab.activeBackground": "bg",
  "tab.inactiveBackground": "bg_2",
  "tab.inactiveForeground": "tx_2",
  "tab.activeForeground": "tx",
  "tab.hoverBackground": "ui_2",
  "tab.unfocusedHoverBackground": "ui_2",
  "tab.border": "ui_2",
  "tab.activeModifiedBorder": "pr",
  "tab.inactiveModifiedBorder": "sc",
  "editorWidget.background": "bg_2",
  "editorWidget.border": "ui_2",
  "editorSuggestWidget.background": "bg",
  "editorSuggestWidget.border": "ui_2",
  "editorSuggestWidget.foreground": "tx",
  "editorSuggestWidget.highlightForeground": "tx_2",
  "editorSuggestWidget.selectedBackground": "ui_2",
  "panel.background": "bg",
  "panel.border": "ui_2",
  "panelTitle.activeBorder": "ui_3",
  "panelTitle.activeForeground": "tx",
  "panelTitle.inactiveForeground": "tx_2",
  "statusBar.background": "bg",
  "statusBar.foreground": "tx",
  "statusBar.border": "ui_2",
  "statusBar.debuggingBackground": "sc",
  "statusBar.debuggingForeground": "tx",
  "titleBar.activeBackground": "bg",
  "titleBar.activeForeground": "tx",
  "titleBar.inactiveBackground": "bg_2",
  "titleBar.inactiveForeground": "tx_2",
  "titleBar.border": "ui_2",
  "menu.foreground": "tx",
  "menu.background": "bg",
  "menu.selectionForeground": "tx",
  "menu.selectionBackground": "ui_2",
  "menu.border": "ui_2",
  "terminal.foreground": "tx",
  "terminal.background": "bg",
  "terminalCursor.foreground": "tx",
  "terminalCursor.background": "bg",
  "terminal.ansiRed": "sc",
  "terminal.ansiGreen": "ac_2",
  "terminal.ansiYellow": "pr",
  "terminal.ansiBlue": "sc",
  "terminal.ansiMagenta": "ac_2",
  "terminal.ansiCyan": "ac_2",
  "activityBar.background": "bg",
  "activityBar.foreground": "tx",
  "activityBar.inactiveForeground": "tx_2",
  "activityBar.activeBorder": "tx",
  "activityBar.border": "ui_2",
  "sideBar.background": "bg",
  "sideBar.foreground": "tx",
  "sideBar.border": "ui_2",
  "sideBarTitle.foreground": "tx",
  "sideBarSectionHeader.background": "bg_2",
  "sideBarSectionHeader.foreground": "tx",
  "sideBarSectionHeader.border": "ui_2",
  "list.foreground": "tx",
  "list.inactiveSelectionBackground": "ui_2",
  "list.activeSelectionBackground": "ui_3",
  "list.inactiveSelectionForeground": "tx",
  "list.activeSelectionForeground": "tx",
  "list.focusOutline": "pr",
  "list.hoverForeground": "tx",
  "list.hoverBackground": "ui_2",
  "input.background": "bg_2",
  "input.foreground": "tx",
  "input.border": "ui_2",
  "input.placeholderForeground": "tx_2",
  "dropdown.background": "bg_2",
  "dropdown.foreground": "tx",
  "dropdown.border": "ui_2",
  "dropdown.listBackground": "bg",
  "badge.background": "sc",
  "activityBarBadge.background": "sc",
  "button.background": "sc",
  "button.foreground": "bg",
  "badge.foreground": "bg",
  "activityBarBadge.foreground": "bg",
} as const;

const applyCustomizations = (
  color: string,
  token: string,
  mode: "light" | "dark",
) => {
  switch (token) {
    case "editor.findMatchBackground":
      return mode === "light" ? `${color}55` : `${color}66`;
    case "editor.findMatchHighlightBackground":
      return mode === "light" ? `${color}44` : `${color}55`;
    case "editor.findRangeHighlightBackground":
      return mode === "light" ? `${color}cc` : `${color}cc`;
    case "editor.hoverHighlightBackground":
    case "editor.inactiveSelectionBackground":
      return mode === "light" ? `${color}55` : `${color}66`;
    case "editor.rangeHighlightBackground":
      return mode === "light" ? `${color}33` : `${color}44`;
    case "editor.selectionBackground":
      return mode === "light" ? `${color}66` : `${color}77`;
    case "editor.selectionHighlightBackground":
    case "editor.wordHighlightBackground":
      return mode === "light" ? `${color}22` : `${color}11`;
    case "editor.wordHighlightStrongBackground":
      return mode === "light" ? `${color}33` : `${color}22`;
    case "diffEditor.insertedTextBackground":
    case "diffEditor.removedTextBackground":
      return mode === "light" ? `${color}22` : `${color}44`;
    default:
      return color;
  }
};

function getVSCodeColors(palette: TinteBlock, mode: "light" | "dark") {
  const vsCodeColors: Record<string, string> = {};

  for (const [token, colorKey] of Object.entries(editorColorMap)) {
    const color = palette[colorKey as keyof TinteBlock];
    vsCodeColors[token] = applyCustomizations(color, token, mode);
  }

  return vsCodeColors;
}

function generateTokenColors(
  palette: TinteBlock,
  tokenColors: TokenColorMap = defaultTokenColorMap,
  overrides?: Partial<Record<SemanticToken, string>>,
): VSCodeTokenColor[] {
  return Object.entries(tokenColors).map(([token, colorKey]) => ({
    name: token,
    scope: tokenToScopeMapping[token as SemanticToken],
    settings: {
      foreground: overrides?.[token as SemanticToken] || palette[colorKey],
    },
  }));
}

function convertTinteToVSCode(
  tinteTheme: TinteTheme,
  name: string = "Tinte Theme",
  overrides?: Partial<Record<SemanticToken, string>>,
): { light: VSCodeTheme; dark: VSCodeTheme } {
  const lightTheme: VSCodeTheme = {
    name: `${name} Light`,
    displayName: `${name} (Light)`,
    type: "light",
    colors: getVSCodeColors(tinteTheme.light, "light"),
    tokenColors: generateTokenColors(
      tinteTheme.light,
      defaultTokenColorMap,
      overrides,
    ),
  };

  const darkTheme: VSCodeTheme = {
    name: `${name} Dark`,
    displayName: `${name} (Dark)`,
    type: "dark",
    colors: getVSCodeColors(tinteTheme.dark, "dark"),
    tokenColors: generateTokenColors(
      tinteTheme.dark,
      defaultTokenColorMap,
      overrides,
    ),
  };

  return { light: lightTheme, dark: darkTheme };
}

function generateVSCodeThemeFile(themes: {
  light: VSCodeTheme;
  dark: VSCodeTheme;
}): string {
  return JSON.stringify(
    {
      ...themes.dark,
      extends: [
        {
          ...themes.light,
          name: themes.light.name,
          uiTheme: "vs",
        },
        {
          ...themes.dark,
          name: themes.dark.name,
          uiTheme: "vs-dark",
        },
      ],
    },
    null,
    2,
  );
}

export { convertTinteToVSCode };

export const vscodeProvider: PreviewableProvider<{
  light: VSCodeTheme;
  dark: VSCodeTheme;
}> = {
  metadata: {
    id: "vscode",
    name: "VS Code",
    description: "The most popular code editor with extensive theme support",
    category: "editor",
    tags: ["editor", "microsoft", "typescript", "javascript"],
    icon: VSCodeIcon,
    website: "https://code.visualstudio.com/",
    documentation:
      "https://code.visualstudio.com/api/extension-guides/color-theme",
  },

  fileExtension: "json",
  mimeType: "application/json",
  convert: convertTinteToVSCode,

  export: (theme: TinteTheme, filename?: string): ProviderOutput => {
    const converted = convertTinteToVSCode(theme);
    return {
      content: generateVSCodeThemeFile(converted),
      filename: filename || "vscode-theme.json",
      mimeType: "application/json",
    };
  },

  validate: (output: { light: VSCodeTheme; dark: VSCodeTheme }) =>
    !!(
      output.light?.colors &&
      output.dark?.colors &&
      output.light?.tokenColors &&
      output.dark?.tokenColors
    ),

  preview: {
    component: VSCodePreview,
  },
};
