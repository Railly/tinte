"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";
import { TokenSearch, VSCodeTokenInput } from "@/components/shared/inputs";
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
  tokenToScopeMapping,
} from "@/lib/providers/vscode";
import {
  createInitialVSCodeTokenGroups,
  createVSCodeTokenSkeletons,
  VSCODE_TOKEN_GROUPS,
} from "@/lib/provider-utils";
import { useActiveTheme, useThemeMode } from "@/stores/hooks";
import { useClearOverrides } from "../hooks/use-clear-overrides";
import { useVSCodeOverrides } from "../hooks/use-provider-overrides";
import { ClearOverridesAlert } from "../clear-overrides-alert";
import { defaultTokenColorMap } from "./default-token-color-map";
import { EDITOR_COLOR_GROUPS } from "./editor-color-groups";

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
  const { tinteTheme, mounted } = useActiveTheme();
  const { mode } = useThemeMode();
  const currentMode = mode;
  const vscodeOverrides = useVSCodeOverrides();
  const clearOverrides = useClearOverrides({
    provider: "vscode",
    providerHook: vscodeOverrides,
    providerDisplayName: "VSCode",
  });
  const [activeTab, setActiveTab] = React.useState("tokens");
  const [openTokenGroups, setOpenTokenGroups] = React.useState<
    Record<string, boolean>
  >(() => {
    const groups: Record<string, boolean> = {};
    for (const key of Object.keys(createInitialVSCodeTokenGroups())) {
      groups[key] = false;
    }
    return groups;
  });
  const [openEditorGroups, setOpenEditorGroups] = React.useState<
    Record<string, boolean>
  >(() => {
    const groups: Record<string, boolean> = {};
    for (const group of EDITOR_COLOR_GROUPS) {
      groups[group.label] = false;
    }
    return groups;
  });

  const overridesVersion = React.useMemo(
    () => JSON.stringify(vscodeOverrides.overrides),
    [vscodeOverrides.overrides],
  );

  const currentColors = tinteTheme?.[currentMode];
  const shouldShowSkeletons = !mounted || !vscodeOverrides.hasAnyOverrides;
  const baseGroupsToRender = shouldShowSkeletons
    ? createVSCodeTokenSkeletons()
    : VSCODE_TOKEN_GROUPS;

  const filteredTokenGroups = React.useMemo(() => {
    if (!searchQuery.trim()) return baseGroupsToRender;

    return baseGroupsToRender
      .map((group) => {
        const filteredTokens = group.tokens.filter((token) => {
          const query = searchQuery.toLowerCase();
          const keyMatch =
            token.key.toLowerCase().includes(query) ||
            token.displayName.toLowerCase().includes(query) ||
            token.description.toLowerCase().includes(query);
          const scopes = tokenToScopeMapping[token.key];
          const scopeMatch =
            scopes &&
            (Array.isArray(scopes)
              ? scopes.some((scope) => scope.toLowerCase().includes(query))
              : scopes.toLowerCase().includes(query));
          return keyMatch || scopeMatch;
        });
        return { ...group, tokens: filteredTokens };
      })
      .filter((group) => group.tokens.length > 0);
  }, [baseGroupsToRender, searchQuery]);

  const filteredEditorGroups = React.useMemo(() => {
    if (!searchQuery.trim()) return EDITOR_COLOR_GROUPS;

    return EDITOR_COLOR_GROUPS.map((group) => {
      const filteredColors = group.colors.filter(
        (color) =>
          color.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          color.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      return { ...group, colors: filteredColors };
    }).filter((group) => group.colors.length > 0);
  }, [searchQuery]);

  const hasTokenResults = searchQuery.trim() && filteredTokenGroups.length > 0;
  const hasEditorResults =
    searchQuery.trim() && filteredEditorGroups.length > 0;

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
    vscodeOverrides.setOverride(colorKey as SemanticToken, value);
  };

  const toggleTokenGroup = (groupName: string) => {
    setOpenTokenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const toggleEditorGroup = (groupName: string) => {
    setOpenEditorGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const getTokenValue = React.useCallback(
    (tokenKey: SemanticToken): string | undefined => {
      if (vscodeOverrides.hasOverride(tokenKey)) {
        return vscodeOverrides.getValue(tokenKey);
      }
      const mappedKey = defaultTokenColorMap[tokenKey];
      return currentColors?.[mappedKey];
    },
    [vscodeOverrides.overrides, currentColors],
  );

  const getEditorColorValue = React.useCallback(
    (colorKey: string): string | undefined => {
      if (vscodeOverrides.hasOverride(colorKey as SemanticToken)) {
        return vscodeOverrides.getValue(colorKey as SemanticToken);
      }
      const mappedKey = editorColorMap[colorKey as keyof typeof editorColorMap];
      return currentColors?.[mappedKey];
    },
    [vscodeOverrides.overrides, currentColors],
  );

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
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="editor" className="relative">
              Editor Colors
              {searchQuery.trim() && hasEditorResults && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
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
                  <div className="p-3 space-y-3" key={overridesVersion}>
                    <p className="text-xs text-muted-foreground mb-3">
                      {group.description}
                    </p>
                    {group.tokens.map((token) => (
                      <VSCodeTokenInput
                        key={token.key}
                        tokenKey={token.key}
                        value={getTokenValue(token.key)}
                        onChange={handleTokenChange}
                        displayName={token.displayName}
                        description={token.description}
                      />
                    ))}
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
                  <div className="p-3 space-y-3" key={overridesVersion}>
                    <p className="text-xs text-muted-foreground mb-3">
                      {group.description}
                    </p>
                    {group.colors.map((color) => (
                      <VSCodeTokenInput
                        key={color.key}
                        tokenKey={color.key as SemanticToken}
                        value={getEditorColorValue(color.key)}
                        onChange={(key, value) =>
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
