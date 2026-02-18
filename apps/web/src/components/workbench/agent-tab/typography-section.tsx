"use client";

import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FontPreview } from "./font-preview";

interface TypographySectionProps {
  themeOutput: any;
  isOpen: boolean;
  onToggle: () => void;
}

export function TypographySection({
  themeOutput,
  isOpen,
  onToggle,
}: TypographySectionProps) {
  if (!themeOutput.fonts) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors border-t border-border/30">
        <span className="uppercase">Typography</span>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 text-[10px] text-muted-foreground">
            <span
              className="truncate max-w-16"
              style={{
                fontFamily: `"${themeOutput.fonts.sans}", sans-serif`,
              }}
            >
              {themeOutput.fonts.sans}
            </span>
            <span>•</span>
            <span
              className="truncate max-w-16"
              style={{
                fontFamily: `"${themeOutput.fonts.serif}", serif`,
              }}
            >
              {themeOutput.fonts.serif}
            </span>
            <span>•</span>
            <span
              className="truncate max-w-16"
              style={{
                fontFamily: `"${themeOutput.fonts.mono}", monospace`,
              }}
            >
              {themeOutput.fonts.mono}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-muted/20 border-t border-border/30">
        <div className="p-4">
          <FontPreview fonts={themeOutput.fonts} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
