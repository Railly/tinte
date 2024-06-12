import { entries } from "../utils";
import { Palette } from "./types";

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

const editorColorMap = {
  // Editor Colors
  "editor.background": "background",
  "editor.foreground": "text",
  "editor.hoverHighlightBackground": "interface-2",
  "editor.lineHighlightBackground": "background-2",
  "editor.selectionBackground": "interface-3",
  "editor.selectionHighlightBackground": "text-3",
  "editor.wordHighlightBackground": "interface-2",
  "editor.wordHighlightStrongBackground": "interface",
  "editor.findMatchBackground": "accent",
  "editor.findMatchHighlightBackground": "accent",
  "editor.findRangeHighlightBackground": "background-2",
  "editor.inactiveSelectionBackground": "interface-3",
  "editor.lineHighlightBorder": "interface",
  "editor.rangeHighlightBackground": "background-2",
  "notifications.background": "interface",
  "editorInlayHint.typeBackground": "interface-2",
  "editorInlayHint.typeForeground": "text",
  "editorWhitespace.foreground": "interface",
  "editorIndentGuide.background1": "interface-2",
  "editorHoverWidget.background": "interface",
  "editorLineNumber.activeForeground": "text",
  "editorLineNumber.foreground": "interface-3",

  // Gutter Colors
  "editorGutter.background": "background",
  "editorGutter.modifiedBackground": "accent-2",
  "editorGutter.addedBackground": "accent-2",
  "editorGutter.deletedBackground": "primary",

  // Bracket Matching
  "editorBracketMatch.background": "interface",
  "editorBracketMatch.border": "interface-2",

  // Editor Groups & Tabs
  "editorGroupHeader.tabsBackground": "background",
  "editorGroup.border": "interface-2",
  "tab.activeBackground": "background",
  "tab.inactiveBackground": "background-2",
  "tab.inactiveForeground": "text-2",
  "tab.activeForeground": "text",
  "tab.hoverBackground": "interface-2",
  "tab.unfocusedHoverBackground": "interface-2",
  "tab.border": "interface-2",
  "tab.activeModifiedBorder": "accent",
  "tab.inactiveModifiedBorder": "secondary",
  "tab.unfocusedActiveModifiedBorder": "accent",
  "tab.unfocusedInactiveModifiedBorder": "secondary",

  // Editor Widget Colors
  "editorWidget.background": "background-2",
  "editorWidget.border": "interface-2",
  "editorSuggestWidget.background": "background",
  "editorSuggestWidget.border": "interface-2",
  "editorSuggestWidget.foreground": "text",
  "editorSuggestWidget.highlightForeground": "text-2",
  "editorSuggestWidget.selectedBackground": "interface-2",

  // Peek View Colors
  "peekView.border": "interface-2",
  "peekViewEditor.background": "background",
  "peekViewEditor.matchHighlightBackground": "interface-3",
  "peekViewResult.background": "background-2",
  "peekViewResult.fileForeground": "text",
  "peekViewResult.lineForeground": "text-2",
  "peekViewResult.matchHighlightBackground": "interface-3",
  "peekViewResult.selectionBackground": "interface",
  "peekViewResult.selectionForeground": "text-3",
  "peekViewTitle.background": "interface-2",
  "peekViewTitleDescription.foreground": "text-2",
  "peekViewTitleLabel.foreground": "text",

  // Merge Conflicts
  "merge.currentHeaderBackground": "accent-2",
  "merge.currentContentBackground": "accent-2",
  "merge.incomingHeaderBackground": "accent-2",
  "merge.incomingContentBackground": "accent-2",
  "merge.border": "interface-2",
  "merge.commonContentBackground": "interface-3",
  "merge.commonHeaderBackground": "interface-2",

  // Panel Colors
  "panel.background": "background",
  "panel.border": "interface-2",
  "panelTitle.activeBorder": "interface-3",
  "panelTitle.activeForeground": "text",
  "panelTitle.inactiveForeground": "text-2",

  // Status Bar Colors
  "statusBar.background": "background",
  "statusBar.foreground": "text",
  "statusBar.border": "interface-2",
  "statusBar.debuggingBackground": "primary",
  "statusBar.debuggingForeground": "text",
  "statusBar.noFolderBackground": "interface-3",
  "statusBar.noFolderForeground": "text-3",

  // Title Bar
  "titleBar.activeBackground": "background",
  "titleBar.activeForeground": "text",
  "titleBar.inactiveBackground": "background-2",
  "titleBar.inactiveForeground": "text-2",
  "titleBar.border": "interface-2",

  // Menus
  "menu.foreground": "text",
  "menu.background": "background",
  "menu.selectionForeground": "text",
  "menu.selectionBackground": "interface-2",
  "menu.border": "interface-2",

  // Inlay Hints
  "editorInlayHint.foreground": "text-2",
  "editorInlayHint.background": "interface-2",

  // Terminal
  "terminal.foreground": "text",
  "terminal.background": "background",
  "terminalCursor.foreground": "text",
  "terminalCursor.background": "background",
  "terminal.ansiRed": "primary",
  "terminal.ansiGreen": "accent-2",
  "terminal.ansiYellow": "accent",
  "terminal.ansiBlue": "secondary",
  "terminal.ansiMagenta": "accent-2",
  "terminal.ansiCyan": "accent-2",

  // Activity Bar
  "activityBar.background": "background",
  "activityBar.foreground": "text",
  "activityBar.inactiveForeground": "text-2",
  "activityBar.activeBorder": "text",
  "activityBar.border": "interface-2",

  // Sidebar
  "sideBar.background": "background",
  "sideBar.foreground": "text",
  "sideBar.border": "interface-2",
  "sideBarTitle.foreground": "text",
  "sideBarSectionHeader.background": "background-2",
  "sideBarSectionHeader.foreground": "text",
  "sideBarSectionHeader.border": "interface-2",

  // Settings
  "settings.headerForeground": "text",
  "settings.modifiedItemForeground": "primary",
  "settings.textInputForeground": "text",
  "textLink.foreground": "accent",

  // SideBar: Highlights & Active items
  "sideBar.activeBackground": "interface-3",
  "sideBar.activeForeground": "text",

  // Sidebar: Hover
  "sideBar.hoverBackground": "interface-2",
  "sideBar.hoverForeground": "text-2",

  // File & Folder Icons
  "sideBar.folderIcon.foreground": "accent-2",
  "sideBar.fileIcon.foreground": "secondary",

  // Sidebar: Selections
  "list.foreground": "text",
  "list.inactiveSelectionBackground": "interface-2",
  "list.activeSelectionBackground": "interface-3",
  "list.inactiveSelectionForeground": "text",
  "list.activeSelectionForeground": "text",
  "list.focusOutline": "accent",
  "list.inactiveFocusOutline": "interface-2",
  "list.hoverForeground": "text",
  "list.hoverBackground": "interface-2",

  // Input Controls
  "input.background": "background-2",
  "input.foreground": "text",
  "input.border": "interface-2",
  "input.placeholderForeground": "text-2",
  "inputOption.activeBorder": "interface-2",
  "inputOption.activeBackground": "interface",
  "inputOption.activeForeground": "text",

  // Dropdowns
  "dropdown.background": "background-2",
  "dropdown.foreground": "text",
  "dropdown.border": "interface-2",
  "dropdown.listBackground": "background",

  // Buttons & Badges
  "badge.background": "secondary",
  "activityBarBadge.background": "secondary",
  "button.background": "secondary",

  // Arbitrary Changes to improve accessibility & consistency
  "button.foreground": "background",
  "badge.foreground": "background",
  "activityBarBadge.foreground": "background",
} as const;

export function getVSCodeColors(palette: Palette, mode: "light" | "dark") {
  const vsCodeColors: Record<string, string> = {};

  for (const [token, colorKey] of entries(editorColorMap)) {
    const colorEntry = palette[colorKey];
    vsCodeColors[token] = applyCustomizations(colorEntry, token, mode);
  }

  return vsCodeColors;
}
