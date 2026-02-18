"use client";

import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ShadowsSectionProps {
  themeOutput: any;
  isOpen: boolean;
  onToggle: () => void;
}

export function ShadowsSection({
  themeOutput,
  isOpen,
  onToggle,
}: ShadowsSectionProps) {
  if (!themeOutput.shadows) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors border-t border-border/30">
        <span className="uppercase">Shadow System</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
            <div
              className="w-3 h-3 bg-background border border-border rounded-sm"
              style={{
                boxShadow: `${themeOutput.shadows.offsetX} ${themeOutput.shadows.offsetY} ${themeOutput.shadows.blur} ${themeOutput.shadows.spread || "0px"} ${themeOutput.shadows.color}${Math.round(
                  parseFloat(themeOutput.shadows.opacity) * 255,
                )
                  .toString(16)
                  .padStart(2, "0")}`,
              }}
            />
            <span>{themeOutput.shadows.color}</span>
            <span>•</span>
            <span>{themeOutput.shadows.opacity}</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-muted/20 border-t border-border/30">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground">Color</span>
              <div className="font-mono bg-background/50 px-2 py-1 rounded border">
                {themeOutput.shadows.color}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Opacity</span>
              <div className="font-mono bg-background/50 px-2 py-1 rounded border">
                {themeOutput.shadows.opacity}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Blur</span>
              <div className="font-mono bg-background/50 px-2 py-1 rounded border">
                {themeOutput.shadows.blur}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Offset</span>
              <div className="font-mono bg-background/50 px-2 py-1 rounded border">
                {themeOutput.shadows.offsetX} {themeOutput.shadows.offsetY}
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
