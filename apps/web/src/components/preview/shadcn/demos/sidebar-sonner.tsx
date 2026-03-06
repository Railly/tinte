"use client";

import {
  Bell,
  CreditCard,
  LayoutPanelLeft,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: LayoutPanelLeft, label: "Overview", badge: "New" },
  { icon: Sparkles, label: "Themes" },
  { icon: Users, label: "Community", badge: "24" },
  { icon: CreditCard, label: "Billing" },
];

export function SidebarSonnerPreview() {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <SidebarProvider defaultOpen>
        <div className="flex min-h-[320px] w-full">
          <Sidebar collapsible="none" className="w-60 border-r">
            <SidebarHeader className="gap-3 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Tinte Workspace</p>
                  <p className="text-xs text-sidebar-foreground/70">
                    Sidebar tokens preview
                  </p>
                </div>
                <Badge variant="secondary">v4</Badge>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map(({ icon: Icon, label, badge }) => (
                      <SidebarMenuItem key={label}>
                        <SidebarMenuButton isActive={label === "Themes"}>
                          <Icon />
                          <span>{label}</span>
                        </SidebarMenuButton>
                        {badge ? (
                          <SidebarMenuBadge>{badge}</SidebarMenuBadge>
                        ) : null}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
              <div className="rounded-lg border border-sidebar-border bg-sidebar-accent p-3">
                <p className="text-sm font-medium text-sidebar-accent-foreground">
                  Theme status
                </p>
                <p className="mt-1 text-xs text-sidebar-accent-foreground/80">
                  Sidebar colors should track your generated tokens.
                </p>
              </div>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="min-h-[320px]">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <div>
                  <p className="text-sm font-semibold">Sonner Preview</p>
                  <p className="text-xs text-muted-foreground">
                    Toasts should follow popover, primary, accent, and
                    destructive tokens.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    toast.success("Theme applied", {
                      description:
                        "If the colors look right, Sonner support is wired correctly.",
                    })
                  }
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Show toast
                </Button>
              </div>

              <div className="grid flex-1 gap-4 p-4 md:grid-cols-2">
                <div className="rounded-xl border bg-card p-4 text-card-foreground">
                  <p className="text-sm font-medium">Tailwind v4 output</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The generated shadcn export uses CSS variables with `@theme
                    inline`, matching Tailwind v4-style usage.
                  </p>
                </div>
                <div className="rounded-xl border bg-muted p-4">
                  <p className="text-sm font-medium">What to verify</p>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li>
                      Sidebar background and borders follow sidebar tokens.
                    </li>
                    <li>Active nav item uses sidebar accent colors.</li>
                    <li>
                      Toasts inherit the current theme surfaces and accents.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
