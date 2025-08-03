import { TinteTheme, TinteBlock } from "@/types/tinte";
import { PreviewableProvider, ProviderOutput } from "./types";
import { VSCodeIcon } from "@/components/shared/icons/vscode";
import { VSCodePreview } from "@/components/preview/vscode/preview";
import { shadcnToTinte } from "../shadcn-to-tinte";

export interface CodeTemplate {
  name: string;
  filename: string;
  language: string;
  code: string;
}

export const codeTemplates: CodeTemplate[] = [
  {
    name: "Python",
    filename: "user_service.py",
    language: "python",
    code: `from typing import Optional, List
import asyncio
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    email: str
    is_active: bool = True

class UserService:
    def __init__(self, database_url: str):
        self.db_url = database_url
        self.users: List[User] = []
    
    async def get_user(self, user_id: int) -> Optional[User]:
        """Fetch a user by ID"""
        for user in self.users:
            if user.id == user_id:
                return user
        return None
    
    def create_user(self, name: str, email: str) -> User:
        user = User(
            id=len(self.users) + 1,
            name=name,
            email=email
        )
        self.users.append(user)
        return user`,
  },
  {
    name: "Go",
    filename: "main.go",
    language: "go",
    code: `package main

import (
\t"encoding/json"
\t"fmt"
\t"log"
\t"net/http"
)

type User struct {
\tID       int    \`json:"id"\`
\tName     string \`json:"name"\`
\tEmail    string \`json:"email"\`
\tIsActive bool   \`json:"is_active"\`
}

type UserService struct {
\tusers map[int]*User
}

func NewUserService() *UserService {
\treturn &UserService{
\t\tusers: make(map[int]*User),
\t}
}

func (s *UserService) CreateUser(name, email string) *User {
\tuser := &User{
\t\tID:       len(s.users) + 1,
\t\tName:     name,
\t\tEmail:    email,
\t\tIsActive: true,
\t}
\ts.users[user.ID] = user
\treturn user
}

func main() {
\tservice := NewUserService()
\tuser := service.CreateUser("John Doe", "john@example.com")
\tfmt.Printf("Created user: %+v\\\\n", user)
}`,
  },
  {
    name: "JavaScript",
    filename: "main.js",
    language: "javascript",
    code: `class User {
  constructor(name, email) {
    this.id = Math.floor(Math.random() * 1000);
    this.name = name;
    this.email = email;
    this.isActive = true;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name, 
      email: this.email,
      isActive: this.isActive
    };
  }
}

class UserService {
  constructor() {
    this.users = new Map();
  }

  createUser(name, email) {
    const user = new User(name, email);
    this.users.set(user.id, user);
    return user;
  }

  getUser(id) {
    return this.users.get(id);
  }

  updateUser(id, updates) {
    const user = this.getUser(id);
    if (!user) return null;
    
    Object.assign(user, updates);
    return user;
  }

  deleteUser(id) {
    return this.users.delete(id);
  }
}

// Example usage
const userService = new UserService();

const user = userService.createUser('John Doe', 'john@example.com');
console.log('Created user:', user.toJSON());

const updated = userService.updateUser(user.id, { name: 'Jane Doe' });
console.log('Updated user:', updated.toJSON());

const deleted = userService.deleteUser(user.id);
console.log('User deleted:', deleted);`,
  },
];

export function convertThemeToVSCode(
  activeTheme: any,
  fallbackTheme: { light: VSCodeTheme; dark: VSCodeTheme }
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
      const vscodeTheme = convertTinteToVSCode(tinteTheme) as {
        dark: VSCodeTheme;
        light: VSCodeTheme;
      };
      return vscodeTheme || fallbackTheme;
    } else {
      const tinteTheme = themeData.rawTheme;
      const vscodeTheme = convertTinteToVSCode(tinteTheme) as {
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
  plain: "text",
  classes: "accent",
  interfaces: "accent",
  structs: "accent",
  enums: "accent",
  keys: "text",
  methods: "secondary",
  functions: "accent",
  variables: "text",
  variablesOther: "secondary",
  globalVariables: "accent_2",
  localVariables: "text",
  parameters: "text",
  properties: "text",
  strings: "accent_2",
  stringEscapeSequences: "text",
  keywords: "primary",
  keywordsControl: "primary",
  storageModifiers: "primary",
  comments: "text_3",
  docComments: "text_3",
  numbers: "accent_3",
  booleans: "accent_3",
  operators: "primary",
  macros: "secondary",
  preprocessor: "accent_2",
  urls: "secondary",
  tags: "primary",
  jsxTags: "secondary",
  attributes: "accent",
  types: "secondary",
  constants: "secondary",
  labels: "accent_2",
  namespaces: "accent",
  modules: "primary",
  typeParameters: "accent",
  exceptions: "primary",
  decorators: "accent",
  calls: "text",
  punctuation: "text_2",
};

const tokenToScopeMapping: Record<SemanticToken, string | string[]> = {
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

const editorColorMap = {
  "editor.background": "background",
  "editor.foreground": "text",
  "editor.hoverHighlightBackground": "interface_2",
  "editor.lineHighlightBackground": "background_2",
  "editor.selectionBackground": "interface_3",
  "editor.selectionHighlightBackground": "text_3",
  "editor.wordHighlightBackground": "interface_2",
  "editor.wordHighlightStrongBackground": "interface",
  "editor.findMatchBackground": "accent",
  "editor.findMatchHighlightBackground": "accent",
  "editor.findRangeHighlightBackground": "background_2",
  "editor.inactiveSelectionBackground": "interface_3",
  "editor.lineHighlightBorder": "interface",
  "editor.rangeHighlightBackground": "background_2",
  "editorWhitespace.foreground": "interface",
  "editorIndentGuide.background1": "interface_2",
  "editorHoverWidget.background": "interface",
  "editorLineNumber.activeForeground": "text",
  "editorLineNumber.foreground": "interface_3",
  "editorGutter.background": "background",
  "editorGutter.modifiedBackground": "accent_2",
  "editorGutter.addedBackground": "accent_2",
  "editorGutter.deletedBackground": "primary",
  "editorBracketMatch.background": "interface",
  "editorBracketMatch.border": "interface_2",
  "editorGroupHeader.tabsBackground": "background",
  "editorGroup.border": "interface_2",
  "tab.activeBackground": "background",
  "tab.inactiveBackground": "background_2",
  "tab.inactiveForeground": "text_2",
  "tab.activeForeground": "text",
  "tab.hoverBackground": "interface_2",
  "tab.unfocusedHoverBackground": "interface_2",
  "tab.border": "interface_2",
  "tab.activeModifiedBorder": "accent",
  "tab.inactiveModifiedBorder": "secondary",
  "editorWidget.background": "background_2",
  "editorWidget.border": "interface_2",
  "editorSuggestWidget.background": "background",
  "editorSuggestWidget.border": "interface_2",
  "editorSuggestWidget.foreground": "text",
  "editorSuggestWidget.highlightForeground": "text_2",
  "editorSuggestWidget.selectedBackground": "interface_2",
  "panel.background": "background",
  "panel.border": "interface_2",
  "panelTitle.activeBorder": "interface_3",
  "panelTitle.activeForeground": "text",
  "panelTitle.inactiveForeground": "text_2",
  "statusBar.background": "background",
  "statusBar.foreground": "text",
  "statusBar.border": "interface_2",
  "statusBar.debuggingBackground": "primary",
  "statusBar.debuggingForeground": "text",
  "titleBar.activeBackground": "background",
  "titleBar.activeForeground": "text",
  "titleBar.inactiveBackground": "background_2",
  "titleBar.inactiveForeground": "text_2",
  "titleBar.border": "interface_2",
  "menu.foreground": "text",
  "menu.background": "background",
  "menu.selectionForeground": "text",
  "menu.selectionBackground": "interface_2",
  "menu.border": "interface_2",
  "terminal.foreground": "text",
  "terminal.background": "background",
  "terminalCursor.foreground": "text",
  "terminalCursor.background": "background",
  "terminal.ansiRed": "primary",
  "terminal.ansiGreen": "accent_2",
  "terminal.ansiYellow": "accent",
  "terminal.ansiBlue": "secondary",
  "terminal.ansiMagenta": "accent_2",
  "terminal.ansiCyan": "accent_2",
  "activityBar.background": "background",
  "activityBar.foreground": "text",
  "activityBar.inactiveForeground": "text_2",
  "activityBar.activeBorder": "text",
  "activityBar.border": "interface_2",
  "sideBar.background": "background",
  "sideBar.foreground": "text",
  "sideBar.border": "interface_2",
  "sideBarTitle.foreground": "text",
  "sideBarSectionHeader.background": "background_2",
  "sideBarSectionHeader.foreground": "text",
  "sideBarSectionHeader.border": "interface_2",
  "list.foreground": "text",
  "list.inactiveSelectionBackground": "interface_2",
  "list.activeSelectionBackground": "interface_3",
  "list.inactiveSelectionForeground": "text",
  "list.activeSelectionForeground": "text",
  "list.focusOutline": "accent",
  "list.hoverForeground": "text",
  "list.hoverBackground": "interface_2",
  "input.background": "background_2",
  "input.foreground": "text",
  "input.border": "interface_2",
  "input.placeholderForeground": "text_2",
  "dropdown.background": "background_2",
  "dropdown.foreground": "text",
  "dropdown.border": "interface_2",
  "dropdown.listBackground": "background",
  "badge.background": "secondary",
  "activityBarBadge.background": "secondary",
  "button.background": "secondary",
  "button.foreground": "background",
  "badge.foreground": "background",
  "activityBarBadge.foreground": "background",
} as const;

const applyCustomizations = (
  color: string,
  token: string,
  mode: "light" | "dark"
) => {
  switch (token) {
    case "editor.findMatchBackground":
      return mode === "light" ? color + "55" : color + "66";
    case "editor.findMatchHighlightBackground":
      return mode === "light" ? color + "44" : color + "55";
    case "editor.findRangeHighlightBackground":
      return mode === "light" ? color + "cc" : color + "cc";
    case "editor.hoverHighlightBackground":
    case "editor.inactiveSelectionBackground":
      return mode === "light" ? color + "55" : color + "66";
    case "editor.rangeHighlightBackground":
      return mode === "light" ? color + "33" : color + "44";
    case "editor.selectionBackground":
      return mode === "light" ? color + "66" : color + "77";
    case "editor.selectionHighlightBackground":
    case "editor.wordHighlightBackground":
      return mode === "light" ? color + "22" : color + "11";
    case "editor.wordHighlightStrongBackground":
      return mode === "light" ? color + "33" : color + "22";
    case "diffEditor.insertedTextBackground":
    case "diffEditor.removedTextBackground":
      return mode === "light" ? color + "22" : color + "44";
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
  tokenColors: TokenColorMap = defaultTokenColorMap
): VSCodeTokenColor[] {
  return Object.entries(tokenColors).map(([token, colorKey]) => ({
    name: token,
    scope: tokenToScopeMapping[token as SemanticToken],
    settings: {
      foreground: palette[colorKey],
    },
  }));
}

function convertTinteToVSCode(
  tinteTheme: TinteTheme,
  name: string = "Tinte Theme"
): { light: VSCodeTheme; dark: VSCodeTheme } {
  const lightTheme: VSCodeTheme = {
    name: `${name} Light`,
    displayName: `${name} (Light)`,
    type: "light",
    colors: getVSCodeColors(tinteTheme.light, "light"),
    tokenColors: generateTokenColors(tinteTheme.light, defaultTokenColorMap),
  };

  const darkTheme: VSCodeTheme = {
    name: `${name} Dark`,
    displayName: `${name} (Dark)`,
    type: "dark",
    colors: getVSCodeColors(tinteTheme.dark, "dark"),
    tokenColors: generateTokenColors(tinteTheme.dark, defaultTokenColorMap),
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
    2
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

  validate: (output: { light: VSCodeTheme; dark: VSCodeTheme }) => {
    return !!(
      output.light &&
      output.dark &&
      output.light.colors &&
      output.dark.colors &&
      output.light.tokenColors &&
      output.dark.tokenColors
    );
  },

  preview: {
    component: VSCodePreview,
    showDock: true,
  },
};
