"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ColorPickerInput } from "@/components/ui/color-picker-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberSlider } from "@/components/ui/number-slider";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ShadowPropertiesEditor } from "@/components/ui/shadow-properties-editor";
import { useThemeContext } from "@/providers/theme";
import type { FontInfo } from "@/types/fonts";
import {
  type BaseVarToken,
  DEFAULT_BASE,
  DEFAULT_FONTS,
  type FontToken,
  NON_COLOR_GROUPS,
  TOKEN_GROUPS,
} from "@/types/shadcn";
import { buildFontFamily } from "@/utils/fonts";
import { FontSelector } from "./font-selector";

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
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({});

  // Initialize all groups as open on first render
  React.useEffect(() => {
    const initialState: Record<string, boolean> = {};
    TOKEN_GROUPS.forEach((group) => {
      initialState[group.label] = true;
    });
    Object.keys(NON_COLOR_GROUPS).forEach((groupName) => {
      initialState[groupName] = groupName === "Fonts" || groupName === "Shadows";
    });
    setOpenGroups(initialState);
  }, []);

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
    const groups: Array<{
      label: string;
      tokens: Array<[string, string]>;
      type: "color" | "fonts" | "shadow" | "shadow-properties" | "base";
    }> = [];

    // Color token groups
    TOKEN_GROUPS.forEach((group) => {
      const tokens = group.keys
        .map((key) => [key, currentTokens[key]] as [string, string])
        .filter(
          ([_, value]) => typeof value === "string" && value.startsWith("#"),
        );

      if (tokens.length > 0) {
        groups.push({
          label: group.label,
          tokens,
          type: "color",
        });
      }
    });

    // Non-color token groups - add defaults if missing and display all
    Object.entries(NON_COLOR_GROUPS).forEach(([groupName, groupData]) => {
      if (Array.isArray(groupData)) {
        // Handle shadow properties as a special group
        if (groupName === "Shadows") {
          // Check if we have shadow properties with values
          const hasValidShadowData = groupData.some(key =>
            currentTokens[key] && typeof currentTokens[key] === "string" && currentTokens[key].trim().length > 0
          );

          if (hasValidShadowData) {
            groups.push({
              label: groupName,
              tokens: [["shadow-properties", "shadow-editor"]], // Special token for shadow editor
              type: "shadow-properties",
            });
          }
        } else {
          // Handle other groups (Fonts, etc.) normally
          const tokens = groupData
            .map((key) => {
              let value = currentTokens[key];
              if (!value || typeof value !== "string") {
                // Provide defaults for missing tokens
                if (groupName === "Fonts") {
                  value = DEFAULT_FONTS[key as FontToken] || "";
                }
              }
              return [key, value] as [string, string];
            })
            .filter(
              ([_, value]) =>
                typeof value === "string" && value.trim().length > 0,
            );

          if (tokens.length > 0) {
            groups.push({
              label: groupName,
              tokens,
              type: groupName === "Fonts" ? "fonts" : "base",
            });
          }
        }
      } else if (groupData.editable) {
        // Complex object like Radius or Tracking with editable fields
        const tokens = groupData.editable
          .map((key) => {
            let value = currentTokens[key];
            if (!value || typeof value !== "string") {
              // Provide defaults for missing base tokens
              value = DEFAULT_BASE[key as BaseVarToken] || "";
            }
            return [key, value] as [string, string];
          })
          .filter(
            ([_, value]) =>
              typeof value === "string" && value.trim().length > 0,
          );

        if (tokens.length > 0) {
          groups.push({
            label: groupName,
            tokens,
            type: "base",
          });
        }
      }
    });

    return groups;
  }, [currentTokens]);

  const totalTokens = organizedTokens.reduce(
    (sum, group) => sum + group.tokens.length,
    0,
  );

  // Check if we have immediate data available
  const hasImmediateData =
    typeof window !== "undefined" && window.__TINTE_THEME__ && mounted;


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
          {totalTokens === 0 && !hasImmediateData ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, groupIndex) => (
                <div key={`skeleton-group-${groupIndex}`} className="space-y-2">
                  <div className="h-4 bg-muted/50 rounded w-16"></div>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, tokenIndex) => (
                      <div
                        key={`skeleton-${groupIndex}-${tokenIndex}`}
                        className="space-y-1"
                      >
                        <div className="h-3 bg-muted/50 rounded w-20"></div>
                        <div className="h-9 bg-muted/30 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
                      {group.tokens.map(([key, value]) => {
                        return (
                          <div key={key} className="flex items-center gap-3">
                            <div className="flex-1 space-y-1">
                              {group.type !== "shadow-properties" && (
                                <Label htmlFor={key} className="text-xs font-medium">
                                  {key.replace(/_/g, "-")}
                                </Label>
                              )}
                              {group.type === "color" ? (
                                <ColorPickerInput
                                  color={value}
                                  onChange={(newValue) =>
                                    handleTokenEdit(key, newValue)
                                  }
                                />
                              ) : group.type === "fonts" ? (
                                <FontSelector
                                  value={value
                                    .split(",")[0]
                                    .trim()
                                    .replace(/['"]/g, "")}
                                  category={
                                    key.includes("sans")
                                      ? "sans-serif"
                                      : key.includes("serif")
                                        ? "serif"
                                        : key.includes("mono")
                                          ? "monospace"
                                          : "sans-serif"
                                  }
                                  onSelect={(font) => handleFontSelect(key, font)}
                                  placeholder="Select font..."
                                  className="h-7 text-xs"
                                />
                              ) : key === "radius" ? (
                                <NumberSlider
                                  value={parseFloat(value.replace(/px|rem|em/, "")) || 0}
                                  onChange={(newValue) =>
                                    handleTokenEdit(key, `${newValue}px`)
                                  }
                                  min={0}
                                  max={50}
                                  step={1}
                                  unit="px"
                                  className="mt-1"
                                />
                              ) : key === "letter-spacing" ? (
                                <NumberSlider
                                  value={parseFloat(value.replace(/px|rem|em/, "")) || 0}
                                  onChange={(newValue) =>
                                    handleTokenEdit(key, `${newValue}em`)
                                  }
                                  min={-0.5}
                                  max={1}
                                  step={0.01}
                                  unit="em"
                                  className="mt-1"
                                />
                              ) : group.type === "shadow-properties" ? (
                                <ShadowPropertiesEditor
                                  values={{
                                    "shadow-color": currentTokens["shadow-color"] || "",
                                    "shadow-opacity": currentTokens["shadow-opacity"] || "",
                                    "shadow-blur": currentTokens["shadow-blur"] || "",
                                    "shadow-spread": currentTokens["shadow-spread"] || "",
                                    "shadow-offset-x": currentTokens["shadow-offset-x"] || "",
                                    "shadow-offset-y": currentTokens["shadow-offset-y"] || "",
                                  }}
                                  onChange={handleTokenEdit}
                                  className="mt-1"
                                />
                              ) : (
                                <Input
                                  id={key}
                                  value={value}
                                  onChange={(e) =>
                                    handleTokenEdit(key, e.target.value)
                                  }
                                  className="h-7 text-xs font-mono"
                                  placeholder={
                                    group.type === "shadow"
                                      ? "Box shadow..."
                                      : group.type === "base"
                                        ? "CSS value..."
                                        : "Value..."
                                  }
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </div>
        <ScrollBar />
      </ScrollArea>
    </div>
  );
}
