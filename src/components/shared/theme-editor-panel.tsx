"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useThemeContext } from "@/providers/theme";
import type { FontInfo } from "@/types/fonts";
import { buildFontFamily } from "@/utils/fonts";
import {
  createInitialOpenGroups,
  createSkeletonGroups,
  hasValidColorTokens,
  organizeRealTokens,
} from "@/lib/theme-editor-utils";
import { TokenInput } from "./token-input";

declare global {
  interface Window {
    __TINTE_THEME__?: {
      theme: any;
      mode: string;
      tokens: Record<string, string>;
    };
  }
}

export function ThemeEditorPanel() {
  const { currentTokens, handleTokenEdit, mounted, currentMode } = useThemeContext();
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(createInitialOpenGroups);

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
    return !mounted || !hasValidColorTokens(currentTokens) 
      ? createSkeletonGroups() 
      : organizeRealTokens(currentTokens);
  }, [currentTokens, mounted]);



  return (
    <div className="flex flex-col h-full">
      <div className="px-1 pb-1">
        <h3 className="text-sm font-medium">
          Override Tokens ({currentMode})
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Fine-tune provider-specific design tokens
        </p>
      </div>

      <ScrollArea
        className="flex-1 min-h-0 pl-1 pr-3"
        showScrollIndicators={true}
        indicatorType="shadow"
      >
        <div className="space-y-4 py-2">
          <div className="space-y-4">
            {organizedTokens.map((group) => (
                <Collapsible
                  key={group.label}
                  open={openGroups[group.label]}
                  onOpenChange={() => toggleGroup(group.label)}
                >
                  <CollapsibleTrigger className={`flex w-full items-center justify-between uppercase ${openGroups[group.label] ? "rounded-t-md" : "rounded-md"} border border-border px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors`}>
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
                          const previousColorGroups = organizedTokens
                            .slice(0, organizedTokens.indexOf(group))
                            .filter(g => g.type === "color");
                          const previousColorCount = previousColorGroups.reduce(
                            (sum, g) => sum + g.tokens.length, 
                            0
                          );
                          colorNumber = previousColorCount + tokenIndex + 1;
                        }
                        
                        return (
                          <div key={key} className="space-y-1">
                            {group.type !== "shadow-properties" && (
                              <Label htmlFor={key} className="text-xs font-medium flex items-center gap-1">
                                {key.replace(/_/g, "-")}
                                {isColorInput && (
                                  <sup className="text-[10px] text-muted-foreground/60 font-mono">
                                    {colorNumber}
                                  </sup>
                                )}
                              </Label>
                            )}
                            <div>
                              <TokenInput
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
