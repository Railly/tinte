"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled>
          <Sun className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Monitor className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Moon className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        <Button
          variant={theme === "light" ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme("light")}
        >
          <Sun className="h-4 w-4" />
        </Button>
        <Button
          variant={theme === "system" ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme("system")}
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-4 w-4" />
        </Button>
      </div>
      {theme === "system" && (
        <Badge variant="secondary" className="text-xs">
          {resolvedTheme === "dark" ? "Dark" : "Light"}
        </Badge>
      )}
    </div>
  );
}