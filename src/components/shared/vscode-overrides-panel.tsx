"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";
import { VSCodeTokenInput } from "@/components/shared/vscode-token-input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  createInitialVSCodeTokenGroups,
  createVSCodeTokenSkeletons,
  VSCODE_TOKEN_GROUPS,
} from "@/lib/vscode-token-utils";
import { useThemeContext } from "@/providers/theme";
import { useVSCodeOverrides } from "@/providers/vscode-overrides";
import type { SemanticToken, TokenColorMap } from "@/lib/providers/vscode";

export function VSCodeOverridesPanel() {
  const { tinteTheme, currentMode, mounted } = useThemeContext();
  const { overrides: tokenOverrides, setOverride } = useVSCodeOverrides();
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    createInitialVSCodeTokenGroups,
  );

  // Determine if we should show skeletons or real data
  const currentColors = tinteTheme?.[currentMode];
  const shouldShowSkeletons = !mounted || Object.keys(tokenOverrides).length === 0;
  const groupsToRender = shouldShowSkeletons
    ? createVSCodeTokenSkeletons()
    : VSCODE_TOKEN_GROUPS;

  const handleTokenChange = (tokenKey: SemanticToken, value: string) => {
    setOverride(tokenKey, value);
  };

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // Get the current token value (either from overrides or default mapping)
  const getTokenValue = (tokenKey: SemanticToken): string | undefined => {
    if (tokenOverrides[tokenKey]) {
      return tokenOverrides[tokenKey];
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
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-1 pb-3">
        <h3 className="text-sm font-medium">
          VS Code Token Colors ({currentMode})
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Override individual syntax highlighting colors for VS Code themes
        </p>
      </div>

      <ScrollArea
        className="flex-1 min-h-0 pl-1 pr-3"
        showScrollIndicators={true}
        indicatorType="shadow"
      >
        <div className="space-y-4 pb-2">
          {groupsToRender.map((group) => (
            <Collapsible
              key={group.label}
              open={openGroups[group.label]}
              onOpenChange={() => toggleGroup(group.label)}
            >
              <CollapsibleTrigger
                className={`flex w-full items-center justify-between uppercase ${
                  openGroups[group.label] ? "rounded-t-md" : "rounded-md"
                } border border-border px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors`}
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openGroups[group.label] ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="border border-t-0 border-border rounded-b-md bg-muted/20">
                <div className="p-3 space-y-3">
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
        <ScrollBar />
      </ScrollArea>
    </div>
  );
}