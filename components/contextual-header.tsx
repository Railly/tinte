"use client"

import { usePathname } from "next/navigation"
import { TinteLogo } from "./tinte-logo"

export function ContextualHeader() {
  const pathname = usePathname()
  const target = pathname.split("/")[1]

  return (
    <div
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center gap-2"
    >
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <TinteLogo className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">tinte{target && `/${target}`}</span>
        <span className="truncate text-xs">
          {!target && "Craft themes"}
          {target === "code" && "VS Code / Cursor"}
          {target === "cn" && "shadcn/ui"}
          {target === "zed" && "Zed Code Editor"}
        </span>
      </div>
    </div>
  )
}
