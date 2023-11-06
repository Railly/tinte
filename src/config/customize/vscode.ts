import { Abbreviations, MyTheme, SemanticToken } from "../../types.js";

export const FlexokiVSCodeMappedTokens: Record<SemanticToken, Abbreviations> = {
  plain: "tx",
  classes: "or",
  interfaces: "ye",
  structs: "or",
  enums: "or",
  keys: "or",
  methods: "gr",
  functions: "or",
  variables: "tx",
  variablesOther: "gr",
  globalVariables: "ma",
  localVariables: "ui",
  parameters: "tx",
  properties: "bl",
  strings: "cy",
  stringEscapeSequences: "tx",
  keywords: "gr",
  keywordsControl: "re",
  storageModifiers: "bl",
  comments: "tx-2",
  docComments: "tx-3",
  numbers: "pu",
  booleans: "ye",
  operators: "re",
  macros: "bl",
  preprocessor: "ma",
  urls: "bl",
  tags: "bl",
  jsxTags: "ma",
  attributes: "ye",
  types: "ye",
  constants: "tx",
  labels: "ma",
  namespaces: "ye",
  modules: "re",
  typeParameters: "or",
  exceptions: "ma",
  decorators: "ye",
  calls: "tx",
  punctuation: "tx-2",
  yellow: "ye",
  green: "gr",
  cyan: "cy",
  blue: "bl",
  purple: "pu",
  magenta: "ma",
  red: "re",
  orange: "or",
};

export const OneHunterMaterialMappedTokens: Record<
  SemanticToken,
  Abbreviations
> = {
  plain: "tx",
  classes: "ye",
  interfaces: "ye",
  structs: "ye",
  enums: "ye",
  keys: "ma",
  methods: "cy",
  functions: "cy",
  variables: "tx",
  variablesOther: "tx",
  globalVariables: "cy",
  localVariables: "ui",
  parameters: "tx",
  properties: "tx",
  strings: "gr",
  stringEscapeSequences: "tx",
  keywords: "ma",
  keywordsControl: "re",
  storageModifiers: "ma",
  comments: "tx-2",
  docComments: "tx-2",
  numbers: "ye",
  booleans: "cy",
  operators: "bl",
  macros: "bl",
  preprocessor: "cy",
  urls: "bl",
  tags: "ma",
  jsxTags: "bl",
  attributes: "ye",
  types: "bl",
  constants: "tx",
  labels: "cy",
  namespaces: "ye",
  modules: "re",
  typeParameters: "ye",
  exceptions: "cy",
  decorators: "ye",
  calls: "tx",
  punctuation: "tx",
  yellow: "ye",
  green: "gr",
  cyan: "cy",
  blue: "bl",
  purple: "pu",
  magenta: "ma",
  red: "re",
  orange: "or",
};

export const OneHunterFlexokiMappedTokens: Record<
  SemanticToken,
  Abbreviations
> = {
  plain: "tx",
  classes: "ye",
  interfaces: "ye",
  structs: "ye",
  enums: "ye",
  keys: "ma",
  methods: "bl",
  functions: "bl",
  variables: "tx",
  variablesOther: "tx",
  globalVariables: "cy",
  localVariables: "ui",
  parameters: "tx",
  properties: "tx",
  strings: "cy",
  stringEscapeSequences: "tx",
  keywords: "ma",
  keywordsControl: "ma",
  storageModifiers: "ma",
  comments: "tx-2",
  docComments: "tx-2",
  numbers: "ye",
  booleans: "cy",
  operators: "bl",
  macros: "bl",
  preprocessor: "cy",
  urls: "bl",
  tags: "ma",
  jsxTags: "bl",
  attributes: "ye",
  types: "bl",
  constants: "tx",
  labels: "cy",
  namespaces: "ye",
  modules: "re",
  typeParameters: "ye",
  exceptions: "cy",
  decorators: "ye",
  calls: "tx",
  punctuation: "tx",
  yellow: "ye",
  green: "cy",
  cyan: "cy",
  blue: "bl",
  purple: "pu",
  magenta: "ma",
  red: "re",
  orange: "or",
};

export const NeotericShadesMappedTokens: Record<SemanticToken, Abbreviations> =
  {
    plain: "tx", // Default text color
    classes: "pu", // Purple for classes
    interfaces: "cy", // Cyan for interfaces
    structs: "gr", // Green for structs
    enums: "ye", // Yellow for enums
    keys: "or", // Orange for object keys
    methods: "bl", // Blue for methods
    functions: "ma", // Magenta for functions
    variables: "tx", // Default text color for variables
    variablesOther: "tx",
    globalVariables: "re", // Red for globals for emphasis
    localVariables: "tx-3",
    parameters: "cy", // Cyan for parameters
    properties: "or", // Orange for properties
    strings: "gr", // Green for strings
    stringEscapeSequences: "re", // Red for escape sequences within strings
    keywords: "bl", // Blue for keywords
    keywordsControl: "pu", // Purple for control keywords
    storageModifiers: "or", // Orange for storage modifiers
    comments: "tx-2", // A lighter text tone for comments
    docComments: "tx-3", // Differentiated from regular comments
    numbers: "ye", // Yellow for numbers
    booleans: "or", // Orange for booleans
    operators: "tx", // Default text color for operators
    macros: "re", // Red for macros, since they are preprocessor directives
    preprocessor: "re", // Red for preprocessor directives
    urls: "bl", // Blue for URLs
    tags: "pu", // Purple for tags
    jsxTags: "cy", // Cyan for JSX tags
    attributes: "or", // Orange for attributes
    types: "pu", // Purple for type declarations
    constants: "re", // Red for constants
    labels: "tx-2", // Lighter text tone for labels
    namespaces: "cy", // Cyan for namespaces
    modules: "bl", // Blue for modules
    typeParameters: "ma", // Magenta for type parameters
    exceptions: "re", // Red for exceptions
    decorators: "ma", // Magenta for decorators
    calls: "bl", // Blue for function/method calls
    punctuation: "tx", // Default text color for punctuation
    // Direct color mappings
    yellow: "ye",
    green: "gr",
    cyan: "cy",
    blue: "bl",
    purple: "pu",
    magenta: "ma",
    red: "re",
    orange: "or",
  };

export const VSCodeEditorMappedTokens: Record<string, Abbreviations> = {
  // Editor Colors
  "editor.background": "bg",
  "editor.foreground": "tx",
  "editor.hoverHighlightBackground": "ui-2",
  "editor.lineHighlightBackground": "bg-2",
  "editor.selectionBackground": "tx",
  "editor.selectionHighlightBackground": "tx",
  "editor.findMatchBackground": "ye-2",
  "editor.findMatchHighlightBackground": "ye-2",
  "editor.findRangeHighlightBackground": "bg-2",
  "editor.inactiveSelectionBackground": "ui",
  "editor.lineHighlightBorder": "ui",
  "editor.rangeHighlightBackground": "ui-3",
  "notifications.background": "ui",
  "editorInlayHint.typeBackground": "ui-2",
  "editorInlayHint.typeForeground": "tx",
  "editorWhitespace.foreground": "ui-3",
  "editorIndentGuide.background1": "ui-2",
  "editorHoverWidget.background": "ui",
  "editorLineNumber.activeForeground": "tx",
  "editorLineNumber.foreground": "ui-3",

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
  "editorGroup.border": "ui-2",
  "tab.activeBackground": "bg",
  "tab.inactiveBackground": "bg-2",
  "tab.inactiveForeground": "tx-2",
  "tab.activeForeground": "tx",
  "tab.hoverBackground": "ui-2",
  "tab.unfocusedHoverBackground": "ui-2",
  "tab.border": "ui-2",
  "tab.activeModifiedBorder": "ye",
  "tab.inactiveModifiedBorder": "bl",
  "tab.unfocusedActiveModifiedBorder": "ye-2",
  "tab.unfocusedInactiveModifiedBorder": "bl-2",

  // Editor Widget Colors
  "editorWidget.background": "bg-2",
  "editorWidget.border": "ui-2",
  "editorSuggestWidget.background": "bg",
  "editorSuggestWidget.border": "ui-2",
  "editorSuggestWidget.foreground": "tx",
  "editorSuggestWidget.highlightForeground": "tx-2",
  "editorSuggestWidget.selectedBackground": "ui-2",

  // Peek View Colors
  "peekView.border": "ui-2",
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
  "merge.border": "ui-2",
  "merge.commonContentBackground": "ui-3",
  "merge.commonHeaderBackground": "ui-2",

  // Panel Colors
  "panel.background": "bg",
  "panel.border": "ui-2",
  "panelTitle.activeBorder": "ui-3",
  "panelTitle.activeForeground": "tx",
  "panelTitle.inactiveForeground": "tx-2",

  // Status Bar Colors
  "statusBar.background": "bg",
  "statusBar.foreground": "tx",
  "statusBar.border": "ui-2",
  "statusBar.debuggingBackground": "re",
  "statusBar.debuggingForeground": "tx",
  "statusBar.noFolderBackground": "ui-3",
  "statusBar.noFolderForeground": "tx-3",

  // Title Bar
  "titleBar.activeBackground": "bg",
  "titleBar.activeForeground": "tx",
  "titleBar.inactiveBackground": "bg-2",
  "titleBar.inactiveForeground": "tx-2",
  "titleBar.border": "ui-2",

  // Menus
  "menu.foreground": "tx",
  "menu.background": "bg",
  "menu.selectionForeground": "tx",
  "menu.selectionBackground": "ui-2",
  "menu.border": "ui-2",

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
  "terminal.ansiMagenta": "cy",
  "terminal.ansiCyan": "cy",

  // Activity Bar
  "activityBar.background": "bg",
  "activityBar.foreground": "tx",
  "activityBar.inactiveForeground": "tx-2",
  "activityBar.activeBorder": "tx",
  "activityBar.border": "ui-2",

  // Sidebar
  "sideBar.background": "bg",
  "sideBar.foreground": "tx",
  "sideBar.border": "ui-2",
  "sideBarTitle.foreground": "tx",
  "sideBarSectionHeader.background": "bg-2",
  "sideBarSectionHeader.foreground": "tx",
  "sideBarSectionHeader.border": "ui-2",

  // SideBar: Highlights & Active items
  "sideBar.activeBackground": "ui-3",
  "sideBar.activeForeground": "tx",

  // Sidebar: Hover
  "sideBar.hoverBackground": "ui-2",
  "sideBar.hoverForeground": "tx-2",

  // File & Folder Icons
  "sideBar.folderIcon.foreground": "gr",
  "sideBar.fileIcon.foreground": "bl",

  // More detailed SideBar items...
  "list.warningForeground": "or",
  "list.errorForeground": "re",

  // Sidebar: Selections
  "list.inactiveSelectionBackground": "ui-2",
  "list.activeSelectionBackground": "ui-3",
  "list.inactiveSelectionForeground": "tx",
  "list.activeSelectionForeground": "tx",
  "list.hoverForeground": "tx",
  "list.hoverBackground": "ui-2",

  // Input Controls
  "input.background": "bg-2",
  "input.foreground": "tx",
  "input.border": "ui-2",
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
  "dropdown.border": "ui-2",
  "dropdown.listBackground": "bg",

  // Buttons & Badges
  "badge.background": "cy",
  "activityBarBadge.background": "cy",
  "button.background": "cy",

  /** Arbitrary Changes to improve accessibility & consistency  */
  // Hardcoded Colors - Always Paper - See generate.js
  "button.foreground": "bg",
  "badge.foreground": "bg",
  "activityBarBadge.foreground": "bg",
};

export const VSCodeMappedTokens: Record<
  MyTheme,
  Record<SemanticToken, Abbreviations>
> = {
  Flexoki: FlexokiVSCodeMappedTokens,
  "One Hunter Material": OneHunterMaterialMappedTokens,
  "One Hunter Flexoki": OneHunterFlexokiMappedTokens,
  "Neoteric Shades": NeotericShadesMappedTokens,
};
