"use client";

import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface RadiusSectionProps {
  themeOutput: any;
  isOpen: boolean;
  onToggle: () => void;
}

export function RadiusSection({
  themeOutput,
  isOpen,
  onToggle,
}: RadiusSectionProps) {
  if (!themeOutput.radius) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors border-t border-border/30">
        <span className="uppercase">Border Radius</span>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Object.entries(themeOutput.radius)
              .slice(0, 4)
              .map(([size, value]) => (
                <div
                  key={size}
                  className="w-3 h-3 bg-primary/30 border border-primary/40"
                  style={{
                    borderRadius: value as string,
                  }}
                  title={`${size}: ${value}`}
                />
              ))}
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-muted/20 border-t border-border/30">
        <div className="p-4">
          <div className="flex flex-wrap gap-3">
            {Object.entries(themeOutput.radius).map(([size, value]) => (
              <div key={size} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 bg-primary/20 border border-primary/30"
                  style={{
                    borderRadius: value as string,
                  }}
                />
                <div className="text-xs">
                  <div className="font-medium">{size}</div>
                  <div className="text-muted-foreground font-mono">
                    {String(value)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
