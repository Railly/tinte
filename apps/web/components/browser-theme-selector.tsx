"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconComputer, IconMoon, IconSun } from "@/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function BrowserThemeSelector() {
  const { setTheme, theme } = useTheme();
  const [, startTransition] = React.useTransition();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                {theme === "light" ? (
                  <IconSun />
                ) : theme === "dark" ? (
                  <IconMoon />
                ) : (
                  <IconComputer />
                )}
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <TooltipContent>
            <span className="text-xs mt-4">Theme</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuPortal>
        <DropdownMenuContent className="w-32 space-y-1">
          <DropdownMenuItem
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-8 w-full justify-start py-0",
              {
                "bg-muted text-muted-foreground": theme === "light",
              }
            )}
            onClick={() => {
              startTransition(() => {
                setTheme("light");
              });
            }}
          >
            <IconSun className="size-3" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-8 w-full justify-start py-0",
              {
                "bg-muted text-muted-foreground": theme === "dark",
              }
            )}
            onClick={() => {
              startTransition(() => {
                setTheme("dark");
              });
            }}
          >
            <IconMoon className="size-3" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-8 w-full justify-start py-0",
              {
                "bg-muted text-muted-foreground": theme === "system",
              }
            )}
            onClick={() => {
              startTransition(() => {
                setTheme("system");
              });
            }}
          >
            <IconComputer className="size-3" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
