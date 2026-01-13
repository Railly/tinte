export interface EditorColorConfig {
  key: string;
  name: string;
  description: string;
}

export interface EditorColorGroup {
  label: string;
  description: string;
  colors: EditorColorConfig[];
}

export const EDITOR_COLOR_GROUPS: EditorColorGroup[] = [
  {
    label: "Editor Foundation",
    description: "Core editor background, foreground, and basic text colors",
    colors: [
      {
        key: "editor.background",
        name: "Editor Background",
        description: "Main editor background color",
      },
      {
        key: "editor.foreground",
        name: "Editor Text",
        description: "Main editor text color",
      },
    ],
  },
  {
    label: "Editor Highlights & Selection",
    description: "Text selection, word highlighting, and hover effects",
    colors: [
      {
        key: "editor.selectionBackground",
        name: "Text Selection",
        description: "Selected text background",
      },
      {
        key: "editor.inactiveSelectionBackground",
        name: "Inactive Selection",
        description: "Selection when editor is unfocused",
      },
      {
        key: "editor.selectionHighlightBackground",
        name: "Selection Highlight",
        description: "Other occurrences of selected text",
      },
      {
        key: "editor.wordHighlightBackground",
        name: "Word Highlight",
        description: "Symbol occurrence highlight",
      },
      {
        key: "editor.wordHighlightStrongBackground",
        name: "Word Highlight Strong",
        description: "Write-access symbol highlight",
      },
      {
        key: "editor.hoverHighlightBackground",
        name: "Hover Highlight",
        description: "Background when hovering over symbols",
      },
      {
        key: "editor.lineHighlightBackground",
        name: "Current Line",
        description: "Current line background",
      },
      {
        key: "editor.lineHighlightBorder",
        name: "Current Line Border",
        description: "Current line border",
      },
      {
        key: "editor.rangeHighlightBackground",
        name: "Range Highlight",
        description: "Range highlight background",
      },
    ],
  },
  {
    label: "Editor Search & Find",
    description: "Find and search result highlighting",
    colors: [
      {
        key: "editor.findMatchBackground",
        name: "Current Find Match",
        description: "Current search result highlight",
      },
      {
        key: "editor.findMatchHighlightBackground",
        name: "Find Match Highlight",
        description: "Other search results highlight",
      },
      {
        key: "editor.findRangeHighlightBackground",
        name: "Find Range Highlight",
        description: "Range limiting the search",
      },
    ],
  },
  {
    label: "Line Numbers & Gutter",
    description: "Line numbers, gutter, and Git decorations",
    colors: [
      {
        key: "editorLineNumber.foreground",
        name: "Line Numbers",
        description: "Line number color",
      },
      {
        key: "editorLineNumber.activeForeground",
        name: "Active Line Number",
        description: "Current line number color",
      },
      {
        key: "editorGutter.background",
        name: "Gutter Background",
        description: "Editor gutter background",
      },
      {
        key: "editorGutter.modifiedBackground",
        name: "Modified Line Indicator",
        description: "Git modified line indicator",
      },
      {
        key: "editorGutter.addedBackground",
        name: "Added Line Indicator",
        description: "Git added line indicator",
      },
      {
        key: "editorGutter.deletedBackground",
        name: "Deleted Line Indicator",
        description: "Git deleted line indicator",
      },
    ],
  },
  {
    label: "Editor Whitespace & Guides",
    description: "Whitespace, indent guides, and formatting helpers",
    colors: [
      {
        key: "editorWhitespace.foreground",
        name: "Whitespace Characters",
        description: "Visible whitespace color",
      },
      {
        key: "editorIndentGuide.background1",
        name: "Indent Guide",
        description: "Indentation guide color",
      },
    ],
  },
  {
    label: "Editor Brackets",
    description: "Bracket matching and highlighting",
    colors: [
      {
        key: "editorBracketMatch.background",
        name: "Bracket Match Background",
        description: "Matching bracket background",
      },
      {
        key: "editorBracketMatch.border",
        name: "Bracket Match Border",
        description: "Matching bracket border",
      },
    ],
  },
  {
    label: "Editor Widgets",
    description: "Hover widgets, tooltips, and floating UI elements",
    colors: [
      {
        key: "editorWidget.background",
        name: "Widget Background",
        description: "Editor widget background",
      },
      {
        key: "editorWidget.border",
        name: "Widget Border",
        description: "Editor widget border",
      },
      {
        key: "editorHoverWidget.background",
        name: "Hover Widget Background",
        description: "Hover widget background",
      },
    ],
  },
  {
    label: "IntelliSense & Suggestions",
    description: "Auto-complete, suggestions, and code assistance",
    colors: [
      {
        key: "editorSuggestWidget.background",
        name: "Suggest Background",
        description: "IntelliSense widget background",
      },
      {
        key: "editorSuggestWidget.border",
        name: "Suggest Border",
        description: "IntelliSense widget border",
      },
      {
        key: "editorSuggestWidget.foreground",
        name: "Suggest Text",
        description: "IntelliSense widget text",
      },
      {
        key: "editorSuggestWidget.highlightForeground",
        name: "Suggest Highlight",
        description: "IntelliSense matched text",
      },
      {
        key: "editorSuggestWidget.selectedBackground",
        name: "Selected Suggestion",
        description: "Selected IntelliSense item",
      },
    ],
  },
  {
    label: "Editor Groups & Tabs",
    description: "Tab bar, editor groups, and tab management",
    colors: [
      {
        key: "editorGroupHeader.tabsBackground",
        name: "Tab Bar Background",
        description: "Tab container background",
      },
      {
        key: "editorGroup.border",
        name: "Editor Group Border",
        description: "Border between editor groups",
      },
      {
        key: "tab.activeBackground",
        name: "Active Tab",
        description: "Active tab background",
      },
      {
        key: "tab.inactiveBackground",
        name: "Inactive Tab",
        description: "Inactive tab background",
      },
      {
        key: "tab.activeForeground",
        name: "Active Tab Text",
        description: "Active tab text color",
      },
      {
        key: "tab.inactiveForeground",
        name: "Inactive Tab Text",
        description: "Inactive tab text color",
      },
      {
        key: "tab.border",
        name: "Tab Border",
        description: "Tab border color",
      },
      {
        key: "tab.hoverBackground",
        name: "Tab Hover",
        description: "Tab background when hovering",
      },
      {
        key: "tab.unfocusedHoverBackground",
        name: "Unfocused Tab Hover",
        description: "Tab hover when window unfocused",
      },
      {
        key: "tab.activeModifiedBorder",
        name: "Modified Tab Indicator",
        description: "Active modified tab indicator",
      },
      {
        key: "tab.inactiveModifiedBorder",
        name: "Inactive Modified Indicator",
        description: "Inactive modified tab indicator",
      },
    ],
  },
  {
    label: "Title Bar",
    description: "Window title bar and application chrome",
    colors: [
      {
        key: "titleBar.activeBackground",
        name: "Active Title Bar",
        description: "Title bar when window is focused",
      },
      {
        key: "titleBar.activeForeground",
        name: "Active Title Text",
        description: "Title bar text when focused",
      },
      {
        key: "titleBar.inactiveBackground",
        name: "Inactive Title Bar",
        description: "Title bar when window is unfocused",
      },
      {
        key: "titleBar.inactiveForeground",
        name: "Inactive Title Text",
        description: "Title bar text when unfocused",
      },
      {
        key: "titleBar.border",
        name: "Title Bar Border",
        description: "Title bar bottom border",
      },
    ],
  },
  {
    label: "Activity Bar",
    description: "Left activity bar with tool icons and badges",
    colors: [
      {
        key: "activityBar.background",
        name: "Activity Bar Background",
        description: "Activity bar background",
      },
      {
        key: "activityBar.foreground",
        name: "Active Icon",
        description: "Active activity icon color",
      },
      {
        key: "activityBar.inactiveForeground",
        name: "Inactive Icon",
        description: "Inactive activity icon color",
      },
      {
        key: "activityBar.activeBorder",
        name: "Active Item Border",
        description: "Active activity item border",
      },
      {
        key: "activityBar.border",
        name: "Activity Bar Border",
        description: "Activity bar right border",
      },
      {
        key: "activityBarBadge.background",
        name: "Badge Background",
        description: "Activity bar notification badge",
      },
      {
        key: "activityBarBadge.foreground",
        name: "Badge Text",
        description: "Activity bar badge text",
      },
    ],
  },
  {
    label: "Sidebar & Explorer",
    description: "File explorer and sidebar panels",
    colors: [
      {
        key: "sideBar.background",
        name: "Sidebar Background",
        description: "Sidebar background color",
      },
      {
        key: "sideBar.foreground",
        name: "Sidebar Text",
        description: "Sidebar text color",
      },
      {
        key: "sideBar.border",
        name: "Sidebar Border",
        description: "Sidebar right border",
      },
      {
        key: "sideBarTitle.foreground",
        name: "Sidebar Title",
        description: "Sidebar section titles",
      },
      {
        key: "sideBarSectionHeader.background",
        name: "Section Header Background",
        description: "Sidebar section header background",
      },
      {
        key: "sideBarSectionHeader.foreground",
        name: "Section Header Text",
        description: "Sidebar section header text",
      },
      {
        key: "sideBarSectionHeader.border",
        name: "Section Header Border",
        description: "Sidebar section header border",
      },
    ],
  },
  {
    label: "Lists & Trees",
    description: "File explorer, outline, and other tree views",
    colors: [
      {
        key: "list.foreground",
        name: "List Item Text",
        description: "List and tree item text",
      },
      {
        key: "list.activeSelectionBackground",
        name: "Active Selection",
        description: "Selected item when focused",
      },
      {
        key: "list.activeSelectionForeground",
        name: "Active Selection Text",
        description: "Selected item text when focused",
      },
      {
        key: "list.inactiveSelectionBackground",
        name: "Inactive Selection",
        description: "Selected item when unfocused",
      },
      {
        key: "list.inactiveSelectionForeground",
        name: "Inactive Selection Text",
        description: "Selected item text when unfocused",
      },
      {
        key: "list.hoverBackground",
        name: "Hover Background",
        description: "Item background when hovering",
      },
      {
        key: "list.hoverForeground",
        name: "Hover Text",
        description: "Item text when hovering",
      },
      {
        key: "list.focusOutline",
        name: "Focus Outline",
        description: "Focused item outline color",
      },
    ],
  },
  {
    label: "Panels & Terminal",
    description: "Bottom panel, integrated terminal, and output views",
    colors: [
      {
        key: "panel.background",
        name: "Panel Background",
        description: "Bottom panel background",
      },
      {
        key: "panel.border",
        name: "Panel Border",
        description: "Panel border color",
      },
      {
        key: "panelTitle.activeForeground",
        name: "Active Panel Tab",
        description: "Active panel tab text",
      },
      {
        key: "panelTitle.inactiveForeground",
        name: "Inactive Panel Tab",
        description: "Inactive panel tab text",
      },
      {
        key: "panelTitle.activeBorder",
        name: "Active Panel Border",
        description: "Active panel tab border",
      },
      {
        key: "terminal.background",
        name: "Terminal Background",
        description: "Terminal background color",
      },
      {
        key: "terminal.foreground",
        name: "Terminal Text",
        description: "Terminal text color",
      },
      {
        key: "terminalCursor.foreground",
        name: "Terminal Cursor",
        description: "Terminal cursor color",
      },
      {
        key: "terminalCursor.background",
        name: "Terminal Cursor Background",
        description: "Terminal cursor background",
      },
    ],
  },
  {
    label: "Terminal ANSI Colors",
    description: "Terminal color palette for syntax and output",
    colors: [
      {
        key: "terminal.ansiRed",
        name: "ANSI Red",
        description: "Terminal red color",
      },
      {
        key: "terminal.ansiGreen",
        name: "ANSI Green",
        description: "Terminal green color",
      },
      {
        key: "terminal.ansiYellow",
        name: "ANSI Yellow",
        description: "Terminal yellow color",
      },
      {
        key: "terminal.ansiBlue",
        name: "ANSI Blue",
        description: "Terminal blue color",
      },
      {
        key: "terminal.ansiMagenta",
        name: "ANSI Magenta",
        description: "Terminal magenta color",
      },
      {
        key: "terminal.ansiCyan",
        name: "ANSI Cyan",
        description: "Terminal cyan color",
      },
    ],
  },
  {
    label: "Status Bar",
    description: "Bottom status bar with indicators and information",
    colors: [
      {
        key: "statusBar.background",
        name: "Status Bar Background",
        description: "Status bar background",
      },
      {
        key: "statusBar.foreground",
        name: "Status Bar Text",
        description: "Status bar text color",
      },
      {
        key: "statusBar.border",
        name: "Status Bar Border",
        description: "Status bar top border",
      },
      {
        key: "statusBar.debuggingBackground",
        name: "Debug Status Background",
        description: "Status bar when debugging",
      },
      {
        key: "statusBar.debuggingForeground",
        name: "Debug Status Text",
        description: "Status bar text when debugging",
      },
    ],
  },
  {
    label: "Menus & Context Menus",
    description: "Right-click menus and dropdown menus",
    colors: [
      {
        key: "menu.background",
        name: "Menu Background",
        description: "Context menu background",
      },
      {
        key: "menu.foreground",
        name: "Menu Text",
        description: "Context menu text",
      },
      {
        key: "menu.selectionBackground",
        name: "Selected Menu Item",
        description: "Selected menu item background",
      },
      {
        key: "menu.selectionForeground",
        name: "Selected Menu Text",
        description: "Selected menu item text",
      },
      {
        key: "menu.border",
        name: "Menu Border",
        description: "Context menu border",
      },
    ],
  },
  {
    label: "Form Controls",
    description: "Input fields, dropdowns, and interactive elements",
    colors: [
      {
        key: "input.background",
        name: "Input Background",
        description: "Text input background",
      },
      {
        key: "input.foreground",
        name: "Input Text",
        description: "Text input text color",
      },
      {
        key: "input.border",
        name: "Input Border",
        description: "Text input border",
      },
      {
        key: "input.placeholderForeground",
        name: "Input Placeholder",
        description: "Input placeholder text",
      },
      {
        key: "dropdown.background",
        name: "Dropdown Background",
        description: "Dropdown background",
      },
      {
        key: "dropdown.foreground",
        name: "Dropdown Text",
        description: "Dropdown text color",
      },
      {
        key: "dropdown.border",
        name: "Dropdown Border",
        description: "Dropdown border",
      },
      {
        key: "dropdown.listBackground",
        name: "Dropdown List",
        description: "Dropdown option list background",
      },
    ],
  },
  {
    label: "Buttons & Badges",
    description: "Action buttons, badges, and UI accents",
    colors: [
      {
        key: "button.background",
        name: "Primary Button",
        description: "Primary button background",
      },
      {
        key: "button.foreground",
        name: "Primary Button Text",
        description: "Primary button text",
      },
      {
        key: "badge.background",
        name: "Badge Background",
        description: "General badge background",
      },
      {
        key: "badge.foreground",
        name: "Badge Text",
        description: "General badge text",
      },
    ],
  },
];
