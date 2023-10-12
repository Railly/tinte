import colors from "./pallete.ts";
import {
  AllColorAbbreviations,
  AllToneAbbreviations,
  ColorEntry,
  ColorMap,
  SemanticToken,
  Shade,
} from "./types.ts";
import { entries } from "./utils.ts";

const colorAbbreviations = {
  red: "re",
  orange: "or",
  yellow: "ye",
  green: "gr",
  cyan: "cy",
  blue: "bl",
  purple: "pu",
  magenta: "ma",
} as const;

const textTones = {
  tx: {
    light: colors.base.black,
    dark: colors.base[200],
  },
  "tx-2": {
    light: colors.base[600],
    dark: colors.base[500],
  },
  "tx-3": {
    light: colors.base[300],
    dark: colors.base[700],
  },
};

const interfaceTones = {
  ui: {
    light: colors.base[100],
    dark: colors.base[900],
  },
  "ui-2": {
    light: colors.base[150],
    dark: colors.base[850],
  },
  "ui-3": {
    light: colors.base[200],
    dark: colors.base[800],
  },
};

const backgroundTones = {
  bg: {
    light: colors.base.paper,
    dark: colors.base.black,
  },
  "bg-2": {
    light: colors.base[50],
    dark: colors.base[950],
  },
};

const generateColorTones = ({
  lightContrastShade = 500,
  darkContrastShade = 300,
}: {
  lightContrastShade: Shade;
  darkContrastShade: Shade;
}): ColorMap => {
  const colorMap: ColorMap = {} as ColorMap;

  for (const [colorName, abbreviation] of entries(colorAbbreviations)) {
    colorMap[abbreviation] = {
      light: colors[colorName][lightContrastShade],
      dark: colors[colorName][darkContrastShade],
    };
    colorMap[`${abbreviation}-2`] = {
      light: colors[colorName][darkContrastShade],
      dark: colors[colorName][lightContrastShade],
    };
  }

  return colorMap;
};

const palette = {
  ...textTones,
  ...interfaceTones,
  ...backgroundTones,
  ...generateColorTones({ lightContrastShade: 500, darkContrastShade: 300 }),
};
console.log(palette);

const mapTokenToPaletteColor: Record<
  SemanticToken,
  AllColorAbbreviations | AllToneAbbreviations
> = {
  plain: "tx",
  classes: "or",
  interfaces: "ye",
  structs: "or",
  enums: "or",
  keys: "or",
  methods: "gr",
  functions: "or",
  variables: "tx",
  globalVariables: "ma",
  localVariables: "ui",
  parameters: "tx",
  properties: "bl",
  strings: "cy",
  stringEscapeSequences: "tx", // For escaped characters in strings
  keywords: "gr",
  keywordsControl: "re", // For control keywords like if, else, for, etc.
  storageModifiers: "bl", // static, const, etc.
  comments: "tx-2",
  docComments: "tx-3", // For specialized comments that generate documentation
  numbers: "pu",
  booleans: "ye",
  operators: "re",
  macros: "bl",
  preprocessor: "ma",
  urls: "bl",
  tags: "bl", // For markup languages
  jsxTags: "ma", // For JSX
  attributes: "ye", // For markup languages
  types: "ye",
  constants: "tx",
  labels: "ma", // For label in GOTO statements, for example
  namespaces: "ye",
  modules: "re",
  typeParameters: "or", // For generics
  exceptions: "ma",
  decorators: "ye", // Used in some languages for annotations or metadata
  calls: "tx", // Function or method calls
  punctuation: "tx-2", // Commas, semicolons, braces, etc.
  codeBlocks: "bg",
};

const mapEditorToPaletteColor: Record<
  string,
  AllColorAbbreviations | AllToneAbbreviations
> = {
  // Editor Colors
  "editor.background": "bg",
  "editor.foreground": "tx",
  "editor.hoverHighlightBackground": "ui-2",
  "editor.lineHighlightBackground": "bg-2",
  "editor.selectionBackground": "ui-3",
  "editor.wordHighlightBackground": "ui-2",
  "editor.wordHighlightStrongBackground": "ui-3",
  "editor.findMatchBackground": "ui",
  "editor.findMatchHighlightBackground": "ui-2",
  "editor.findRangeHighlightBackground": "bg-2",
  "editor.inactiveSelectionBackground": "ui",
  "editor.lineHighlightBorder": "ui",
  "editor.rangeHighlightBackground": "ui-3",

  // Gutter Colors
  "editorGutter.background": "bg",
  "editorGutter.modifiedBackground": "cy",
  "editorGutter.addedBackground": "gr",
  "editorGutter.deletedBackground": "re",

  // Bracket Matching
  "editorBracketMatch.background": "ui",
  "editorBracketMatch.border": "ui-2",

  // Error & Warnings
  "editorError.foreground": "re",
  "editorWarning.foreground": "or",
  "editorInfo.foreground": "bl",

  // Diff Editor
  "diffEditor.insertedTextBackground": "gr-2",
  "diffEditor.removedTextBackground": "re-2",

  // Editor Groups & Tabs
  "editorGroupHeader.tabsBackground": "bg",
  "editorGroup.border": "ui",
  "tab.activeBackground": "bg",
  "tab.inactiveBackground": "bg-2",
  "tab.inactiveForeground": "tx-2",
  "tab.activeForeground": "tx",
  "tab.border": "ui",
  "tab.activeModifiedBorder": "ye",
  "tab.inactiveModifiedBorder": "bl",
  "tab.unfocusedActiveModifiedBorder": "ye-2",
  "tab.unfocusedInactiveModifiedBorder": "bl-2",

  // Editor Widget Colors
  "editorWidget.background": "bg-2",
  "editorWidget.border": "ui-2",
  "editorSuggestWidget.background": "bg",
  "editorSuggestWidget.border": "ui",
  "editorSuggestWidget.foreground": "tx",
  "editorSuggestWidget.highlightForeground": "tx-2",
  "editorSuggestWidget.selectedBackground": "ui-2",

  // Peek View Colors
  "peekView.border": "ui",
  "peekViewEditor.background": "bg",
  "peekViewEditor.matchHighlightBackground": "ui-3",
  "peekViewResult.background": "bg-2",
  "peekViewResult.fileForeground": "tx",
  "peekViewResult.lineForeground": "tx-2",
  "peekViewResult.matchHighlightBackground": "ui-3",
  "peekViewResult.selectionBackground": "ui",
  "peekViewResult.selectionForeground": "tx-3",
  "peekViewTitle.background": "ui-2",
  "peekViewTitleDescription.foreground": "tx-2",
  "peekViewTitleLabel.foreground": "tx",

  // Merge Conflicts
  "merge.currentHeaderBackground": "gr",
  "merge.currentContentBackground": "gr-2",
  "merge.incomingHeaderBackground": "cy",
  "merge.incomingContentBackground": "cy-2",
  "merge.border": "ui",
  "merge.commonContentBackground": "ui-3",
  "merge.commonHeaderBackground": "ui-2",

  // Panel Colors
  "panel.background": "bg",
  "panel.border": "ui",
  "panelTitle.activeBorder": "ui-3",
  "panelTitle.activeForeground": "tx",
  "panelTitle.inactiveForeground": "tx-2",

  // Status Bar Colors
  "statusBar.background": "bg",
  "statusBar.foreground": "tx",
  "statusBar.border": "ui",
  "statusBar.debuggingBackground": "re",
  "statusBar.debuggingForeground": "tx",
  "statusBar.noFolderBackground": "ui-3",
  "statusBar.noFolderForeground": "tx-3",

  // Title Bar
  "titleBar.activeBackground": "bg",
  "titleBar.activeForeground": "tx",
  "titleBar.inactiveBackground": "bg-2",
  "titleBar.inactiveForeground": "tx-2",
  "titleBar.border": "ui",

  // Menus
  "menu.foreground": "tx",
  "menu.background": "bg",
  "menu.selectionForeground": "tx",
  "menu.selectionBackground": "ui-2",
  "menu.border": "ui",

  // Inlay Hints
  "editorInlayHint.foreground": "tx-2",
  "editorInlayHint.background": "ui-2",

  // Terminal
  "terminal.foreground": "tx",
  "terminal.background": "bg",
  "terminalCursor.foreground": "tx",
  "terminalCursor.background": "bg",
  "terminal.ansiRed": "re",
  "terminal.ansiGreen": "gr",
  "terminal.ansiYellow": "ye",
  "terminal.ansiBlue": "bl",
  "terminal.ansiMagenta": "ma",
  "terminal.ansiCyan": "cy",

  // Activity Bar
  "activityBar.background": "bg",
  "activityBar.foreground": "tx",
  "activityBar.inactiveForeground": "tx-2",
  "activityBar.activeBorder": "ui-3",
  "activityBar.border": "ui",

  // Sidebar
  "sideBar.background": "bg",
  "sideBar.foreground": "tx",
  "sideBar.border": "ui",
  "sideBarTitle.foreground": "tx",
  "sideBarSectionHeader.background": "bg-2",
  "sideBarSectionHeader.foreground": "tx",
  "sideBarSectionHeader.border": "ui",

  // SideBar: Highlights & Active items
  "sideBar.activeBackground": "ui-2",
  "sideBar.activeForeground": "tx",

  // Sidebar: Hover
  "sideBar.hoverBackground": "ui",
  "sideBar.hoverForeground": "tx-2",

  // File & Folder Icons
  "sideBar.folderIcon.foreground": "gr",
  "sideBar.fileIcon.foreground": "bl",

  // More detailed SideBar items...
  "list.warningForeground": "or",
  "list.errorForeground": "re",

  // Sidebar: Selections
  "list.inactiveSelectionBackground": "ui-2",
  "list.activeSelectionBackground": "ui",
  "list.inactiveSelectionForeground": "tx",
  "list.activeSelectionForeground": "tx-2",

  // Input Controls
  "input.background": "bg-2",
  "input.foreground": "tx",
  "input.border": "ui",
  "input.placeholderForeground": "tx-2",
  "inputOption.activeBorder": "ui-2",
  "inputOption.activeBackground": "ui",
  "inputOption.activeForeground": "tx",

  // Input Validation
  "inputValidation.infoBackground": "cy",
  "inputValidation.infoBorder": "cy-2",
  "inputValidation.warningBackground": "or",
  "inputValidation.warningBorder": "or-2",
  "inputValidation.errorBackground": "re",
  "inputValidation.errorBorder": "re-2",

  // Dropdowns
  "dropdown.background": "bg-2",
  "dropdown.foreground": "tx",
  "dropdown.border": "ui",
  "dropdown.listBackground": "bg",

  // Badges
  "badge.background": "bl-2",
  "activityBarBadge.background": "bl-2",

  // Buttons
  "button.background": "bl-2",
};

const generateSemanticTokenColors = () => {
  const semanticColors: Record<SemanticToken, ColorEntry> = {} as any;

  for (const [tokenColor, colorKey] of entries(mapTokenToPaletteColor)) {
    semanticColors[tokenColor] = palette[colorKey];
  }

  return semanticColors;
};

const generateEditorThemeColors = () => {
  const themeColors: Record<string, ColorEntry> = {};

  for (const [editorColor, colorKey] of entries(mapEditorToPaletteColor)) {
    themeColors[editorColor] = palette[colorKey];
  }

  return themeColors;
};

const semanticTokenColors = generateSemanticTokenColors();
const editorThemeColors = generateEditorThemeColors();

export { semanticTokenColors, editorThemeColors };
