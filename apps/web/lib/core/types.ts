export type Palette = {
  text: string;
  "text-2": string;
  "text-3": string;
  interface: string;
  "interface-2": string;
  "interface-3": string;
  background: string;
  "background-2": string;
  primary: string;
  secondary: string;
  accent: string;
  "accent-2": string;
  "accent-3": string;
};

export type ThemeType = "light" | "dark";

export type DarkLightPalette = {
  dark: Palette;
  light: Palette;
};

export type ThemeConfig = {
  name: string;
  displayName: string;
  category: "featured" | "rayso" | "community" | "user";
  palette: DarkLightPalette;
  tokenColors: TokenColorMap;
};

export interface VSCodeTokenColor {
  name: string;
  scope: string | string[];
  settings: {
    foreground: string;
  };
}

export type TokenColorMap = Record<SemanticToken, keyof Palette>;

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
