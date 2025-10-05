"use client";

import { ChevronDown, Info } from "lucide-react";
import * as React from "react";
import { EnhancedTokenInput } from "@/components/shared/enhanced-token-input";
import { TokenSearch } from "@/components/shared/token-search";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useClearOverrides } from "@/components/workbench/tabs/overrides-tab/hooks/use-clear-overrides";
import { useShadcnOverrides } from "@/components/workbench/tabs/overrides-tab/hooks/use-provider-overrides";
import { convertTinteToShadcn } from "@/lib/providers/shadcn";
import { getShadcnPaletteWithOverrides } from "@/lib/shadcn-theme-utils";
import { createSkeletonGroups } from "@/lib/theme-editor-utils";
import { useThemeContext } from "@/providers/theme";
import type { FontInfo } from "@/types/fonts";
import { buildFontFamily } from "@/utils/fonts";
import { ClearOverridesAlert } from "./clear-overrides-alert";

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
  const {
    currentTokens,
    mounted,
    currentMode,
    updateShadcnOverride,
    tinteTheme,
    shadcnOverride,
    activeTheme,
  } = useThemeContext();
  const shadcnOverrides = useShadcnOverrides();
  const clearOverrides = useClearOverrides({
    provider: "shadcn",
    providerHook: shadcnOverrides,
    providerDisplayName: "shadcn",
  });
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => ({
      Backgrounds: true,
      Text: true,
      Accents: true,
      Borders: true,
      Charts: true,
      Sidebar: true,
      Fonts: true,
      "Border Radius": true,
      Shadows: true,
      "Letter Spacing": true,
    }),
  );

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleTokenEdit = React.useCallback(
    (key: string, value: string) => {
      const currentOverrides = shadcnOverride || {};
      const _currentModePalette =
        currentOverrides.palettes?.[currentMode] || {};

      // Determine which section this key belongs to
      if (key === "radius" || key.startsWith("radius-")) {
        // Handle radius - update the entire override structure
        if (key === "radius") {
          // Legacy single radius value
          const updatedOverrides = {
            ...currentOverrides,
            radius: value,
          };
          updateShadcnOverride(updatedOverrides);
        } else {
          // AI format radius object (radius-sm, radius-md, etc.)
          const radiusKey = key.replace("radius-", "");
          const currentRadius = currentOverrides.radius || {};
          const updatedOverrides = {
            ...currentOverrides,
            radius: {
              ...(typeof currentRadius === "object" ? currentRadius : {}),
              [radiusKey]: value,
            },
          };
          updateShadcnOverride(updatedOverrides);
        }
      } else if (key === "letter-spacing") {
        // Handle letter spacing
        const updatedOverrides = {
          ...currentOverrides,
          letter_spacing: value,
        };
        updateShadcnOverride(updatedOverrides);
      } else if (
        key.includes("sans") ||
        key.includes("serif") ||
        key.includes("mono")
      ) {
        // Handle fonts - update the entire override structure
        const currentFonts = currentOverrides.fonts || {};
        const updatedOverrides = {
          ...currentOverrides,
          fonts: {
            ...currentFonts,
            [key]: value,
          },
        };
        updateShadcnOverride(updatedOverrides);
      } else if (key.includes("shadow-")) {
        // Handle shadow properties - save to palettes.{mode}.shadow (DB schema)
        let shadowKey = key.replace("shadow-", "");

        // Map to DB schema property names (snake_case)
        if (shadowKey === "offset-x") shadowKey = "offset_x";
        if (shadowKey === "offset-y") shadowKey = "offset_y";

        const currentPalettes = currentOverrides.palettes || {
          light: {},
          dark: {},
        };
        const currentModePalette = currentPalettes[currentMode] || {};
        const currentModeShadow = currentModePalette.shadow || {};

        const updatedOverrides = {
          ...currentOverrides,
          palettes: {
            ...currentPalettes,
            [currentMode]: {
              ...currentModePalette,
              shadow: {
                ...currentModeShadow,
                [shadowKey]: value,
              },
            },
          },
        };

        updateShadcnOverride(updatedOverrides);
      } else {
        // Handle palette colors - save to palettes.{mode} (DB schema)
        const currentPalettes = currentOverrides.palettes || {
          light: {},
          dark: {},
        };
        const currentModePalette = currentPalettes[currentMode] || {};

        const updatedOverrides = {
          ...currentOverrides,
          palettes: {
            ...currentPalettes,
            [currentMode]: {
              ...currentModePalette,
              [key]: value,
            },
          },
        };
        updateShadcnOverride(updatedOverrides);
      }
    },
    [shadcnOverride, currentMode, updateShadcnOverride],
  );

  const shadowFromDB = shadcnOverride?.palettes?.[currentMode]?.shadow;

  const shadowTokens = {
    "shadow-color": shadowFromDB?.color || "0 0 0",
    "shadow-opacity": shadowFromDB?.opacity || "0.1",
    "shadow-blur": shadowFromDB?.blur || "3px",
    "shadow-spread": shadowFromDB?.spread || "0px",
    "shadow-offset-x": shadowFromDB?.offset_x || "0px",
    "shadow-offset-y": shadowFromDB?.offset_y || "1px",
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
    if (!mounted) {
      return createSkeletonGroups();
    }

    // Get the current shadcn override data directly from theme context
    const currentOverrides = shadcnOverride || {};

    const groups: Array<{
      label: string;
      tokens: Array<[string, string]>;
      type: "color" | "fonts" | "shadow" | "shadow-properties" | "base";
    }> = [];

    // Get extrapolated palette from canonical theme as baseline
    const extrapolatedPalette = getShadcnPaletteWithOverrides(
      tinteTheme,
      currentMode,
      shadcnOverride,
    );

    // Handle palette tokens (colors) - read from palettes.{mode} (DB schema)
    const dbPalette = currentOverrides.palettes?.[currentMode] || {};

    // Always merge: extrapolated as base, then override with DB values
    const currentPalette = {
      ...extrapolatedPalette,
      ...dbPalette,
    };

    // Group palette tokens by category - always show all groups
    const backgroundGroup: Array<[string, string]> = [];
    const borderGroup: Array<[string, string]> = [];
    const textGroup: Array<[string, string]> = [];
    const accentGroup: Array<[string, string]> = [];
    const chartGroup: Array<[string, string]> = [];
    const sidebarGroup: Array<[string, string]> = [];

    Object.entries(currentPalette).forEach(([key, value]) => {
      if (typeof value === "string") {
        if (
          key.includes("background") ||
          key.includes("card") ||
          key.includes("popover") ||
          key.includes("muted")
        ) {
          backgroundGroup.push([key, value] as [string, string]);
        } else if (
          key.includes("border") ||
          key.includes("input") ||
          key.includes("ring")
        ) {
          borderGroup.push([key, value] as [string, string]);
        } else if (key.includes("foreground") || key === "foreground") {
          textGroup.push([key, value] as [string, string]);
        } else if (
          key.includes("primary") ||
          key.includes("secondary") ||
          key.includes("accent") ||
          key.includes("destructive")
        ) {
          accentGroup.push([key, value] as [string, string]);
        } else if (key.includes("chart")) {
          chartGroup.push([key, value] as [string, string]);
        } else if (key.includes("sidebar")) {
          sidebarGroup.push([key, value] as [string, string]);
        }
      }
    });

    // Always add all groups (they should have content now from extrapolated palette)
    groups.push({
      label: "Backgrounds",
      tokens: backgroundGroup,
      type: "color",
    });
    groups.push({ label: "Text", tokens: textGroup, type: "color" });
    groups.push({ label: "Accents", tokens: accentGroup, type: "color" });
    groups.push({ label: "Borders", tokens: borderGroup, type: "color" });
    groups.push({ label: "Charts", tokens: chartGroup, type: "color" });
    groups.push({ label: "Sidebar", tokens: sidebarGroup, type: "color" });

    // Handle fonts - provide defaults
    const defaultFonts = {
      sans: "ui-sans-serif, system-ui, sans-serif",
      serif: "ui-serif, Georgia, serif",
      mono: "ui-monospace, monospace",
    };

    // Fonts are top-level in DB schema
    const fonts = currentOverrides.fonts || defaultFonts;

    const fontTokens = Object.entries(fonts)
      .filter(
        ([_, value]) => typeof value === "string" && value.trim().length > 0,
      )
      .map(([key, value]) => [key, value] as [string, string]);

    // Always show fonts group
    groups.push({ label: "Fonts", tokens: fontTokens, type: "fonts" });

    // Radius is top-level in DB schema
    const radius = currentOverrides.radius || "0.5rem";

    // Handle radius - check if it's an object (AI format) or string (legacy format)
    let radiusTokens;
    if (typeof radius === "object" && radius !== null) {
      // AI format: { sm: "0.125rem", md: "0.25rem", lg: "0.5rem", xl: "0.75rem" }
      radiusTokens = Object.entries(radius).map(([key, value]) => [
        `radius-${key}`,
        String(value),
      ]);
    } else {
      // Legacy format: single radius value
      radiusTokens = [["radius", String(radius)]];
    }

    // Always show radius group
    groups.push({
      label: "Border Radius",
      tokens: radiusTokens as [string, string][],
      type: "base",
    });

    // Shadows are in palettes.{mode}.shadow (handled by shadow editor directly)
    groups.push({
      label: "Shadows",
      tokens: [["shadow-properties", "shadow-editor"]],
      type: "shadow-properties",
    });

    // Letter spacing is top-level in DB schema
    const letterSpacing = currentOverrides.letter_spacing || "0em";

    // Always show letter spacing group
    groups.push({
      label: "Letter Spacing",
      tokens: [["letter-spacing", String(letterSpacing)]],
      type: "base",
    });

    return groups;
  }, [mounted, shadcnOverride, currentMode, tinteTheme]);

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
          {/* Clear Overrides Alert */}
          {clearOverrides.hasOverrides &&
            activeTheme?.id?.startsWith("theme_") && (
              <ClearOverridesAlert
                providerDisplayName="shadcn"
                isClearing={clearOverrides.isClearing}
                onClear={clearOverrides.handleClearOverrides}
              />
            )}

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
                              currentTokens={
                                group.type === "shadow-properties"
                                  ? shadowTokens
                                  : currentTokens
                              }
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
