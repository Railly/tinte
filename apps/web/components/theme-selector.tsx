"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconComputer, IconMoon, IconSun } from "@/components/ui/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function ThemeSelector() {
  const { setTheme, theme } = useTheme();
  // eslint-disable-next-line no-unused-vars
  const [_, startTransition] = React.useTransition();

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger>
          <DropdownMenuTrigger
            className={cn(buttonVariants({ variant: "ghost" }), "w-full py-0")}
          >
            {theme === "light" ? (
              <IconSun className="size-4" />
            ) : theme === "dark" ? (
              <IconMoon className="size-4" />
            ) : (
              <IconComputer className="size-4" />
            )}
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-xs mt-4">Theme</span>
        </TooltipContent>
      </Tooltip>
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
