"use client";

import { ChevronDown, Info } from "lucide-react";
import * as React from "react";
import { TailwindIcon } from "@/components/shared/icons/tailwind";
import InvertedLogo from "@/components/shared/inverted-logo";
import { TokenSearch } from "@/components/shared/token-search";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useClearOverrides } from "@/components/workbench/tabs/overrides-tab/hooks/use-clear-overrides";
import { useZedOverrides } from "@/components/workbench/tabs/overrides-tab/hooks/use-provider-overrides";
import { generateTailwindPalette } from "@/lib/ice-theme";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme";
import type { TinteBlock } from "@/types/tinte";
import { ClearOverridesAlert } from "./clear-overrides-alert";

interface ZedVariable {
  key: string;
  name: string;
  description: string;
}

interface ZedVariableGroup {
  label: string;
  description: string;
  variables: ZedVariable[];
}

const ZED_VARIABLE_GROUPS: ZedVariableGroup[] = [
  {
    label: "Syntax Highlighting",
    description: "Code syntax token colors",
    variables: [
      {
        key: "keyword",
        name: "Keywords",
        description: "Language keywords (import, export, const, async, etc.)",
      },
      {
        key: "function",
        name: "Functions",
        description: "Function names and declarations",
      },
      {
        key: "type",
        name: "Types",
        description: "Type annotations and definitions",
      },
      {
        key: "property",
        name: "Properties",
        description: "Object properties and attributes",
      },
      { key: "string", name: "Strings", description: "String literals" },
      { key: "number", name: "Numbers", description: "Numeric literals" },
      {
        key: "boolean",
        name: "Booleans",
        description: "Boolean values (true, false)",
      },
      {
        key: "constant",
        name: "Constants",
        description: "Constants and literals",
      },
      { key: "comment", name: "Comments", description: "Code comments" },
      {
        key: "comment.doc",
        name: "Doc Comments",
        description: "Documentation comments",
      },
      {
        key: "operator",
        name: "Operators",
        description: "Operators and symbols",
      },
      {
        key: "punctuation",
        name: "Punctuation",
        description: "Brackets, commas, semicolons",
      },
      { key: "tag", name: "Tags", description: "JSX/HTML tags" },
      {
        key: "attribute",
        name: "Attributes",
        description: "JSX/HTML attributes",
      },
      { key: "variable", name: "Variables", description: "Variable names" },
    ],
  },
  {
    label: "Editor Colors",
    description: "Editor background, foreground, and UI elements",
    variables: [
      {
        key: "editor.background",
        name: "Editor Background",
        description: "Main editor background color",
      },
      {
        key: "editor.foreground",
        name: "Editor Foreground",
        description: "Default text color in editor",
      },
      {
        key: "editor.gutter.background",
        name: "Gutter Background",
        description: "Line numbers gutter background",
      },
      {
        key: "editor.line_number",
        name: "Line Numbers",
        description: "Line number color",
      },
      {
        key: "editor.active_line_number",
        name: "Active Line Number",
        description: "Current line number color",
      },
      {
        key: "editor.active_line.background",
        name: "Active Line Background",
        description: "Current line background",
      },
    ],
  },
  {
    label: "UI Elements",
    description: "General UI colors and surfaces",
    variables: [
      {
        key: "background",
        name: "Background",
        description: "Main application background",
      },
      { key: "text", name: "Text", description: "Primary text color" },
      {
        key: "text.muted",
        name: "Muted Text",
        description: "Secondary text color",
      },
      { key: "border", name: "Border", description: "Border color" },
      {
        key: "border.variant",
        name: "Border Variant",
        description: "Alternative border color",
      },
    ],
  },
  {
    label: "Panels & Chrome",
    description: "Tab bar, status bar, and panel colors",
    variables: [
      {
        key: "tab_bar.background",
        name: "Tab Bar Background",
        description: "Tab bar background color",
      },
      {
        key: "tab.active_background",
        name: "Active Tab",
        description: "Active tab background",
      },
      {
        key: "tab.inactive_background",
        name: "Inactive Tab",
        description: "Inactive tab background",
      },
      {
        key: "status_bar.background",
        name: "Status Bar",
        description: "Status bar background color",
      },
      {
        key: "panel.background",
        name: "Panel Background",
        description: "Side panel background",
      },
    ],
  },
];

const CANONICAL_COLOR_KEYS: (keyof TinteBlock)[] = [
  "bg",
  "bg_2",
  "ui",
  "ui_2",
  "ui_3",
  "tx_3",
  "tx_2",
  "tx",
  "pr",
  "sc",
  "ac_1",
  "ac_2",
  "ac_3",
];

const COLOR_LABELS: Record<keyof TinteBlock, string> = {
  bg: "BG",
  bg_2: "BG2",
  ui: "UI",
  ui_2: "UI2",
  ui_3: "UI3",
  tx_3: "TX3",
  tx_2: "TX2",
  tx: "TX",
  pr: "PR",
  sc: "SC",
  ac_1: "AC1",
  ac_2: "AC2",
  ac_3: "AC3",
};

interface ZedTokenInputProps {
  variable: ZedVariable;
  value: string;
  onChange: (key: string, value: string) => void;
}

function ZedTokenInput({ variable, value, onChange }: ZedTokenInputProps) {
  const { tinteTheme, currentMode } = useThemeContext();
  const currentColors = tinteTheme?.[currentMode];

  const [localValue, setLocalValue] = React.useState(value || "");

  React.useEffect(() => {
    setLocalValue(value || "");
  }, [value, variable.key]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(variable.key, newValue);
  };

  const handleCanonicalColorSelect = (colorKey: keyof TinteBlock) => {
    const colorValue = currentColors?.[colorKey];
    if (colorValue) {
      handleChange(colorValue);
    }
  };

  const handleTailwindColorSelect = (color: string) => {
    handleChange(color);
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={variable.key} className="text-xs font-medium">
          {variable.name}
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-3 h-3 text-muted-foreground/60 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="text-xs font-medium">{variable.key}</p>
              <p className="text-xs">{variable.description}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <ColorPickerInput color={localValue || ""} onChange={handleChange} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-10 p-0 flex items-center justify-center"
              title="Select from canonical colors"
            >
              <InvertedLogo size={20} className="!w-5 !h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {CANONICAL_COLOR_KEYS.map((colorKey) => {
              const colorValue = currentColors?.[colorKey];
              const isSelected = colorValue === localValue;

              return (
                <DropdownMenuItem
                  key={colorKey}
                  onClick={() => handleCanonicalColorSelect(colorKey)}
                  disabled={!colorValue}
                  className="flex items-center gap-2"
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded border",
                      isSelected
                        ? "border-foreground border-2"
                        : "border-border",
                    )}
                    style={{ backgroundColor: colorValue || "#000000" }}
                  />
                  <span className="font-mono text-xs">
                    {COLOR_LABELS[colorKey]}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground font-mono">
                    {colorValue}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

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
            {localValue &&
              (() => {
                const palette = generateTailwindPalette(localValue);
                return palette.map((color) => {
                  const isSelected = color.value === localValue;

                  return (
                    <DropdownMenuItem
                      key={color.name}
                      onClick={() => handleTailwindColorSelect(color.value)}
                      className="flex items-center gap-2"
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded border",
                          isSelected
                            ? "border-foreground border-2"
                            : "border-border",
                        )}
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="font-mono text-xs">{color.name}</span>
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
    </div>
  );
}

interface ZedOverridesPanelProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
}

export function ZedOverridesPanel({
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search Zed theme properties...",
}: ZedOverridesPanelProps) {
  const { currentMode, mounted, tinteTheme } = useThemeContext();
  const zedOverrides = useZedOverrides();
  const clearOverrides = useClearOverrides({
    provider: "zed",
    providerHook: zedOverrides,
    providerDisplayName: "Zed",
  });
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    ZED_VARIABLE_GROUPS.reduce(
      (acc, group) => ({ ...acc, [group.label]: true }),
      {},
    ),
  );

  const getDefaultValue = React.useCallback(
    (key: string): string => {
      if (!mounted || !tinteTheme) {
        return currentMode === "dark" ? "#1e1e1e" : "#ffffff";
      }

      const currentColors = tinteTheme[currentMode];
      if (!currentColors) {
        return currentMode === "dark" ? "#1e1e1e" : "#ffffff";
      }

      const isDark = currentMode === "dark";

      // Syntax highlighting tokens
      if (key === "keyword") return currentColors.ac_1 || "#d73a49";
      if (key === "function") return currentColors.sc || "#6f42c1";
      if (key === "type") return currentColors.ac_2 || "#005cc5";
      if (key === "property") return currentColors.tx || "#24292e";
      if (key === "string") return currentColors.sc || "#032f62";
      if (key === "number") return currentColors.ac_3 || "#005cc5";
      if (key === "boolean") return currentColors.ac_3 || "#005cc5";
      if (key === "constant") return currentColors.ac_3 || "#005cc5";
      if (key === "comment") return currentColors.tx_3 || "#6a737d";
      if (key === "comment.doc") return currentColors.tx_2 || "#6a737d";
      if (key === "operator") return currentColors.tx || "#24292e";
      if (key === "punctuation") return currentColors.tx_2 || "#24292e";
      if (key === "tag") return currentColors.ac_2 || "#22863a";
      if (key === "attribute") return currentColors.pr || "#6f42c1";
      if (key === "variable") return currentColors.tx || "#24292e";

      // Editor colors
      if (key === "editor.background")
        return currentColors.bg_2 || currentColors.bg;
      if (key === "editor.foreground") return currentColors.tx;
      if (key === "editor.gutter.background")
        return currentColors.bg_2 || currentColors.bg;
      if (key === "editor.line_number") return currentColors.tx_3;
      if (key === "editor.active_line_number") return currentColors.tx_2;
      if (key === "editor.active_line.background") {
        return isDark ? "#ffffff10" : "#00000010";
      }

      // UI elements
      if (key === "background") return currentColors.bg;
      if (key === "text") return currentColors.tx;
      if (key === "text.muted") return currentColors.tx_2;
      if (key === "border") return currentColors.ui;
      if (key === "border.variant") return currentColors.ui_2;

      // Panels
      if (key === "tab_bar.background") return currentColors.bg;
      if (key === "tab.active_background") return currentColors.bg_2;
      if (key === "tab.inactive_background") return currentColors.bg;
      if (key === "status_bar.background") return currentColors.bg;
      if (key === "panel.background") return currentColors.bg;

      return currentMode === "dark" ? "#1e1e1e" : "#ffffff";
    },
    [mounted, tinteTheme, currentMode],
  );

  const filteredGroups = React.useMemo(() => {
    if (!searchQuery.trim()) return ZED_VARIABLE_GROUPS;

    return ZED_VARIABLE_GROUPS.map((group) => {
      const filteredVariables = group.variables.filter((variable) => {
        const query = searchQuery.toLowerCase();
        return (
          variable.key.toLowerCase().includes(query) ||
          variable.name.toLowerCase().includes(query) ||
          variable.description.toLowerCase().includes(query)
        );
      });

      return {
        ...group,
        variables: filteredVariables,
      };
    }).filter((group) => group.variables.length > 0);
  }, [searchQuery]);

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleVariableChange = (key: string, value: string) => {
    zedOverrides.setOverride(key, value);
  };

  const getVariableValue = (key: string): string => {
    return (
      zedOverrides.getValue(key, getDefaultValue(key)) || getDefaultValue(key)
    );
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

      <ScrollArea
        className="flex-1 min-h-0 pl-1 pr-3"
        showScrollIndicators={true}
        indicatorType="shadow"
      >
        <div className="space-y-4 pb-2">
          {clearOverrides.hasOverrides && (
            <ClearOverridesAlert
              providerDisplayName="Zed"
              isClearing={clearOverrides.isClearing}
              onClear={clearOverrides.handleClearOverrides}
            />
          )}
          {searchQuery.trim() && filteredGroups.length === 0 && (
            <div className="p-4 text-center text-muted-foreground bg-muted/20 rounded-md">
              <p className="text-sm">No properties found for "{searchQuery}"</p>
            </div>
          )}

          {filteredGroups.map((group) => (
            <Collapsible
              key={group.label}
              open={openGroups[group.label]}
              onOpenChange={() => toggleGroup(group.label)}
            >
              <CollapsibleTrigger
                className={cn(
                  "flex w-full items-center justify-between uppercase",
                  openGroups[group.label] ? "rounded-t-md" : "rounded-md",
                  "border border-border px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                )}
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    openGroups[group.label] ? "rotate-180" : "",
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="border border-t-0 border-border rounded-b-md bg-muted/20">
                <div className="p-3 space-y-3">
                  <p className="text-xs text-muted-foreground mb-3">
                    {group.description}
                  </p>
                  {group.variables.map((variable) => (
                    <ZedTokenInput
                      key={variable.key}
                      variable={variable}
                      value={getVariableValue(variable.key)}
                      onChange={handleVariableChange}
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
