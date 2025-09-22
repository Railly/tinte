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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useShadcnOverrides } from "@/components/workbench/tabs/overrides-tab/hooks/use-provider-overrides";
import {
  createInitialOpenGroups,
  createSkeletonGroups,
  hasValidColorTokens,
  organizeRealTokens,
} from "@/lib/theme-editor-utils";
import { convertTinteToShadcn } from "@/lib/providers/shadcn";
import { useThemeContext } from "@/providers/theme";
import type { FontInfo } from "@/types/fonts";
import { buildFontFamily } from "@/utils/fonts";

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
  const { currentTokens, mounted, currentMode, updateShadcnOverride, tinteTheme, shadcnOverride } = useThemeContext();
  const shadcnOverrides = useShadcnOverrides();
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() => ({
    'Backgrounds': true,
    'Text': true,
    'Accents': true,
    'Borders': true,
    'Charts': true,
    'Sidebar': true,
    'Fonts': true,
    'Border Radius': true,
    'Shadows': true,
    'Letter Spacing': true,
  }));

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleTokenEdit = React.useCallback(
    (key: string, value: string) => {
      const currentOverrides = shadcnOverride || {};
      const currentModeOverrides = currentOverrides.palettes?.[currentMode] || {};

      // Determine which section this key belongs to
      if (key === 'radius') {
        // Handle radius - update the entire override structure
        const updatedOverrides = {
          ...currentOverrides,
          radius: value
        };
        updateShadcnOverride(updatedOverrides);
      } else if (key === 'letter-spacing') {
        // Handle letter spacing
        const updatedOverrides = {
          ...currentOverrides,
          letter_spacing: value
        };
        updateShadcnOverride(updatedOverrides);
      } else if (key.includes('sans') || key.includes('serif') || key.includes('mono')) {
        // Handle fonts - update the entire override structure
        const currentFonts = currentOverrides.fonts || {};
        const updatedOverrides = {
          ...currentOverrides,
          fonts: {
            ...currentFonts,
            [key]: value
          }
        };
        updateShadcnOverride(updatedOverrides);
      } else if (key.includes('shadow-')) {
        // Handle shadow properties
        const shadowKey = key.replace('shadow-', '').replace('-', '_');
        const currentShadow = currentOverrides.shadow || {};
        const updatedOverrides = {
          ...currentOverrides,
          shadow: {
            ...currentShadow,
            [shadowKey]: value
          }
        };
        updateShadcnOverride(updatedOverrides);
      } else {
        // Handle palette colors
        const currentPalettes = currentOverrides.palettes || { light: {}, dark: {} };
        const updatedOverrides = {
          ...currentOverrides,
          palettes: {
            ...currentPalettes,
            [currentMode]: {
              ...currentModeOverrides,
              [key]: value
            }
          }
        };
        updateShadcnOverride(updatedOverrides);
      }
    },
    [shadcnOverride, currentMode, updateShadcnOverride],
  );

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

    // Debug logging
    console.log("🔍 ShadcnOverridesPanel Debug:");
    console.log("shadcnOverride from context:", shadcnOverride);
    console.log("currentOverrides:", currentOverrides);
    console.log("currentMode:", currentMode);
    console.log("tinteTheme:", tinteTheme);

    const groups: Array<{
      label: string;
      tokens: Array<[string, string]>;
      type: "color" | "fonts" | "shadow" | "shadow-properties" | "base";
    }> = [];

    // Get default palette from the current canonical theme conversion
    const getDefaultPalette = () => {
      if (!tinteTheme) {
        // Fallback defaults if no tinte theme is available
        return currentMode === 'light' ? {
          background: "#ffffff",
          foreground: "#09090b",
          card: "#ffffff",
          "card-foreground": "#09090b",
          popover: "#ffffff",
          "popover-foreground": "#09090b",
          primary: "#18181b",
          "primary-foreground": "#fafafa",
          secondary: "#f4f4f5",
          "secondary-foreground": "#18181b",
          muted: "#f4f4f5",
          "muted-foreground": "#71717a",
          accent: "#f4f4f5",
          "accent-foreground": "#18181b",
          destructive: "#ef4444",
          "destructive-foreground": "#fafafa",
          border: "#e4e4e7",
          input: "#e4e4e7",
          ring: "#18181b",
          "chart-1": "#e60049",
          "chart-2": "#0bb4ff",
          "chart-3": "#50e991",
          "chart-4": "#e6d800",
          "chart-5": "#9b19f5",
          sidebar: "#f8fafc",
          "sidebar-foreground": "#0f172a",
          "sidebar-primary": "#0f172a",
          "sidebar-primary-foreground": "#f8fafc",
          "sidebar-accent": "#f1f5f9",
          "sidebar-accent-foreground": "#0f172a",
          "sidebar-border": "#e2e8f0",
          "sidebar-ring": "#0f172a"
        } : {
          background: "#09090b",
          foreground: "#fafafa",
          card: "#09090b",
          "card-foreground": "#fafafa",
          popover: "#09090b",
          "popover-foreground": "#fafafa",
          primary: "#fafafa",
          "primary-foreground": "#09090b",
          secondary: "#27272a",
          "secondary-foreground": "#fafafa",
          muted: "#27272a",
          "muted-foreground": "#a1a1aa",
          accent: "#27272a",
          "accent-foreground": "#fafafa",
          destructive: "#ef4444",
          "destructive-foreground": "#fafafa",
          border: "#27272a",
          input: "#27272a",
          ring: "#d4d4d8",
          sidebar: "#020817",
          "sidebar-foreground": "#f8fafc",
          "sidebar-primary": "#f8fafc",
          "sidebar-primary-foreground": "#020817",
          "sidebar-accent": "#1e293b",
          "sidebar-accent-foreground": "#f8fafc",
          "sidebar-border": "#334155",
          "sidebar-ring": "#f8fafc"
        };
      }

      // Convert the current canonical theme to shadcn palette
      const convertedShadcn = convertTinteToShadcn(tinteTheme);
      return convertedShadcn[currentMode];
    };

    // Get extrapolated palette from canonical theme as baseline
    const extrapolatedPalette = getDefaultPalette();

    // Handle palette tokens (colors) - always merge DB values with extrapolated values
    let dbPalette = {};

    if (currentOverrides.palettes?.[currentMode]) {
      // New schema format: overrides.palettes.light/dark
      dbPalette = currentOverrides.palettes[currentMode];
      console.log("Found DB palette in new schema format for", currentMode);
    } else if (currentOverrides[currentMode]?.palettes?.[currentMode]) {
      // Legacy format: overrides.light/dark.palettes.light/dark
      dbPalette = currentOverrides[currentMode].palettes[currentMode];
      console.log("Found DB palette in legacy schema format for", currentMode);
    } else if (currentOverrides[currentMode]?.palettes) {
      // Direct mode format with palettes nested
      dbPalette = currentOverrides[currentMode].palettes[currentMode] || {};
      console.log("Found DB palette in direct mode format for", currentMode);
    }

    // Always merge: extrapolated as base, then override with DB values
    const currentPalette = {
      ...extrapolatedPalette,
      ...dbPalette
    };

    console.log("Extrapolated palette:", extrapolatedPalette);
    console.log("DB palette override:", dbPalette);
    console.log("Final merged palette for", currentMode, ":", currentPalette);

    // Group palette tokens by category - always show all groups
    const backgroundGroup: Array<[string, string]> = [];
    const borderGroup: Array<[string, string]> = [];
    const textGroup: Array<[string, string]> = [];
    const accentGroup: Array<[string, string]> = [];
    const chartGroup: Array<[string, string]> = [];
    const sidebarGroup: Array<[string, string]> = [];

    Object.entries(currentPalette).forEach(([key, value]) => {
      if (typeof value === 'string') {
        if (key.includes('background') || key.includes('card') || key.includes('popover') || key.includes('muted')) {
          backgroundGroup.push([key, value] as [string, string]);
        } else if (key.includes('border') || key.includes('input') || key.includes('ring')) {
          borderGroup.push([key, value] as [string, string]);
        } else if (key.includes('foreground') || key === 'foreground') {
          textGroup.push([key, value] as [string, string]);
        } else if (key.includes('primary') || key.includes('secondary') || key.includes('accent') || key.includes('destructive')) {
          accentGroup.push([key, value] as [string, string]);
        } else if (key.includes('chart')) {
          chartGroup.push([key, value] as [string, string]);
        } else if (key.includes('sidebar')) {
          sidebarGroup.push([key, value] as [string, string]);
        }
      }
    });

    // Always add all groups (they should have content now from extrapolated palette)
    groups.push({ label: 'Backgrounds', tokens: backgroundGroup, type: 'color' });
    groups.push({ label: 'Text', tokens: textGroup, type: 'color' });
    groups.push({ label: 'Accents', tokens: accentGroup, type: 'color' });
    groups.push({ label: 'Borders', tokens: borderGroup, type: 'color' });
    groups.push({ label: 'Charts', tokens: chartGroup, type: 'color' });
    groups.push({ label: 'Sidebar', tokens: sidebarGroup, type: 'color' });

    // Handle fonts - provide defaults
    const defaultFonts = {
      sans: "ui-sans-serif, system-ui, sans-serif",
      serif: "ui-serif, Georgia, serif",
      mono: "ui-monospace, monospace"
    };

    // Check different override structures for fonts
    const fonts = currentOverrides.fonts ||
                  currentOverrides[currentMode]?.fonts ||
                  defaultFonts;

    console.log("Fonts for", currentMode, ":", fonts);
    const fontTokens = Object.entries(fonts)
      .filter(([_, value]) => typeof value === 'string' && value.trim().length > 0)
      .map(([key, value]) => [key, value] as [string, string]);

    // Always show fonts group
    groups.push({ label: 'Fonts', tokens: fontTokens, type: 'fonts' });

    // Handle radius - provide default
    const radius = currentOverrides.radius ||
                   currentOverrides[currentMode]?.radius ||
                   "0.5rem";

    console.log("Radius for", currentMode, ":", radius);
    // Always show radius group
    groups.push({
      label: 'Border Radius',
      tokens: [['radius', String(radius)]],
      type: 'base'
    });

    // Handle shadow properties - provide defaults
    const defaultShadow = {
      color: "0 0 0",
      opacity: "0.1",
      blur: "3px",
      spread: "0px",
      offset_x: "0px",
      offset_y: "1px"
    };
    const shadow = currentOverrides.shadow ||
                   currentOverrides[currentMode]?.shadow ||
                   defaultShadow;

    console.log("Shadow for", currentMode, ":", shadow);
    // Always show shadows group
    groups.push({
      label: 'Shadows',
      tokens: [['shadow-properties', 'shadow-editor']],
      type: 'shadow-properties'
    });

    // Handle letter spacing - provide default
    const letterSpacing = currentOverrides.letter_spacing ||
                          currentOverrides[currentMode]?.letter_spacing ||
                          "0em";

    console.log("Letter spacing for", currentMode, ":", letterSpacing);
    // Always show letter spacing group
    groups.push({
      label: 'Letter Spacing',
      tokens: [['letter-spacing', String(letterSpacing)]],
      type: 'base'
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
                                  ? {
                                      "shadow-color": (shadcnOverride?.shadow || shadcnOverride?.[currentMode]?.shadow)?.color || "0 0 0",
                                      "shadow-opacity": (shadcnOverride?.shadow || shadcnOverride?.[currentMode]?.shadow)?.opacity || "0.1",
                                      "shadow-blur": (shadcnOverride?.shadow || shadcnOverride?.[currentMode]?.shadow)?.blur || "3px",
                                      "shadow-spread": (shadcnOverride?.shadow || shadcnOverride?.[currentMode]?.shadow)?.spread || "0px",
                                      "shadow-offset-x": (shadcnOverride?.shadow || shadcnOverride?.[currentMode]?.shadow)?.offset_x || "0px",
                                      "shadow-offset-y": (shadcnOverride?.shadow || shadcnOverride?.[currentMode]?.shadow)?.offset_y || "1px",
                                    }
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
