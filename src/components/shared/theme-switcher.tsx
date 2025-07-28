"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const cycleTheme = (event: React.MouseEvent) => {
    // Capture click coordinates
    const rect = event.currentTarget.getBoundingClientRect();
    const coords = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    
    // Emit custom event with coordinates for theme switch
    window.dispatchEvent(new CustomEvent('theme-switch-coords', { 
      detail: coords 
    }));
    
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={cycleTheme}>
      {getIcon()}
    </Button>
  );
}