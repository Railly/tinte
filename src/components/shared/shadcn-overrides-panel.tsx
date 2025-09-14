"use client";

import { ChevronDown, Info } from "lucide-react";
import * as React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useShadcnOverrides } from "@/hooks/use-provider-overrides";
import {
  createInitialOpenGroups,
  createSkeletonGroups,
  hasValidColorTokens,
  organizeRealTokens,
} from "@/lib/theme-editor-utils";
import { useThemeContext } from "@/providers/theme";
import type { FontInfo } from "@/types/fonts";
import { buildFontFamily } from "@/utils/fonts";
import { EnhancedTokenInput } from "./enhanced-token-input";
import { TokenSearch } from "./token-search";

declare global {
  interface Window {
    __TINTE_THEME__?: {
      theme: any;
      mode: string;
      tokens: Record<string, string>;
    };
  }
}

interface ShadcnOverridesPanelProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
}

export function ShadcnOverridesPanel({
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search tokens...",
}: ShadcnOverridesPanelProps) {
  const { currentTokens, handleTokenEdit, mounted, currentMode } =
    useThemeContext();
  const shadcnOverrides = useShadcnOverrides();
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    createInitialOpenGroups,
  );

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleFontSelect = React.useCallback(
    (key: string, font: FontInfo) => {
      const fontCategory = key.includes("sans")
        ? "sans-serif"
        : key.includes("serif")
          ? "serif"
          : key.includes("mono")
            ? "monospace"
            : "sans-serif";
      const fontValue = buildFontFamily(font.family, fontCategory);
      handleTokenEdit(key, fontValue);
    },
    [handleTokenEdit],
  );

  // Organize tokens by groups for better UI
  const organizedTokens = React.useMemo(() => {
    if (!mounted || !hasValidColorTokens(currentTokens)) {
      return createSkeletonGroups();
    }

    // Use the standardized override system to merge tokens
    const mergedTokens = shadcnOverrides.getMergedTokens(currentTokens);
    return organizeRealTokens(mergedTokens);
  }, [currentTokens, mounted, shadcnOverrides]);

  // Filter tokens based on search query
  const filteredTokens = React.useMemo(() => {
    if (!searchQuery.trim()) return organizedTokens;

    return organizedTokens
      .map((group) => {
        const filteredGroupTokens = group.tokens.filter(
          ([key]) =>
            key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            key
              .replace(/_/g, "-")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );

        return {
          ...group,
          tokens: filteredGroupTokens,
        };
      })
      .filter((group) => group.tokens.length > 0);
  }, [organizedTokens, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-1 pb-2">
        <h3 className="text-sm font-medium flex items-center gap-1">
          Override Tokens
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3 h-3 text-muted-foreground/60 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Fine-tune provider-specific design tokens
              </p>
            </TooltipContent>
          </Tooltip>
        </h3>
      </div>

      {onSearchChange && (
        <div className="pr-3 pl-1 pb-2 flex-shrink-0">
          <TokenSearch
            placeholder={searchPlaceholder}
            onSearch={onSearchChange}
            value={searchQuery}
          />
        </div>
      )}

      <ScrollArea
        className="flex-1 min-h-0 pl-1 pr-3"
        showScrollIndicators={true}
        indicatorType="shadow"
      >
        <div className="space-y-4 pb-2">
          <div className="space-y-4">
            {filteredTokens.map((group) => (
              <Collapsible
                key={group.label}
                open={openGroups[group.label]}
                onOpenChange={() => toggleGroup(group.label)}
              >
                <CollapsibleTrigger
                  className={`flex w-full items-center justify-between uppercase ${openGroups[group.label] ? "rounded-t-md" : "rounded-md"} border border-border px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors`}
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openGroups[group.label] ? "rotate-180" : ""}`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="border border-t-0 border-border rounded-b-md bg-muted/20">
                  <div className="p-3 space-y-3">
                    {group.tokens.map(([key, value], tokenIndex) => {
                      const isColorInput = group.type === "color";
                      let colorNumber = 0;
                      if (isColorInput) {
                        // Calculate the color number based on position across all color groups
                        const previousColorGroups = filteredTokens
                          .slice(0, filteredTokens.indexOf(group))
                          .filter((g) => g.type === "color");
                        const previousColorCount = previousColorGroups.reduce(
                          (sum, g) => sum + g.tokens.length,
                          0,
                        );
                        colorNumber = previousColorCount + tokenIndex + 1;
                      }

                      return (
                        <div key={key} className="space-y-1">
                          {group.type !== "shadow-properties" && (
                            <Label
                              htmlFor={key}
                              className="text-xs font-medium flex items-center gap-1"
                            >
                              {key.replace(/_/g, "-")}
                              {isColorInput && (
                                <sup className="text-[10px] text-muted-foreground/60 font-mono">
                                  {colorNumber}
                                </sup>
                              )}
                            </Label>
                          )}
                          <div>
                            <EnhancedTokenInput
                              group={group}
                              tokenKey={key}
                              value={value}
                              currentTokens={currentTokens}
                              onEdit={handleTokenEdit}
                              onFontSelect={handleFontSelect}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
        <ScrollBar />
      </ScrollArea>
    </div>
  );
}
