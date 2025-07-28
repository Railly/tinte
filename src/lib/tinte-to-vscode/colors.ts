import { TinteBlock } from "@/types/tinte";

// Apply opacity and mode-specific customizations
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
    case "merge.commonContentBackground":
    case "merge.commonHeaderBackground":
      return mode === "light" ? color + "55" : color + "66";
    case "merge.currentContentBackground":
    case "merge.currentHeaderBackground":
    case "merge.incomingContentBackground":
    case "merge.incomingHeaderBackground":
      return mode === "light" ? color + "33" : color + "44";
    case "editor.wordHighlightStrongBackground":
      return mode === "light" ? color + "33" : color + "22";
    case "button.foreground":
    case "badge.foreground":
    case "activityBarBadge.foreground":
      return color;
    case "diffEditor.insertedTextBackground":
    case "diffEditor.removedTextBackground":
      return mode === "light" ? color + "22" : color + "44";
    default:
      return color;
  }
};

// Map VS Code UI elements to Rayso tokens
const editorColorMap = {
  // Editor Colors - following Flexoki scale
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

  // Gutter Colors
  "editorGutter.background": "background",
  "editorGutter.modifiedBackground": "accent_2",
  "editorGutter.addedBackground": "accent_2",
  "editorGutter.deletedBackground": "primary",

  // Bracket Matching
  "editorBracketMatch.background": "interface",
  "editorBracketMatch.border": "interface_2",

  // Editor Groups & Tabs
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

  // Editor Widget Colors
  "editorWidget.background": "background_2",
  "editorWidget.border": "interface_2",
  "editorSuggestWidget.background": "background",
  "editorSuggestWidget.border": "interface_2",
  "editorSuggestWidget.foreground": "text",
  "editorSuggestWidget.highlightForeground": "text_2",
  "editorSuggestWidget.selectedBackground": "interface_2",

  // Panel Colors
  "panel.background": "background",
  "panel.border": "interface_2",
  "panelTitle.activeBorder": "interface_3",
  "panelTitle.activeForeground": "text",
  "panelTitle.inactiveForeground": "text_2",

  // Status Bar Colors
  "statusBar.background": "background",
  "statusBar.foreground": "text",
  "statusBar.border": "interface_2",
  "statusBar.debuggingBackground": "primary",
  "statusBar.debuggingForeground": "text",

  // Title Bar
  "titleBar.activeBackground": "background",
  "titleBar.activeForeground": "text",
  "titleBar.inactiveBackground": "background_2",
  "titleBar.inactiveForeground": "text_2",
  "titleBar.border": "interface_2",

  // Menus
  "menu.foreground": "text",
  "menu.background": "background",
  "menu.selectionForeground": "text",
  "menu.selectionBackground": "interface_2",
  "menu.border": "interface_2",

  // Terminal
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

  // Activity Bar
  "activityBar.background": "background",
  "activityBar.foreground": "text",
  "activityBar.inactiveForeground": "text_2",
  "activityBar.activeBorder": "text",
  "activityBar.border": "interface_2",

  // Sidebar
  "sideBar.background": "background",
  "sideBar.foreground": "text",
  "sideBar.border": "interface_2",
  "sideBarTitle.foreground": "text",
  "sideBarSectionHeader.background": "background_2",
  "sideBarSectionHeader.foreground": "text",
  "sideBarSectionHeader.border": "interface_2",

  // List colors
  "list.foreground": "text",
  "list.inactiveSelectionBackground": "interface_2",
  "list.activeSelectionBackground": "interface_3",
  "list.inactiveSelectionForeground": "text",
  "list.activeSelectionForeground": "text",
  "list.focusOutline": "accent",
  "list.hoverForeground": "text",
  "list.hoverBackground": "interface_2",

  // Input Controls
  "input.background": "background_2",
  "input.foreground": "text",
  "input.border": "interface_2",
  "input.placeholderForeground": "text_2",

  // Dropdowns
  "dropdown.background": "background_2",
  "dropdown.foreground": "text",
  "dropdown.border": "interface_2",
  "dropdown.listBackground": "background",

  // Buttons & Badges
  "badge.background": "secondary",
  "activityBarBadge.background": "secondary",
  "button.background": "secondary",
  "button.foreground": "background",
  "badge.foreground": "background",
  "activityBarBadge.foreground": "background",
} as const;

export function getVSCodeColors(palette: TinteBlock, mode: "light" | "dark") {
  const vsCodeColors: Record<string, string> = {};

  for (const [token, colorKey] of Object.entries(editorColorMap)) {
    const color = palette[colorKey as keyof TinteBlock];
    vsCodeColors[token] = applyCustomizations(color, token, mode);
  }

  return vsCodeColors;
}
