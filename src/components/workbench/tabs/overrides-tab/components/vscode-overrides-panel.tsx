"use client";

import { ChevronDown, Info } from "lucide-react";
import * as React from "react";
import { TokenSearch } from "@/components/shared/token-search";
import { VSCodeTokenInput } from "@/components/shared/vscode-token-input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  editorColorMap,
  type SemanticToken,
  type TokenColorMap,
  tokenToScopeMapping,
} from "@/lib/providers/vscode";
import {
  createInitialVSCodeTokenGroups,
  createVSCodeTokenSkeletons,
  VSCODE_TOKEN_GROUPS,
} from "@/lib/vscode-token-utils";
import { useThemeContext } from "@/providers/theme";
import { useClearOverrides } from "../hooks/use-clear-overrides";
import { useVSCodeOverrides } from "../hooks/use-provider-overrides";
import { ClearOverridesAlert } from "./clear-overrides-alert";

// Comprehensive editor color groups - ALL tokens from editorColorMap organized logically
const EDITOR_COLOR_GROUPS = [
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

interface VSCodeOverridesPanelProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
}

export function VSCodeOverridesPanel({
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search tokens...",
}: VSCodeOverridesPanelProps) {
  const { tinteTheme, currentMode, mounted } = useThemeContext();
  const vscodeOverrides = useVSCodeOverrides();
  const clearOverrides = useClearOverrides({
    provider: "vscode",
    providerHook: vscodeOverrides,
    providerDisplayName: "VSCode",
  });
  const [activeTab, setActiveTab] = React.useState("tokens");
  const [openTokenGroups, setOpenTokenGroups] = React.useState<
    Record<string, boolean>
  >(() =>
    Object.keys(createInitialVSCodeTokenGroups()).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {},
    ),
  );
  const [openEditorGroups, setOpenEditorGroups] = React.useState<
    Record<string, boolean>
  >(
    EDITOR_COLOR_GROUPS.reduce(
      (acc, group) => ({ ...acc, [group.label]: false }),
      {},
    ),
  );

  // Determine if we should show skeletons or real data
  const currentColors = tinteTheme?.[currentMode];
  const shouldShowSkeletons = !mounted || !vscodeOverrides.hasAnyOverrides;
  const baseGroupsToRender = shouldShowSkeletons
    ? createVSCodeTokenSkeletons()
    : VSCODE_TOKEN_GROUPS;

  // Filter token groups based on search query
  const filteredTokenGroups = React.useMemo(() => {
    if (!searchQuery.trim()) return baseGroupsToRender;

    return baseGroupsToRender
      .map((group) => {
        const filteredTokens = group.tokens.filter((token) => {
          const query = searchQuery.toLowerCase();

          // Search by token key and display name
          const keyMatch =
            token.key.toLowerCase().includes(query) ||
            token.displayName.toLowerCase().includes(query) ||
            token.description.toLowerCase().includes(query);

          // Search by VSCode scopes
          const scopes = tokenToScopeMapping[token.key];
          const scopeMatch =
            scopes &&
            (Array.isArray(scopes)
              ? scopes.some((scope) => scope.toLowerCase().includes(query))
              : scopes.toLowerCase().includes(query));

          return keyMatch || scopeMatch;
        });

        return {
          ...group,
          tokens: filteredTokens,
        };
      })
      .filter((group) => group.tokens.length > 0);
  }, [baseGroupsToRender, searchQuery]);

  // Filter editor color groups based on search query
  const filteredEditorGroups = React.useMemo(() => {
    if (!searchQuery.trim()) return EDITOR_COLOR_GROUPS;

    return EDITOR_COLOR_GROUPS.map((group) => {
      const filteredColors = group.colors.filter(
        (color) =>
          color.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          color.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      return {
        ...group,
        colors: filteredColors,
      };
    }).filter((group) => group.colors.length > 0);
  }, [searchQuery]);

  // Determine if there are search results in each tab
  const hasTokenResults = searchQuery.trim() && filteredTokenGroups.length > 0;
  const hasEditorResults =
    searchQuery.trim() && filteredEditorGroups.length > 0;

  // Auto-switch tab if search results are only in the other tab
  React.useEffect(() => {
    if (!searchQuery.trim()) return;

    if (activeTab === "tokens" && !hasTokenResults && hasEditorResults) {
      setActiveTab("editor");
    } else if (activeTab === "editor" && !hasEditorResults && hasTokenResults) {
      setActiveTab("tokens");
    }
  }, [searchQuery, hasTokenResults, hasEditorResults, activeTab]);

  const handleTokenChange = (tokenKey: SemanticToken, value: string) => {
    vscodeOverrides.setOverride(tokenKey, value);
  };

  const handleEditorColorChange = (colorKey: string, value: string) => {
    // TODO: Implement editor color override functionality
    console.log("Editor color change:", colorKey, value);
  };

  const toggleTokenGroup = (groupName: string) => {
    setOpenTokenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const toggleEditorGroup = (groupName: string) => {
    setOpenEditorGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // Get the current token value (either from overrides or default mapping)
  const getTokenValue = React.useCallback(
    (tokenKey: SemanticToken): string | undefined => {
      if (vscodeOverrides.hasOverride(tokenKey)) {
        return vscodeOverrides.getValue(tokenKey);
      }

      // Get from default mapping if available
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
        variablesOther: "sc",
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
        constants: "sc",
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

      const mappedKey = defaultTokenColorMap[tokenKey];
      return currentColors?.[mappedKey];
    },
    [
      vscodeOverrides.overrides,
      vscodeOverrides.hasOverride,
      vscodeOverrides.getValue,
      currentColors,
    ],
  );

  // Get editor color value from theme using the imported editorColorMap
  const getEditorColorValue = (colorKey: string): string | undefined => {
    // TODO: Check for editor color overrides first
    // For now, return from current theme colors using the imported editorColorMap
    const mappedKey = editorColorMap[colorKey as keyof typeof editorColorMap];
    return currentColors?.[mappedKey];
  };

  return (
    <div className="flex flex-col h-full">
      {onSearchChange && (
        <div className="pr-3 pl-1 pb-2 flex-shrink-0">
          <TokenSearch
            placeholder={searchPlaceholder}
            onSearch={onSearchChange}
            value={searchQuery}
          />
        </div>
      )}

      <div className="flex-shrink-0 bg-muted/30 mb-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2 pl-1">
            <TabsTrigger value="tokens" className="relative">
              Token Colors
              {searchQuery.trim() && hasTokenResults && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
              )}
            </TabsTrigger>
            <TabsTrigger value="editor" className="relative">
              Editor Colors
              {searchQuery.trim() && hasEditorResults && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea
        className="flex-1 min-h-0 pl-1 pr-3"
        showScrollIndicators={true}
        indicatorType="shadow"
      >
        {/* Clear VSCode Overrides Alert */}
        {clearOverrides.hasOverrides && (
          <div className="mb-4">
            <ClearOverridesAlert
              providerDisplayName="VSCode"
              isClearing={clearOverrides.isClearing}
              onClear={clearOverrides.handleClearOverrides}
            />
          </div>
        )}
        {activeTab === "tokens" && (
          <div className="space-y-4 pb-2">
            {searchQuery.trim() && !hasTokenResults && hasEditorResults && (
              <div className="p-4 text-center text-muted-foreground bg-muted/20 rounded-md">
                <p className="text-sm">
                  No token colors found for "{searchQuery}"
                </p>
                <p className="text-xs mt-1">
                  Found results in Editor Colors tab
                </p>
              </div>
            )}
            {filteredTokenGroups.map((group) => (
              <Collapsible
                key={group.label}
                open={openTokenGroups[group.label]}
                onOpenChange={() => toggleTokenGroup(group.label)}
              >
                <CollapsibleTrigger
                  className={`flex w-full items-center justify-between uppercase ${
                    openTokenGroups[group.label] ? "rounded-t-md" : "rounded-md"
                  } border border-border px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors`}
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openTokenGroups[group.label] ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="border border-t-0 border-border rounded-b-md bg-muted/20">
                  <div className="p-3 space-y-3">
                    <p className="text-xs text-muted-foreground mb-3">
                      {group.description}
                    </p>
                    {group.tokens.map((token) => {
                      const tokenValue = getTokenValue(token.key);
                      return (
                        <VSCodeTokenInput
                          key={`${token.key}-${tokenValue}`}
                          tokenKey={token.key}
                          value={tokenValue}
                          onChange={handleTokenChange}
                          displayName={token.displayName}
                          description={token.description}
                        />
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}

        {activeTab === "editor" && (
          <div className="space-y-4 pb-2">
            {searchQuery.trim() && !hasEditorResults && hasTokenResults && (
              <div className="p-4 text-center text-muted-foreground bg-muted/20 rounded-md">
                <p className="text-sm">
                  No editor colors found for "{searchQuery}"
                </p>
                <p className="text-xs mt-1">
                  Found results in Token Colors tab
                </p>
              </div>
            )}
            {filteredEditorGroups.map((group) => (
              <Collapsible
                key={group.label}
                open={openEditorGroups[group.label]}
                onOpenChange={() => toggleEditorGroup(group.label)}
              >
                <CollapsibleTrigger
                  className={`flex w-full items-center justify-between uppercase ${
                    openEditorGroups[group.label]
                      ? "rounded-t-md"
                      : "rounded-md"
                  } border border-border px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors`}
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openEditorGroups[group.label] ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="border border-t-0 border-border rounded-b-md bg-muted/20">
                  <div className="p-3 space-y-3">
                    <p className="text-xs text-muted-foreground mb-3">
                      {group.description}
                    </p>
                    {group.colors.map((color) => (
                      <VSCodeTokenInput
                        key={color.key}
                        tokenKey={color.key as any}
                        value={getEditorColorValue(color.key)}
                        onChange={(key: any, value: string) =>
                          handleEditorColorChange(key, value)
                        }
                        displayName={color.name}
                        description={color.description}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
        <ScrollBar />
      </ScrollArea>
    </div>
  );
}
