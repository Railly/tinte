"use client";

import { ChevronDown, Info } from "lucide-react";
import * as React from "react";
import { TokenSearch } from "@/components/shared/token-search";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ColorPickerInput } from "@/components/ui/color-picker-input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme";

interface ShikiVariable {
  key: string;
  name: string;
  description: string;
}

interface ShikiVariableGroup {
  label: string;
  description: string;
  variables: ShikiVariable[];
}

// Organized Shiki CSS variables into logical groups
const SHIKI_VARIABLE_GROUPS: ShikiVariableGroup[] = [
  {
    label: "Core Colors",
    description: "Background, foreground, and primary text colors",
    variables: [
      {
        key: "--shiki-background",
        name: "Background",
        description: "Editor background color",
      },
      {
        key: "--shiki-foreground",
        name: "Foreground",
        description: "Default text color",
      },
    ],
  },
  {
    label: "Syntax Elements",
    description: "Keywords, operators, and language constructs",
    variables: [
      {
        key: "--shiki-token-keyword",
        name: "Keywords",
        description: "Language keywords (if, for, class, function, etc.)",
      },
      {
        key: "--shiki-token-constant",
        name: "Constants",
        description: "Constants and literals (true, false, null, etc.)",
      },
      {
        key: "--shiki-token-function",
        name: "Functions",
        description: "Function names and declarations",
      },
      {
        key: "--shiki-token-parameter",
        name: "Parameters",
        description: "Function parameters and arguments",
      },
    ],
  },
  {
    label: "Strings & Literals",
    description: "String literals, template expressions, and text content",
    variables: [
      {
        key: "--shiki-token-string",
        name: "Strings",
        description: "String literals and quoted text",
      },
      {
        key: "--shiki-token-string-expression",
        name: "String Expressions",
        description: "Template literals and string expressions",
      },
    ],
  },
  {
    label: "Comments & Documentation",
    description: "Comments, documentation, and annotations",
    variables: [
      {
        key: "--shiki-token-comment",
        name: "Comments",
        description: "Single and multi-line comments",
      },
    ],
  },
  {
    label: "Punctuation & Structure",
    description: "Brackets, operators, and structural elements",
    variables: [
      {
        key: "--shiki-token-punctuation",
        name: "Punctuation",
        description: "Brackets, commas, semicolons, and operators",
      },
      {
        key: "--shiki-token-link",
        name: "Links",
        description: "URLs and hyperlinks in code",
      },
    ],
  },
];

interface ShikiTokenInputProps {
  variable: ShikiVariable;
  value: string;
  onChange: (key: string, value: string) => void;
}

function ShikiTokenInput({ variable, value, onChange }: ShikiTokenInputProps) {
  // Ensure we always have a string value for ColorPickerInput
  const [localValue, setLocalValue] = React.useState(value || "");

  React.useEffect(() => {
    setLocalValue(value || "");
  }, [value, variable.key]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(variable.key, newValue);
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

      <ColorPickerInput
        color={localValue || ""} // Ensure never undefined
        onChange={handleChange}
      />
    </div>
  );
}

interface ShikiOverridesPanelProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
}

export function ShikiOverridesPanel({
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search CSS variables...",
}: ShikiOverridesPanelProps) {
  const { currentMode, mounted, tinteTheme } = useThemeContext();
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    SHIKI_VARIABLE_GROUPS.reduce(
      (acc, group) => ({ ...acc, [group.label]: true }),
      {},
    ),
  );

  const [overrides, setOverrides] = React.useState<Record<string, string>>({});

  // Initialize default values from current theme - ensure hex colors
  const getDefaultValue = React.useCallback(
    (key: string): string => {
      // Always return fallback colors if theme not ready
      if (!mounted || !tinteTheme) {
        // Return VS Code default colors based on mode
        switch (key) {
          case "--shiki-background":
            return currentMode === "dark" ? "#1e1e1e" : "#ffffff";
          case "--shiki-foreground":
            return currentMode === "dark" ? "#d4d4d4" : "#24292e";
          case "--shiki-token-comment":
            return currentMode === "dark" ? "#6a9955" : "#6a737d";
          case "--shiki-token-keyword":
            return currentMode === "dark" ? "#569cd6" : "#d73a49";
          case "--shiki-token-string":
            return currentMode === "dark" ? "#ce9178" : "#032f62";
          case "--shiki-token-constant":
            return currentMode === "dark" ? "#4fc1ff" : "#005cc5";
          case "--shiki-token-function":
            return currentMode === "dark" ? "#dcdcaa" : "#6f42c1";
          case "--shiki-token-parameter":
            return currentMode === "dark" ? "#9cdcfe" : "#24292e";
          case "--shiki-token-punctuation":
            return currentMode === "dark" ? "#d4d4d4" : "#24292e";
          case "--shiki-token-string-expression":
            return currentMode === "dark" ? "#b5cea8" : "#22863a";
          case "--shiki-token-link":
            return currentMode === "dark" ? "#4fc1ff" : "#0366d6";
          default:
            return currentMode === "dark" ? "#d4d4d4" : "#24292e";
        }
      }

      const currentColors = tinteTheme[currentMode];

      if (!currentColors) {
        // Fallback to VS Code defaults if currentColors is undefined
        switch (key) {
          case "--shiki-background":
            return currentMode === "dark" ? "#1e1e1e" : "#ffffff";
          case "--shiki-foreground":
            return currentMode === "dark" ? "#d4d4d4" : "#24292e";
          case "--shiki-token-comment":
            return currentMode === "dark" ? "#6a9955" : "#6a737d";
          case "--shiki-token-keyword":
            return currentMode === "dark" ? "#569cd6" : "#d73a49";
          case "--shiki-token-string":
            return currentMode === "dark" ? "#ce9178" : "#032f62";
          case "--shiki-token-constant":
            return currentMode === "dark" ? "#4fc1ff" : "#005cc5";
          case "--shiki-token-function":
            return currentMode === "dark" ? "#dcdcaa" : "#6f42c1";
          case "--shiki-token-parameter":
            return currentMode === "dark" ? "#9cdcfe" : "#24292e";
          case "--shiki-token-punctuation":
            return currentMode === "dark" ? "#d4d4d4" : "#24292e";
          case "--shiki-token-string-expression":
            return currentMode === "dark" ? "#b5cea8" : "#22863a";
          case "--shiki-token-link":
            return currentMode === "dark" ? "#4fc1ff" : "#0366d6";
          default:
            return currentMode === "dark" ? "#d4d4d4" : "#24292e";
        }
      }

      // Helper to ensure valid color format with fallbacks
      const ensureValidColor = (
        color: string | undefined,
        fallback: string,
      ): string => {
        if (!color || color.trim() === "") return fallback;
        return color;
      };

      // Map Shiki CSS variables to theme colors with fallbacks
      switch (key) {
        case "--shiki-background":
          return ensureValidColor(
            currentColors.bg,
            currentMode === "dark" ? "#1e1e1e" : "#ffffff",
          );
        case "--shiki-foreground":
          return ensureValidColor(
            currentColors.tx,
            currentMode === "dark" ? "#d4d4d4" : "#24292e",
          );
        case "--shiki-token-comment":
          return ensureValidColor(
            currentColors.tx_3,
            currentMode === "dark" ? "#6a9955" : "#6a737d",
          );
        case "--shiki-token-keyword":
          return ensureValidColor(
            currentColors.pr || currentColors.sc,
            currentMode === "dark" ? "#569cd6" : "#d73a49",
          );
        case "--shiki-token-string":
          return ensureValidColor(
            currentColors.ac || currentColors.ac_2,
            currentMode === "dark" ? "#ce9178" : "#032f62",
          );
        case "--shiki-token-constant":
          return ensureValidColor(
            currentColors.sc || currentColors.pr,
            currentMode === "dark" ? "#4fc1ff" : "#005cc5",
          );
        case "--shiki-token-function":
          return ensureValidColor(
            currentColors.ac_2 || currentColors.pr,
            currentMode === "dark" ? "#dcdcaa" : "#6f42c1",
          );
        case "--shiki-token-parameter":
          return ensureValidColor(
            currentColors.tx_2,
            currentMode === "dark" ? "#9cdcfe" : "#24292e",
          );
        case "--shiki-token-punctuation":
          return ensureValidColor(
            currentColors.tx_2,
            currentMode === "dark" ? "#d4d4d4" : "#24292e",
          );
        case "--shiki-token-string-expression":
          return ensureValidColor(
            currentColors.ac_3 || currentColors.ac,
            currentMode === "dark" ? "#b5cea8" : "#22863a",
          );
        case "--shiki-token-link":
          return ensureValidColor(
            currentColors.pr || currentColors.sc,
            currentMode === "dark" ? "#4fc1ff" : "#0366d6",
          );
        default:
          return "";
      }
    },
    [mounted, tinteTheme, currentMode],
  );

  // Filter variable groups based on search query
  const filteredGroups = React.useMemo(() => {
    if (!searchQuery.trim()) return SHIKI_VARIABLE_GROUPS;

    return SHIKI_VARIABLE_GROUPS.map((group) => {
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
    setOverrides((prev) => ({ ...prev, [key]: value }));

    // Apply CSS variable to document root for live preview
    if (value.trim()) {
      document.documentElement.style.setProperty(key, value);
    } else {
      document.documentElement.style.removeProperty(key);
    }
  };

  // Force re-render when theme changes for real-time updates from canonical tab
  const themeHash = React.useMemo(() => {
    if (!mounted || !tinteTheme) return "";
    const currentColors = tinteTheme[currentMode];
    if (!currentColors) return "";
    // Create a hash of all theme colors to detect changes
    return JSON.stringify(currentColors);
  }, [mounted, tinteTheme, currentMode]);

  // Clear overrides when theme hash changes to get real-time updates from canonical tab
  React.useEffect(() => {
    if (!themeHash) return;
    // Clear all overrides to get fresh values from theme
    setOverrides({});
  }, [themeHash]);

  // Apply default CSS variables when theme changes
  React.useEffect(() => {
    if (!mounted || !tinteTheme) return;

    // Apply all default Shiki CSS variables
    SHIKI_VARIABLE_GROUPS.forEach((group) => {
      group.variables.forEach((variable) => {
        const defaultValue = getDefaultValue(variable.key);
        if (defaultValue) {
          document.documentElement.style.setProperty(
            variable.key,
            defaultValue,
          );
        }
      });
    });
  }, [mounted, tinteTheme, currentMode, getDefaultValue, themeHash]);

  const getVariableValue = (key: string): string => {
    return overrides[key] || getDefaultValue(key);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-1 pb-2">
        <h3 className="text-sm font-medium flex items-center gap-1">
          Shiki CSS Variables ({currentMode})
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3 h-3 text-muted-foreground/60 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Customize syntax highlighting colors using CSS variables for
                Shiki themes
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
          {searchQuery.trim() && filteredGroups.length === 0 && (
            <div className="p-4 text-center text-muted-foreground bg-muted/20 rounded-md">
              <p className="text-sm">
                No CSS variables found for "{searchQuery}"
              </p>
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
                    <ShikiTokenInput
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
