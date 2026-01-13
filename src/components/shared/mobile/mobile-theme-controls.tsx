"use client";

import { ChevronLeft, ChevronRight, Settings, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/providers/theme";
import { ThemeSelector } from "../theme";

interface MobileThemeControlsProps {
  onThemeEditorOpen: () => void;
}

export function MobileThemeControls({
  onThemeEditorOpen,
}: MobileThemeControlsProps) {
  const { allThemes, activeTheme, handleThemeSelect, navigateTheme } =
    useThemeContext();
  const activeId = activeTheme?.id || null;

  return (
    <div className="flex items-center justify-between p-3 border-b bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <ThemeSelector
          themes={allThemes}
          activeId={activeId}
          onSelect={handleThemeSelect}
          triggerClassName="flex-1 max-w-[140px]"
          label="Browse themes…"
        />
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTheme("prev")}
            className="px-2 h-8"
            title="Previous theme"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTheme("next")}
            className="px-2 h-8"
            title="Next theme"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTheme("random")}
            className="px-2 h-8"
            title="Random theme"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onThemeEditorOpen}
        className="ml-2 h-8"
      >
        <Settings className="h-4 w-4 mr-2" />
        Editor
      </Button>
    </div>
  );
}
