"use client";

import { ChevronDown, Wand2 } from "lucide-react";
import * as React from "react";
import { CanonicalColorInput } from "@/components/shared/canonical-color-input";
import { TailwindIcon } from "@/components/shared/icons/tailwind";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ColorPickerInput } from "@/components/ui/color-picker-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  generateFullNeutralRamp,
  getAllNeutralKeys,
  isNeutralGroup,
} from "@/lib/canonical-ramp-utils";
import {
  COLOR_GROUPS,
  createCanonicalSkeletons,
  createInitialCanonicalGroups,
  hasValidTinteColors,
} from "@/lib/canonical-utils";
import { generateTailwindPalette } from "@/lib/ice-theme";
import { useThemeContext } from "@/providers/theme";
import type { TinteBlock } from "@/types/tinte";

export function CanonicalTab() {
  const { tinteTheme, updateTinteTheme, currentMode, mounted, activeTheme } =
    useThemeContext();
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    createInitialCanonicalGroups,
  );
  const [neutralRampMode, setNeutralRampMode] = React.useState(false);
  const [neutralRampColor, setNeutralRampColor] = React.useState("");

  // Persist neutral ramp state per theme
  const storageKey = `tinte-neutral-ramp-${activeTheme.name}`;

  React.useEffect(() => {
    if (mounted) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const { mode, color } = JSON.parse(stored);
          setNeutralRampMode(mode);
          setNeutralRampColor(color);
        } catch {
          // Invalid stored data, ignore
        }
      } else {
        // Reset state for new theme
        setNeutralRampMode(false);
        setNeutralRampColor("");
      }
    }
  }, [mounted, storageKey]);

  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          mode: neutralRampMode,
          color: neutralRampColor,
        }),
      );
    }
  }, [neutralRampMode, neutralRampColor, mounted, storageKey]);

  // Determine if we should show skeletons or real data
  const currentColors = tinteTheme?.[currentMode];
  const shouldShowSkeletons = !mounted || !hasValidTinteColors(currentColors);
  const groupsToRender = shouldShowSkeletons
    ? createCanonicalSkeletons()
    : COLOR_GROUPS;

  const handleColorChange = (key: keyof TinteBlock, value: string) => {
    updateTinteTheme(currentMode, { [key]: value });
  };

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleNeutralRampChange = (color: string) => {
    setNeutralRampColor(color);
    const rampColors = generateFullNeutralRamp(color, currentMode);
    updateTinteTheme(currentMode, rampColors);
  };

  const generateNeutralRampFromExisting = () => {
    const neutralKeys = getAllNeutralKeys();
    const existingColor = currentColors?.[neutralKeys[0]];

    if (existingColor) {
      handleNeutralRampChange(existingColor);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-1 pb-2">
        <div>
          <h3 className="text-sm font-medium">
            Canonical Colors ({currentMode})
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Edit the source colors that generate all theme variants
          </p>
        </div>
      </div>

      <ScrollArea
        className="flex-1 min-h-0 pl-1 pr-3"
        showScrollIndicators={true}
        indicatorType="shadow"
      >
        <div className="space-y-4 pb-2">
          {/* Render Accents group first */}
          {groupsToRender
            .filter((group) => group.label === "Accents")
            .map((group) => (
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
                    {group.keys.map((key, tokenIndex) => {
                      // Calculate the color number based on position across all color groups
                      const previousColorGroups = COLOR_GROUPS.slice(
                        0,
                        COLOR_GROUPS.findIndex((g) => g.label === group.label),
                      ).filter((g) => g.keys.length > 0);
                      const previousColorCount = previousColorGroups.reduce(
                        (sum, g) => sum + g.keys.length,
                        0,
                      );
                      const colorNumber = previousColorCount + tokenIndex + 1;

                      const isNeutral = isNeutralGroup(group.label);
                      const isOverridden = neutralRampMode && isNeutral;

                      return (
                        <div key={key} className="space-y-1">
                          <Label
                            htmlFor={key}
                            className={`text-xs font-medium flex items-center gap-1 ${isOverridden ? "text-muted-foreground" : ""}`}
                          >
                            {key.replace(/_/g, "-")}
                            <sup className="text-[10px] text-muted-foreground/60 font-mono">
                              {colorNumber}
                            </sup>
                            {isOverridden && (
                              <span className="text-[10px] text-orange-500">
                                (auto)
                              </span>
                            )}
                          </Label>
                          <CanonicalColorInput
                            group={group}
                            colorKey={key}
                            value={currentColors?.[key]}
                            onChange={handleColorChange}
                            disabled={isOverridden}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

          {/* Neutral Ramp Generator Section */}
          <div className="border border-border rounded-md bg-muted/10">
            <div className="p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={neutralRampMode}
                  onCheckedChange={setNeutralRampMode}
                />
                <Label className="text-xs font-medium flex items-center gap-1">
                  <Wand2 className="h-3 w-3" />
                  Generate neutral ramp
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-generate harmonious background, interface, and text colors
                from a single base color
              </p>
              {neutralRampMode && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-2 flex-1">
                    <div className="flex-1">
                      <ColorPickerInput
                        color={
                          neutralRampColor || currentColors?.bg || "#64748b"
                        }
                        onChange={handleNeutralRampChange}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-10 w-10 p-0 flex items-center justify-center"
                          title="Generate Tailwind palette from current color"
                        >
                          <TailwindIcon className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        {(() => {
                          const currentColor =
                            neutralRampColor || currentColors?.bg || "#64748b";
                          const palette = generateTailwindPalette(currentColor);
                          return palette.map((color) => {
                            const isSelected = color.value === currentColor;

                            return (
                              <DropdownMenuItem
                                key={color.name}
                                onClick={() =>
                                  handleNeutralRampChange(color.value)
                                }
                                className="flex items-center gap-2"
                              >
                                <div
                                  className={`w-4 h-4 rounded border ${isSelected ? "border-foreground border-2" : "border-border"}`}
                                  style={{ backgroundColor: color.value }}
                                />
                                <span className="font-mono text-xs">
                                  {color.name}
                                </span>
                                <span className="ml-auto text-xs text-muted-foreground font-mono">
                                  {color.value}
                                </span>
                              </DropdownMenuItem>
                            );
                          });
                        })()}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateNeutralRampFromExisting}
                    title="Generate from existing colors"
                  >
                    <Wand2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Render remaining groups (Background, Interface, Text) */}
          {groupsToRender
            .filter((group) => group.label !== "Accents")
            .map((group) => (
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
                    {group.keys.map((key, tokenIndex) => {
                      // Calculate the color number based on position across all color groups
                      const previousColorGroups = COLOR_GROUPS.slice(
                        0,
                        COLOR_GROUPS.findIndex((g) => g.label === group.label),
                      ).filter((g) => g.keys.length > 0);
                      const previousColorCount = previousColorGroups.reduce(
                        (sum, g) => sum + g.keys.length,
                        0,
                      );
                      const colorNumber = previousColorCount + tokenIndex + 1;

                      const isNeutral = isNeutralGroup(group.label);
                      const isOverridden = neutralRampMode && isNeutral;

                      return (
                        <div key={key} className="space-y-1">
                          <Label
                            htmlFor={key}
                            className={`text-xs font-medium flex items-center gap-1 ${isOverridden ? "text-muted-foreground" : ""}`}
                          >
                            {key.replace(/_/g, "-")}
                            <sup className="text-[10px] text-muted-foreground/60 font-mono">
                              {colorNumber}
                            </sup>
                            {isOverridden && (
                              <span className="text-[10px] text-orange-500">
                                (auto)
                              </span>
                            )}
                          </Label>
                          <CanonicalColorInput
                            group={group}
                            colorKey={key}
                            value={currentColors?.[key]}
                            onChange={handleColorChange}
                            disabled={isOverridden}
                          />
                        </div>
                      );
                    })}
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
