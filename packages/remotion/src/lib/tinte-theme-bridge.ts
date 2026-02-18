import type { TinteBlock, TinteTheme } from "@tinte/core";
import type { RawTheme } from "@code-hike/lighter";
import type { ThemeColors } from "../types";

const editorColorMap: Record<string, keyof TinteBlock> = {
  "editor.background": "bg",
  "editor.foreground": "tx",
  "editorLineNumber.foreground": "ui_3",
  "editorLineNumber.activeForeground": "tx",
  "editor.selectionBackground": "ui_3",
  "editorGroupHeader.tabsBackground": "bg",
  "titleBar.activeBackground": "bg",
  "titleBar.activeForeground": "tx",
  "titleBar.inactiveBackground": "bg_2",
  "titleBar.inactiveForeground": "tx_2",
  "progressBar.background": "sc",
  "editorCursor.foreground": "tx",
  "editorGutter.background": "bg",
  "tab.activeBackground": "bg",
  "tab.inactiveBackground": "bg_2",
  "tab.inactiveForeground": "tx_2",
  "tab.activeForeground": "tx",
  "button.background": "sc",
};

const tokenToScopeMapping: Record<string, string | string[]> = {
  classes: ["entity.name.type.class"],
  interfaces: ["entity.name.type.interface", "entity.name.type"],
  structs: ["entity.name.type.struct"],
  enums: ["entity.name.type.enum"],
  keys: ["meta.object-literal.key"],
  methods: ["entity.name.function.method", "meta.function.method"],
  functions: ["entity.name.function", "support.function"],
  variables: ["variable", "meta.variable"],
  parameters: ["variable.parameter"],
  properties: ["variable.other.property"],
  strings: ["string", "string.other.link"],
  keywords: ["keyword"],
  keywordsControl: ["keyword.control.import", "keyword.control.from"],
  storageModifiers: ["storage.modifier", "storage.type"],
  comments: ["comment", "punctuation.definition.comment"],
  numbers: ["constant.numeric"],
  booleans: ["constant.language.boolean"],
  operators: ["keyword.operator"],
  tags: ["entity.name.tag"],
  jsxTags: ["support.class.component"],
  attributes: ["entity.other.attribute-name"],
  types: ["support.type"],
  constants: ["variable.other.constant"],
  namespaces: ["entity.name.namespace"],
  decorators: ["meta.decorator", "entity.name.function.decorator"],
  plain: ["source"],
};

const defaultTokenColorMap: Record<string, keyof TinteBlock> = {
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
  variables: "tx",
  parameters: "tx",
  properties: "tx",
  keys: "tx",
  keywords: "sc",
  keywordsControl: "sc",
  storageModifiers: "sc",
  operators: "sc",
  strings: "ac_2",
  numbers: "ac_3",
  booleans: "ac_3",
  constants: "tx",
  comments: "tx_3",
  tags: "sc",
  jsxTags: "sc",
  attributes: "pr",
  namespaces: "pr",
  decorators: "pr",
};

function getVSCodeColors(palette: TinteBlock): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [token, colorKey] of Object.entries(editorColorMap)) {
    result[token] = palette[colorKey];
  }
  return result;
}

function generateTokenColors(palette: TinteBlock) {
  return Object.entries(defaultTokenColorMap).map(([token, colorKey]) => ({
    name: token,
    scope: tokenToScopeMapping[token] ?? token,
    settings: {
      foreground: palette[colorKey],
    },
  }));
}

export function tinteToRawTheme(
  theme: TinteTheme,
  mode: "light" | "dark" = "dark",
): RawTheme {
  const palette = theme[mode];
  return {
    name: theme.name ?? "Tinte Theme",
    type: mode,
    colors: getVSCodeColors(palette),
    tokenColors: generateTokenColors(palette),
  };
}

export function extractThemeColors(rawTheme: RawTheme): ThemeColors {
  const c = rawTheme.colors ?? {};
  return {
    background: c["editor.background"] ?? "#1e1e1e",
    foreground: c["editor.foreground"] ?? "#d4d4d4",
    editorBackground: c["editor.background"] ?? "#1e1e1e",
    editorForeground: c["editor.foreground"] ?? "#d4d4d4",
    lineNumberForeground: c["editorLineNumber.foreground"] ?? "#858585",
    selectionBackground: c["editor.selectionBackground"] ?? "#264f78",
    editorGroupHeaderBackground:
      c["editorGroupHeader.tabsBackground"] ?? c["editor.background"] ?? "#1e1e1e",
    titleBarBackground:
      c["titleBar.activeBackground"] ?? c["editor.background"] ?? "#1e1e1e",
    titleBarForeground:
      c["titleBar.activeForeground"] ?? c["editor.foreground"] ?? "#d4d4d4",
    progressBarBackground:
      c["progressBar.background"] ?? c["button.background"] ?? "#007acc",
    cursorColor:
      c["editorCursor.foreground"] ?? c["editor.foreground"] ?? "#aeafad",
  };
}

export function loadTinteThemeFromJson(
  json: Record<string, unknown>,
): TinteTheme {
  return json as unknown as TinteTheme;
}
