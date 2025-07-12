"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { TinteLogo } from "../tinte-logo"

const themes = [
  { name: "shadcn/ui", path: "/cn" },
  { name: "VS Code", path: "/code" },
] as const

export function ThemeSelector() {
  const pathname = usePathname()
  const router = useRouter()

  const currentTheme = themes.find(theme => pathname.startsWith(theme.path))
  const displayName = currentTheme?.name || "Select Theme"

  const handleThemeChange = (path: string) => {
    router.push(path)
  }

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between h-auto p-3 text-left hover:bg-[var(--color-ui-subtle)] group-data-[collapsible=icon]:hidden"
              >
                <div className="flex flex-col min-w-0">
                  <TinteLogo />
                  <span className="text-[var(--color-text-base)] text-base font-semibold leading-tight truncate">
                    tinte{currentTheme?.path || ""}
                  </span>
                  <span className="text-[var(--color-text-subtle)] text-xs truncate">
                    Design {displayName} themes
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" className="group-data-[collapsible=icon]:block hidden">
            <p>tinte{currentTheme?.path || ""} - {displayName}</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent
          align="start"
          className="w-48 bg-[var(--color-ui-base)] border-[var(--color-border-base)]"
        >
          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme.path}
              onClick={() => handleThemeChange(theme.path)}
              className="cursor-pointer hover:bg-[var(--color-ui-subtle)]"
            >
              <div className="flex flex-col">
                <span className="font-medium text-[var(--color-text-base)]">tinte{theme.path}</span>
                <span className="text-xs text-[var(--color-text-subtle)]">
                  Design {theme.name} themes
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}