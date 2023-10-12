import {
  AllColorAbbreviations,
  AllToneAbbreviations,
  SemanticToken,
} from "../../types.ts";

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
  attributes: "ye", // For markup attributes
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

const mapTokenToScope = (token: SemanticToken): string | string[] => {
  const tokenToScopeMapping: Record<SemanticToken, string | string[]> = {
    classes: ["entity.name.type.class"],
    interfaces: ["entity.name.type.interface"],
    structs: ["entity.name.type.struct"],
    enums: ["entity.name.type.enum"],
    keys: ["meta.object-literal.key", "support.type.property-name"],
    methods: ["entity.name.function.method", "meta.function.method"],
    functions: [
      "entity.name.function",
      "support.function",
      "meta.function-call.generic",
    ],
    variables: ["variable", "meta.variable", "variable.other.object.property"],
    globalVariables: ["variable.other.global", "variable.language.this"],
    localVariables: ["variable.other.local"],
    parameters: ["variable.parameter", "meta.parameter"],
    properties: ["variable.other.property", "meta.property"],
    strings: [
      "string",
      "string.other.link",
      "markup.inline.raw.string.markdown",
    ],
    stringEscapeSequences: [
      "constant.character.escape",
      "constant.other.placeholder",
    ],
    keywords: ["keyword", "variable.other.object"],
    keywordsControl: [
      "keyword.control.import",
      "keyword.control.from",
      "keyword.import",
    ],
    storageModifiers: [
      "storage.modifier",
      "keyword.modifier",
      "storage.type",
      "variable.other.readwrite.alias",
    ],
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
    types: ["entity.name.type", "support.type"],
    constants: ["variable.other.constant", "variable.readonly"],
    labels: [
      "entity.name.label",
      "punctuation.definition.label",
      "entity.name.section.markdown",
    ],
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
      "meta.separator.markdown",
    ],
    codeBlocks: ["punctuation.section.block"],
    plain: ["source"],
  };

  return tokenToScopeMapping[token];
};

export { mapEditorToPaletteColor, mapTokenToPaletteColor, mapTokenToScope };
