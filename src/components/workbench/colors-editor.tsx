"use client";

import { useState } from "react";
import { useThemeContext } from "@/providers/theme";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TinteBlock } from "@/types/tinte";

const COLOR_GROUPS = [
  {
    label: "Text",
    keys: ["text", "text_2", "text_3"] as (keyof TinteBlock)[],
  },
  {
    label: "Interface",
    keys: ["interface", "interface_2", "interface_3"] as (keyof TinteBlock)[],
  },
  {
    label: "Background",
    keys: ["background", "background_2"] as (keyof TinteBlock)[],
  },
  {
    label: "Accents",
    keys: [
      "primary",
      "secondary",
      "accent",
      "accent_2",
      "accent_3",
    ] as (keyof TinteBlock)[],
  },
] as const;

export function ColorsEditor() {
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
      <div className="px-4 pb-3">
        <h3 className="text-sm font-medium">
          Canonical Colors ({currentMode})
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Edit the source colors that generate all theme variants
        </p>
      </div>

      <ScrollArea
        className="flex-1 max-h-[77dvh] px-3"
        showScrollIndicators={true}
        indicatorType="shadow"
      >
        <div className="space-y-3 pb-3">
          {COLOR_GROUPS.map(({ label, keys }) => (
            <Collapsible
              key={label}
              open={openGroups[label]}
              onOpenChange={() => toggleGroup(label)}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                <span>{label}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openGroups[label] ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="border border-t-0 border-border rounded-b-md bg-muted/20">
                <div className="p-3 space-y-3">
                  {keys.map((key) => (
                    <div key={key} className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded border border-border flex-shrink-0"
                        style={{ backgroundColor: currentColors[key] }}
                      />
                      <div className="flex-1 space-y-1">
                        <Label htmlFor={key} className="text-xs font-medium">
                          {key.replace(/_/g, "-")}
                        </Label>
                        <Input
                          id={key}
                          value={currentColors[key]}
                          onChange={(e) =>
                            handleColorChange(key, e.target.value)
                          }
                          className="h-7 text-xs font-mono"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
