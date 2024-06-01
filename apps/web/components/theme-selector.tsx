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

export function ThemeSelector() {
  const { setTheme, theme } = useTheme();
  // eslint-disable-next-line no-unused-vars
  const [_, startTransition] = React.useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: "ghost" }), "h-8 w-full py-0")}
      >
        {theme === "light" ? (
          <IconSun className="mr-2 size-4" />
        ) : theme === "dark" ? (
          <IconMoon className="mr-2 size-4" />
        ) : (
          <IconComputer className="mr-2 size-4" />
        )}
        <span>Theme</span>
      </DropdownMenuTrigger>
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
            <IconSun className="mr-2 size-3" />
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
            <IconMoon className="mr-2 size-3" />
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
            <IconComputer className="mr-2 size-3" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
