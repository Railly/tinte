"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function ModeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="sm"
                className="bg-ui-base hover:bg-ui-subtle border border-border-base"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="ml-2 group-data-[collapsible=icon]:hidden">Theme</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" className="group-data-[collapsible=icon]:block hidden">
            <p>Switch theme</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="start" className="bg-ui-base border-border-base">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="hover:bg-ui-subtle text-text-base"
          data-state={theme === "light" ? "checked" : "unchecked"}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="hover:bg-ui-subtle text-text-base"
          data-state={theme === "dark" ? "checked" : "unchecked"}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="hover:bg-ui-subtle text-text-base"
          data-state={theme === "system" ? "checked" : "unchecked"}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}