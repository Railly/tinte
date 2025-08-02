"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTinteTheme } from "@/providers/tinte-theme-provider";

interface ThemeSwitcherProps {
  variant?: "button" | "dual";
}

export function ThemeSwitcher({ variant = "button" }: ThemeSwitcherProps) {
  const { mounted, isDark, currentMode, handleModeChange } = useTinteTheme();
  const id = useId();

  if (!mounted) {
    if (variant === "dual") {
      return (
        <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium opacity-50">
          <div className="absolute inset-0 h-[inherit] w-auto bg-input/50 rounded-md" />
          <span className="pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center text-muted-foreground/70">
            <Moon size={16} aria-hidden="true" />
          </span>
          <span className="pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center">
            <Sun size={16} aria-hidden="true" />
          </span>
        </div>
      );
    }
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  if (variant === "dual") {
    const handleToggle = (checked: boolean) => {
      const newMode = checked ? "dark" : "light";
      handleModeChange(newMode);
    };

    return (
      <div>
        <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
          <Switch
            id={id}
            checked={isDark}
            onCheckedChange={handleToggle}
            className="absolute border border-muted inset-0 h-[inherit] w-auto [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
          />
          <span className="pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center">
            <Sun size={16} aria-hidden="true" />
          </span>
          <span className="pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center">
            <Moon size={16} aria-hidden="true" />
          </span>
        </div>
        <Label htmlFor={id} className="sr-only">
          Theme switcher
        </Label>
      </div>
    );
  }

  const cycleTheme = (event: React.MouseEvent) => {
    // Simple dual toggle: light <-> dark
    const newMode = currentMode === "light" ? "dark" : "light";
    handleModeChange(newMode);
  };

  const getIcon = () => {
    return currentMode === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />;
  };

  return (
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={cycleTheme}>
      {getIcon()}
    </Button>
  );
}