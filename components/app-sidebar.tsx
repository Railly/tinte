"use client"

import * as React from "react"
import { UserButton } from "@clerk/nextjs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ModeSwitcher } from "./sidebar/mode-switcher"
import { TinteLogo } from "./tinte-logo"
import { ThemeSelector } from "./sidebar/theme-selector"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-[var(--color-ui-subtle)]" asChild>
                  <ThemeSelector />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        {/* Minimal content - can be expanded later */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <ModeSwitcher />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center justify-center p-2">
                  <UserButton />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}