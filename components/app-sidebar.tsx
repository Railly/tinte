"use client"

import * as React from "react"
import {
  Plus,
  Download,
  RotateCcw,
  User,
  Palette,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Circle,
} from "lucide-react"

import { ContextualHeader } from "@/components/contextual-header"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type VariantStatus = "completed" | "executing" | "failed" | "queued" | "not_built"

interface EditorVariant {
  target: "vscode" | "shadcn" | "zed" | "vim"
  status: VariantStatus
  downloadUrl?: string
}

interface Theme {
  id: string
  name: string
  shortcut?: string
  variants: EditorVariant[]
  isExpanded?: boolean
}

const mockThemes: Theme[] = [
  {
    id: "neon-cyber",
    name: "NeonCyber",
    shortcut: "⌘1",
    isExpanded: true,
    variants: [
      { target: "vscode", status: "completed", downloadUrl: "/download/neon-cyber-vscode.json" },
      { target: "shadcn", status: "executing" },
      { target: "zed", status: "not_built" },
      { target: "vim", status: "not_built" },
    ],
  },
  {
    id: "dracula-pink",
    name: "DraculaPink",
    shortcut: "⌘2",
    variants: [
      { target: "vscode", status: "completed", downloadUrl: "/download/dracula-pink-vscode.json" },
      { target: "shadcn", status: "not_built" },
      { target: "zed", status: "not_built" },
      { target: "vim", status: "not_built" },
    ],
  },
  {
    id: "midnight-aura",
    name: "MidnightAura",
    shortcut: "⌘3",
    variants: [
      { target: "shadcn", status: "completed", downloadUrl: "/download/midnight-aura-shadcn.json" },
      { target: "vscode", status: "not_built" },
      { target: "zed", status: "not_built" },
      { target: "vim", status: "not_built" },
    ],
  },
]

const editorIcons = {
  vscode: "VS Code",
  shadcn: "shadcn/ui",
  zed: "Zed",
  vim: "Vim",
}

function StatusIcon({ status }: { status: VariantStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-3 w-3 text-green-500" />
    case "executing":
      return <Clock className="h-3 w-3 text-blue-500 animate-spin" />
    case "failed":
      return <AlertTriangle className="h-3 w-3 text-red-500" />
    case "queued":
      return <Clock className="h-3 w-3 text-yellow-500" />
    case "not_built":
      return <Circle className="h-3 w-3 text-gray-400" />
  }
}

function VariantActions({ variant }: { variant: EditorVariant }) {
  if (variant.status === "completed" && variant.downloadUrl) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 px-2">
            <Download className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Download className="h-4 w-4 mr-2" />
            Download .json
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant.status === "failed") {
    return (
      <Button variant="ghost" size="sm" className="h-6 px-2">
        <RotateCcw className="h-3 w-3" />
      </Button>
    )
  }

  if (variant.status === "not_built") {
    return (
      <Button variant="ghost" size="sm" className="h-6 px-2">
        <Plus className="h-3 w-3" />
      </Button>
    )
  }

  return null
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ContextualHeader />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Themes</SidebarGroupLabel>
          <SidebarMenu>
            {mockThemes.map((theme) => (
              <Collapsible
                key={theme.id}
                asChild
                defaultOpen={theme.isExpanded}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex-1" tooltip={theme.name}>
                        <div className="flex items-center gap-2 flex-1">
                          <span className="font-medium">{theme.name}</span>
                          {theme.shortcut && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              {theme.shortcut}
                            </Badge>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 px-2 ml-1">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Plus className="h-4 w-4 mr-2" />
                          Add variant
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {theme.variants.map((variant) => (
                        <SidebarMenuSubItem key={variant.target}>
                          <SidebarMenuSubButton asChild>
                            <div className="flex items-center justify-between w-full px-2 py-1">
                              <div className="flex items-center gap-2">
                                <StatusIcon status={variant.status} />
                                <span className="text-sm">
                                  {editorIcons[variant.target]}
                                </span>
                              </div>
                              <VariantActions variant={variant} />
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <div className="border-t border-sidebar-border my-2" />

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Palette className="h-4 w-4" />
                <span className="font-medium">Design new palette</span>
                <Badge variant="secondary" className="text-xs px-1 py-0 ml-auto">
                  ⌘N
                </Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User className="h-4 w-4" />
              <span>Account / Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}
