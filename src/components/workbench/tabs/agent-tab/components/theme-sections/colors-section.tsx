"use client";

import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ThemeColorPreview } from "@/components/shared/theme-color-preview";
import { extractThemeColors } from "@/lib/theme-utils";

interface ColorsSectionProps {
  themeOutput: any;
  currentMode: "light" | "dark";
  isOpen: boolean;
  onToggle: () => void;
}

export function ColorsSection({
  themeOutput,
  currentMode,
  isOpen,
  onToggle,
}: ColorsSectionProps) {
  if (!themeOutput.theme) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors border-t border-border/30">
        <span className="uppercase">Colors</span>
        <div className="flex items-center gap-2">
          <ThemeColorPreview
            colors={extractThemeColors(
              {
                rawTheme: {
                  light: themeOutput.theme.light,
                  dark: themeOutput.theme.dark,
                },
              } as any,
              currentMode,
            )}
            size="sm"
            maxColors={6}
          />
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-muted/20 border-t border-border/30">
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-medium text-muted-foreground mb-2 block">
                Light Mode
              </span>
              <ThemeColorPreview
                colors={themeOutput.theme.light || {}}
                size="md"
                maxColors={8}
                className="justify-start"
              />
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground mb-2 block">
                Dark Mode
              </span>
              <ThemeColorPreview
                colors={themeOutput.theme.dark || {}}
                size="md"
                maxColors={8}
                className="justify-start"
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
