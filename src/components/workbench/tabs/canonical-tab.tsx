"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ColorPickerInput } from "@/components/ui/color-picker-input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useThemeContext } from "@/providers/theme";
import type { TinteBlock } from "@/types/tinte";

const COLOR_GROUPS = [
  {
    label: "Text",
    keys: ["tx", "tx_2", "tx_3"] as (keyof TinteBlock)[],
  },
  {
    label: "Interface",
    keys: ["ui", "ui_2", "ui_3"] as (keyof TinteBlock)[],
  },
  {
    label: "Background",
    keys: ["bg", "bg_2"] as (keyof TinteBlock)[],
  },
  {
    label: "Accents",
    keys: ["pr", "sc", "ac_1", "ac_2", "ac_3"] as (keyof TinteBlock)[],
  },
] as const;

export function CanonicalTab() {
  const { tinteTheme, updateTinteTheme, currentMode } = useThemeContext();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Text: true,
    Interface: true,
    Background: true,
    Accents: true,
  });

  if (!tinteTheme) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No theme selected
      </div>
    );
  }

  const currentColors = tinteTheme[currentMode];

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
          {COLOR_GROUPS.map(({ label, keys }) => (
            <Collapsible
              key={label}
              open={openGroups[label]}
              onOpenChange={() => toggleGroup(label)}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between uppercase rounded-t-md border border-border px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                <span>{label}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openGroups[label] ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="border border-t-0 border-border rounded-b-md bg-muted/20">
                <div className="p-3 space-y-3">
                  {keys.map((key, tokenIndex) => {
                    // Calculate the color number based on position across all color groups
                    const previousColorGroups = COLOR_GROUPS
                      .slice(0, COLOR_GROUPS.findIndex(g => g.label === label))
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
                        <ColorPickerInput
                          color={currentColors[key]}
                          onChange={(newValue) =>
                            handleColorChange(key, newValue)
                          }
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