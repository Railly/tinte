"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import type { ThemeData } from "@/lib/theme";
import { extractThemeColors } from "@/lib/theme/utils";
import { cn } from "@/lib/utils";
import { ThemeColorPreview } from "../theme-color-preview";
import { getDisplayName } from "./utils";

interface ThemeTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  active: ThemeData | null | undefined;
  currentMode: "light" | "dark";
  isLoading: boolean;
  label: string;
  triggerClassName?: string;
  open: boolean;
}

export const ThemeTrigger = React.forwardRef<
  HTMLButtonElement,
  ThemeTriggerProps
>(function ThemeTrigger(
  { active, currentMode, isLoading, label, triggerClassName, open, ...props },
  ref,
) {
  return (
    <Button
      ref={ref}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      size="sm"
      className={cn(
        "justify-between gap-2 md:h-auto md:py-1.5 hover:text-muted-foreground",
        triggerClassName,
      )}
      title={label}
      {...props}
    >
      <div className="hidden md:flex items-center gap-2 min-w-0">
        {isLoading ? (
          <>
            <div className="flex gap-0.5">
              <div className="w-4 h-4 bg-muted/30 rounded-sm animate-pulse" />
              <div className="w-4 h-4 bg-muted/30 rounded-sm animate-pulse" />
              <div className="w-4 h-4 bg-muted/30 rounded-sm animate-pulse" />
            </div>
            <div className="h-4 w-16 bg-muted/30 rounded animate-pulse" />
          </>
        ) : (
          <>
            {active && (
              <ThemeColorPreview
                colors={extractThemeColors(active, currentMode)}
                maxColors={3}
              />
            )}
            <span className="truncate">
              {active ? getDisplayName(active) : label}
            </span>
          </>
        )}
      </div>

      <div className="flex md:hidden flex-col gap-1 min-w-0 flex-1">
        {isLoading ? (
          <>
            <div className="h-3 w-20 bg-muted/30 rounded animate-pulse" />
            <div className="flex gap-0.5">
              <div className="w-3 h-2 bg-muted/30 rounded-sm animate-pulse" />
              <div className="w-3 h-2 bg-muted/30 rounded-sm animate-pulse" />
              <div className="w-3 h-2 bg-muted/30 rounded-sm animate-pulse" />
              <div className="w-3 h-2 bg-muted/30 rounded-sm animate-pulse" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between w-full min-w-0">
              <span className="text-xs font-medium truncate">
                {active ? getDisplayName(active) : label}
              </span>
            </div>
            {active && (
              <ThemeColorPreview
                colors={extractThemeColors(active, currentMode)}
                maxColors={8}
                size="sm"
                className="self-start"
              />
            )}
          </>
        )}
      </div>

      <ChevronsUpDown className="ml-2 h-4 w-4 md:h-3 md:w-3 shrink-0 opacity-50" />
    </Button>
  );
});
