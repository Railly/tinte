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
import type { TinteBlock } from "@/types/tinte";
import {
  COLOR_GROUPS,
  createCanonicalSkeletons,
  createInitialCanonicalGroups,
  hasValidTinteColors,
} from "@/lib/canonical-utils";
import { CanonicalColorInput } from "@/components/shared/canonical-color-input";

export function CanonicalTab() {
  const { tinteTheme, updateTinteTheme, currentMode, mounted } = useThemeContext();
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(createInitialCanonicalGroups);

  // Determine if we should show skeletons or real data
  const currentColors = tinteTheme?.[currentMode];
  const shouldShowSkeletons = !mounted || !hasValidTinteColors(currentColors);
  const groupsToRender = shouldShowSkeletons ? createCanonicalSkeletons() : COLOR_GROUPS;

  const handleColorChange = (key: keyof TinteBlock, value: string) => {
    updateTinteTheme(currentMode, { [key]: value });
  };

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-1 pb-3">
        <h3 className="text-sm font-medium">
          Canonical Colors ({currentMode})
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Edit the source colors that generate all theme variants
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
              <CollapsibleTrigger className={`flex w-full items-center justify-between uppercase ${openGroups[group.label] ? "rounded-t-md" : "rounded-md"} border border-border px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors`}>
                <span>{group.label}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openGroups[group.label] ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="border border-t-0 border-border rounded-b-md bg-muted/20">
                <div className="p-3 space-y-3">
                  {group.keys.map((key, tokenIndex) => {
                    // Calculate the color number based on position across all color groups
                    const previousColorGroups = COLOR_GROUPS
                      .slice(0, COLOR_GROUPS.findIndex(g => g.label === group.label))
                      .filter(g => g.keys.length > 0);
                    const previousColorCount = previousColorGroups.reduce(
                      (sum, g) => sum + g.keys.length, 
                      0
                    );
                    const colorNumber = previousColorCount + tokenIndex + 1;
                    
                    return (
                      <div key={key} className="space-y-1">
                        <Label htmlFor={key} className="text-xs font-medium flex items-center gap-1">
                          {key.replace(/_/g, "-")}
                          <sup className="text-[10px] text-muted-foreground/60 font-mono">
                            {colorNumber}
                          </sup>
                        </Label>
                        <CanonicalColorInput
                          group={group}
                          colorKey={key}
                          value={currentColors?.[key]}
                          onChange={handleColorChange}
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